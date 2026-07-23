// Parser para wiring definido en XML Spring
export function parseXmlWirings(text, beans) {
  const wirings = [];

  // Mapa de beanName a bean para búsqueda rápida
  const beanNameToBean = {};
  beans.forEach(bean => {
    beanNameToBean[bean.beanName] = bean;
  });

  // Buscar wiring por constructor-arg
  const constructorArgRegex = /<constructor-arg\s+([^>]*?)\s*\/?>/g;
  let constructorMatch;
  while ((constructorMatch = constructorArgRegex.exec(text)) !== null) {
    const attributes = constructorMatch[1];
    const refMatch = attributes.match(/ref\s*=\s*["']([^"']+)["']/);

    if (refMatch) {
      const targetBeanName = refMatch[1];
      if (beanNameToBean[targetBeanName]) {
        // Buscar el bean padre
        const contextBefore = text.substring(0, constructorMatch.index);
        const beanMatch = Array.from(contextBefore.matchAll(/<bean\s+([^>]*?)>/g));
        if (beanMatch.length > 0) {
          const lastBeanMatch = beanMatch[beanMatch.length - 1];
          const beanAttributes = lastBeanMatch[1];
          const idMatch = beanAttributes.match(/id\s*=\s*["']([^"']+)["']/);
          const nameMatch = beanAttributes.match(/name\s*=\s*["']([^"']+)["']/);

          let sourceBeanName = null;
          if (idMatch) {
            sourceBeanName = idMatch[1];
          } else if (nameMatch) {
            sourceBeanName = nameMatch[1];
          }

          if (sourceBeanName && beanNameToBean[sourceBeanName]) {
            wirings.push({
              from: sourceBeanName,
              to: targetBeanName,
              type: "xml-constructor"
            });
          }
        }
      }
    }
  }

  // Buscar wiring por property
  const propertyRegex = /<property\s+([^>]*?)\s*\/?>/g;
  let propertyMatch;
  while ((propertyMatch = propertyRegex.exec(text)) !== null) {
    const attributes = propertyMatch[1];
    const refMatch = attributes.match(/ref\s*=\s*["']([^"']+)["']/);

    if (refMatch) {
      const targetBeanName = refMatch[1];
      if (beanNameToBean[targetBeanName]) {
        // Buscar el bean padre
        const contextBefore = text.substring(0, propertyMatch.index);
        const beanMatch = Array.from(contextBefore.matchAll(/<bean\s+([^>]*?)>/g));
        if (beanMatch.length > 0) {
          const lastBeanMatch = beanMatch[beanMatch.length - 1];
          const beanAttributes = lastBeanMatch[1];
          const idMatch = beanAttributes.match(/id\s*=\s*["']([^"']+)["']/);
          const nameMatch = beanAttributes.match(/name\s*=\s*["']([^"']+)["']/);

          let sourceBeanName = null;
          if (idMatch) {
            sourceBeanName = idMatch[1];
          } else if (nameMatch) {
            sourceBeanName = nameMatch[1];
          }

          if (sourceBeanName && beanNameToBean[sourceBeanName]) {
            wirings.push({
              from: sourceBeanName,
              to: targetBeanName,
              type: "xml-property"
            });
          }
        }
      }
    }
  }

  return wirings;
} 