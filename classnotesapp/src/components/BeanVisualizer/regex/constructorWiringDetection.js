import { extractClassBody } from './beanDetection.js';

// Detectar wiring por inyección de constructor (nombre exacto, soporta @Qualifier y validación estructural)
export function parseConstructorWirings(text, beans) {
  // Mapa de clase a beanName
  const classToBeanName = {};
  beans.forEach(bean => {
    classToBeanName[bean.className] = bean.beanName;
  });
  // Mapa de beanName a bean
  const beanNameToBean = {};
  beans.forEach(bean => {
    beanNameToBean[bean.beanName] = bean;
  });

  const constructorWirings = [];
  const missingConstructorTypes = [];

  // Parser robusto de parámetros: split solo en comas fuera de paréntesis
  function splitParams(paramString) {
    const params = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < paramString.length; i++) {
      const c = paramString[i];
      if (c === '(') depth++;
      if (c === ')') depth--;
      if (c === ',' && depth === 0) {
        params.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    if (current.trim()) params.push(current.trim());
    return params.filter(Boolean);
  }
  // Parser manual para extraer la lista de parámetros de la firma del constructor (soporta paréntesis anidados correctamente)
  function extractParamsFromClassBody(classBody, ctorStart) {
    const openIdx = classBody.indexOf('(', ctorStart);
    if (openIdx === -1) return '';
    let depth = 1;
    let params = '';
    for (let i = openIdx + 1; i < classBody.length; i++) {
      const c = classBody[i];
      if (c === '(') depth++;
      if (c === ')') depth--;
      if (depth === 0) break;
      params += c;
    }
    return params;
  }

  // Buscar clases que son beans (solo @Component o declaradas con @Bean)
  const classRegex = /public\s+class\s+(\w+)\s*\{/g;
  let match;
  while ((match = classRegex.exec(text)) !== null) {
    const className = match[1];
    const classStart = match.index + match[0].length - 1;
    const classBody = extractClassBody(text, classStart);
    const sourceBeanName = classToBeanName[className];
    
    // Solo analizar si es un bean (tiene @Component o está declarado con @Bean)
    if (!sourceBeanName) continue;
    
    // Verificar que realmente es un bean (tiene @Component o está en configuración)
    const isComponent = classBody.includes('@Component') || 
                       classBody.includes('@Service') || 
                       classBody.includes('@Repository') || 
                       classBody.includes('@Controller');
    
    // Solo analizar constructores de clases con @Component, no de clases declaradas con @Bean
    if (!isComponent) continue;

    // Buscar todos los constructores públicos
    const ctorRegex = new RegExp(`(@Autowired[\\s\\S]*?)?public +${className} *\\(`, 'g');
    let ctors = [];
    let ctorMatch;
    while ((ctorMatch = ctorRegex.exec(classBody)) !== null) {
      ctors.push({
        autowired: ctorMatch[1] !== undefined,
        start: ctorMatch.index
      });
    }
    // Si solo hay un constructor, wiring aunque no tenga @Autowired
    // Si hay más de uno, solo wiring para los que tengan @Autowired
    for (const ctor of ctors) {
      if (ctors.length > 1 && !ctor.autowired) continue;
      const paramsString = extractParamsFromClassBody(classBody, ctor.start);
      const params = splitParams(paramsString);
      for (const param of params) {
        const qualifierMatch = param.match(/@Qualifier\s*\(\s*"([^"]+)"\s*\)/);
        const trimmedParam = param.trim();
        const typeNameMatch = trimmedParam.match(/([\w<>]+)\s+(\w+)$/);
        let paramType, paramName;
        if (typeNameMatch) {
          paramType = typeNameMatch[1];
          paramName = typeNameMatch[2];
        }
        if (qualifierMatch) {
          const targetBeanName = qualifierMatch[1];
          const targetBean = beanNameToBean[targetBeanName];
          if (targetBean && paramType) {
            // Validar que el tipo del parámetro existe como interfaz o clase
            const declaredInterfaces = Array.from(text.matchAll(/public\s+interface\s+(\w+)/g)).map(m => m[1]);
            const declaredClasses = Array.from(text.matchAll(/public\s+class\s+(\w+)/g)).map(m => m[1]);
            const typeExists = declaredInterfaces.includes(paramType) || declaredClasses.includes(paramType);
            
            if (!typeExists) {
              missingConstructorTypes.push({
                from: sourceBeanName,
                paramType,
                paramName,
                error: `La interfaz/clase '${paramType}' no existe. Las interfaces declaradas son: ${declaredInterfaces.join(', ') || 'ninguna'}. Las clases declaradas son: ${declaredClasses.join(', ')}.`
              });
            } else {
              const classDeclPattern = new RegExp(`public class ${targetBean.className}[^{]*{`, 's');
              const classDeclMatch = text.match(classDeclPattern);
              let implementsType = false;
              let interfaces = [];
              if (classDeclMatch && classDeclMatch[0]) {
                const implementsMatch = classDeclMatch[0].match(/implements\s+([\s\S]*?)\{/);
                if (implementsMatch && implementsMatch[1]) {
                  interfaces = implementsMatch[1].split(',').map(s => s.trim());
                  if (interfaces.includes(paramType)) implementsType = true;
                }
              }
              if (targetBean.className === paramType || implementsType) {
                constructorWirings.push({
                  from: sourceBeanName,
                  to: targetBeanName,
                  paramType,
                  paramName
                });
              }
            }
          }
        } else if (paramType) {
          // Buscar beans compatibles por tipo
          const compatibleBeans = beans.filter(bean => {
            if (bean.className === paramType) return true;
            // Buscar si implementa la interfaz
            const classDeclPattern = new RegExp(`public class ${bean.className}[^{]*{`, 's');
            const classDeclMatch = text.match(classDeclPattern);
            if (classDeclMatch && classDeclMatch[0]) {
              const implementsMatch = classDeclMatch[0].match(/implements +([\s\S]*?){/);
              if (implementsMatch && implementsMatch[1]) {
                const interfaces = implementsMatch[1].split(',').map(s => s.trim());
                if (interfaces.includes(paramType)) return true;
              }
            }
            return false;
          });
          if (compatibleBeans.length === 1) {
            constructorWirings.push({
              from: sourceBeanName,
              to: compatibleBeans[0].beanName,
              paramType,
              paramName
            });
          } else if (compatibleBeans.length > 1) {
            // Ambigüedad: más de un bean compatible
            constructorWirings.push({
              from: sourceBeanName,
              to: null,
              paramType,
              paramName,
              error: 'Ambiguous constructor wiring: multiple beans match type ' + paramType
            });
          } else {
            // Ningún bean compatible
            missingConstructorTypes.push({
              from: sourceBeanName,
              paramType,
              paramName,
              error: `No se encontró ningún bean cuyo tipo o interfaz implementada coincida con '${paramType}' para el constructor de '${sourceBeanName}'. ¿Quizá la interfaz o clase está mal escrita o no existe?`
            });
          }
        }
      }
    }
  }
  return {
    constructorWirings,
    missingConstructorTypes
  };
} 