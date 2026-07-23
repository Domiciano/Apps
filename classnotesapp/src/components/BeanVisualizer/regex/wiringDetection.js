// Detectar wiring por propiedad con @Autowired
export function parseWirings(text, beans) {
  // Mapa de nombre de bean a clase
  const beanNameToClass = {};
  beans.forEach(bean => {
    beanNameToClass[bean.beanName] = bean.className;
  });
  // Mapa de clase a lista de beanNames (soporta múltiples beans por clase)
  const classToBeanNames = {};
  beans.forEach(bean => {
    if (!classToBeanNames[bean.className]) classToBeanNames[bean.className] = [];
    classToBeanNames[bean.className].push(bean.beanName);
  });
  // Buscar wiring en cada clase
  const wirings = [];
  const autowiredInvalids = [];
  const missingAutowiredTypes = [];
  const classRegex = /public\s+class\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match;
  while ((match = classRegex.exec(text)) !== null) {
    const className = match[1];
    const classBody = match[2];
    // Buscar el beanName de la clase fuente (puede haber más de uno, pero wiring por campo solo tiene sentido para uno)
    const sourceBeanNames = classToBeanNames[className] || [];
    // Buscar propiedades @Autowired (con o sin @Qualifier)
    const propRegex = /(@Autowired[\s\S]*?)(@Qualifier\s*\(\s*"([^"]+)"\s*\))?\s*((private|protected|public)?\s*)?((static|final)\s+)?(\w+)\s+(\w+)\s*;/g;
    let m;
    while ((m = propRegex.exec(classBody)) !== null) {
      const qualifier = m[3];
      const modifiers = m[6] || '';
      const type = m[8];
      const fieldName = m[9];
      // Buscar bean destino
      let targetBeanName;
      if (qualifier) {
        targetBeanName = qualifier;
      } else {
        // Si hay más de un bean para ese tipo, wiring ambiguo (Spring lanzaría error, aquí tomamos el primero)
        if (classToBeanNames[type] && classToBeanNames[type].length === 1) {
          targetBeanName = classToBeanNames[type][0];
        } else if (classToBeanNames[type] && classToBeanNames[type].length > 1) {
          targetBeanName = classToBeanNames[type][0]; // wiring ambiguo, pero se toma el primero
        } else {
          // Buscar si algún bean implementa la interfaz
          let found = false;
          for (const bean of beans) {
            const classDeclPattern = new RegExp(`public class ${bean.className}[^{]*{`, 's');
            const classDeclMatch = text.match(classDeclPattern);
            if (classDeclMatch && classDeclMatch[0]) {
              const implementsMatch = classDeclMatch[0].match(/implements +([\s\S]*?){/);
              if (implementsMatch && implementsMatch[1]) {
                const interfaces = implementsMatch[1].split(',').map(s => s.trim());
                if (interfaces.includes(type)) {
                  found = true;
                  break;
                }
              }
            }
          }
          if (!found) {
            // Validar que el tipo existe como interfaz o clase
            const declaredInterfaces = Array.from(text.matchAll(/public\s+interface\s+(\w+)/g)).map(m => m[1]);
            const declaredClasses = Array.from(text.matchAll(/public\s+class\s+(\w+)/g)).map(m => m[1]);
            const typeExists = declaredInterfaces.includes(type) || declaredClasses.includes(type);
            
            if (!typeExists) {
              missingAutowiredTypes.push({
                from: className,
                field: fieldName,
                type,
                error: `La interfaz/clase '${type}' no existe. Las interfaces declaradas son: ${declaredInterfaces.join(', ') || 'ninguna'}. Las clases declaradas son: ${declaredClasses.join(', ')}.`
              });
            } else {
              missingAutowiredTypes.push({
                from: className,
                field: fieldName,
                type,
                error: `No se encontró ningún bean cuyo tipo o interfaz implementada coincida con '${type}' para el campo '${fieldName}' en '${className}'. ¿Quizá la interfaz o clase está mal escrita o no existe?`
              });
            }
          }
        }
      }
      if (modifiers && (modifiers.includes('static') || modifiers.includes('final'))) {
        autowiredInvalids.push(`${className}.${fieldName}`);
        continue;
      }
      if (!targetBeanName) {
        missingAutowiredTypes.push(`${className}.${fieldName} → ${type}`);
        continue;
      }
      // Para cada bean fuente (en general solo uno, pero puede haber más si hay beans con el mismo className)
      for (const sourceBeanName of sourceBeanNames) {
        wirings.push({ from: sourceBeanName, to: targetBeanName });
      }
    }
  }
  return { wirings, autowiredInvalids, missingAutowiredTypes };
} 