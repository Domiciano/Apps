// Parser para beans definidos en XML Spring
export function parseXmlBeans(text) {
  const beans = [];
  
  // Regex para detectar tags <bean> con sus atributos
  const beanRegex = /<bean\s+([^>]*?)\/?>/g;
  let match;
  
  while ((match = beanRegex.exec(text)) !== null) {
    const attributes = match[1];
    
    // Extraer atributos del bean
    const idMatch = attributes.match(/id\s*=\s*["']([^"']+)["']/);
    const classMatch = attributes.match(/class\s*=\s*["']([^"']+)["']/);
    const nameMatch = attributes.match(/name\s*=\s*["']([^"']+)["']/);
    
    let beanName = null;
    let className = null;
    
    // Prioridad: id > name
    if (idMatch) {
      beanName = idMatch[1];
    } else if (nameMatch) {
      beanName = nameMatch[1];
    }
    
    if (classMatch) {
      className = classMatch[1];
      // Extraer solo el nombre de la clase (sin package)
      const classNameParts = className.split('.');
      className = classNameParts[classNameParts.length - 1];
    }
    
    if (beanName && className) {
      beans.push({
        className,
        beanName,
        type: "xml-bean"
      });
    }
  }
  
  return beans;
} 