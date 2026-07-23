import { extractClassBody } from './beanDetection.js';

// Detectar wiring por métodos @Autowired y por @Qualifier con validación estructural
export function parseMethodWirings(text, beans) {
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

  const methodWirings = [];
  const missingAutowiredMethodTypes = [];

  // Buscar clases y sus métodos
  const classRegex = /public\s+class\s+(\w+)\s*\{/g;
  let match;
  while ((match = classRegex.exec(text)) !== null) {
    const className = match[1];
    const classStart = match.index + match[0].length - 1;
    const classBody = extractClassBody(text, classStart);
    const sourceBeanName = classToBeanName[className];
    if (!sourceBeanName) continue;

    // DEBUG: imprimir el cuerpo de la clase para todos los casos
    console.log('DEBUG classBody', classBody);
    // Parser robusto de parámetros: split solo en comas fuera de paréntesis y termina cuando el balance vuelve a cero
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
    // Parser manual para extraer la lista de parámetros de la firma del método (soporta paréntesis anidados correctamente)
    function extractParamsFromClassBody(classBody, methodStart) {
      const openIdx = classBody.indexOf('(', methodStart);
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
    // Probar un regex más simple para detectar métodos públicos y capturar nombre y firma completa
    const methodRegex = /(@Autowired[\s\S]*?)?public\s+\w+\s+(\w+)\s*\(/g;
    let methodMatch;
    while ((methodMatch = methodRegex.exec(classBody)) !== null) {
      const autowiredPresent = methodMatch[1] !== undefined;
      if (!autowiredPresent) continue;
      const methodName = methodMatch[2];
      const methodStart = methodMatch.index;
      const paramsString = extractParamsFromClassBody(classBody, methodStart);
      const params = splitParams(paramsString);
      // DEBUG: imprimir paramsString y params
      console.log('DEBUG paramsString', paramsString);
      console.log('DEBUG params', params);
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
              missingAutowiredMethodTypes.push({
                from: sourceBeanName,
                method: methodName,
                paramType,
                paramName,
                error: `La interfaz/clase '${paramType}' no existe. Las interfaces declaradas son: ${declaredInterfaces.join(', ') || 'ninguna'}. Las clases declaradas son: ${declaredClasses.join(', ')}.`
              });
            } else {
              // Validar que la clase del bean destino implemente o sea del tipo del parámetro
              const classDeclRegex = new RegExp(`public\\s+class\\s+${targetBean.className}\\s*(?:extends\\s+\\w+)?(?:\\s+implements\\s+([\\w\\s,<>,]+))?`, 's');
              const declMatch = text.match(classDeclRegex);
              let implementsType = false;
              let interfaces = [];
              if (declMatch && declMatch[1]) {
                interfaces = declMatch[1].split(',').map(s => s.trim());
                if (interfaces.includes(paramType)) implementsType = true;
              }
              const classDeclPattern = new RegExp(`public class ${targetBean.className}[^{]*{`, 's');
              const classDeclMatch = text.match(classDeclPattern);
              if (classDeclMatch && classDeclMatch[0]) {
                const implementsMatch = classDeclMatch[0].match(/implements\s+([\s\S]*?)\{/);
                if (implementsMatch && implementsMatch[1]) {
                  interfaces = implementsMatch[1].split(',').map(s => s.trim());
                  if (interfaces.includes(paramType)) implementsType = true;
                }
              }
              if (targetBean.className === paramType || implementsType) {
                methodWirings.push({
                  from: sourceBeanName,
                  to: targetBeanName,
                  method: methodName,
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
            methodWirings.push({
              from: sourceBeanName,
              to: compatibleBeans[0].beanName,
              method: methodName,
              paramType,
              paramName
            });
          } else if (compatibleBeans.length > 1) {
            // Ambigüedad: más de un bean compatible
            methodWirings.push({
              from: sourceBeanName,
              to: null,
              method: methodName,
              paramType,
              paramName,
              error: 'Ambiguous method wiring: multiple beans match type ' + paramType
            });
          } else {
            // Ningún bean compatible
            missingAutowiredMethodTypes.push({
              from: sourceBeanName,
              method: methodName,
              paramType,
              paramName,
              error: `No se encontró ningún bean cuyo tipo o interfaz implementada coincida con '${paramType}' para el método '${methodName}' en '${sourceBeanName}'. ¿Quizá la interfaz o clase está mal escrita o no existe?`
            });
          }
        }
      }
    }
  }
  return {
    methodWirings,
    missingAutowiredMethodTypes
  };
} 