import { parseBeans } from '../regex/beanDetection.js';
import { parseWirings } from '../regex/wiringDetection.js';
import { parseMethodWirings } from '../regex/methodWiringDetection.js';
import { parseConstructorWirings } from '../regex/constructorWiringDetection.js';
import { parseConfigWirings } from '../regex/configWiringDetection.js';
import { parseXmlBeans } from '../regex/xmlBeanDetection.js';
import { parseXmlWirings } from '../regex/xmlWiringDetection.js';
import { validateCode } from '../regex/validations.js';
import { validateXmlStructure } from '../regex/xmlValidation.js';

export function buildBeanGraph(code) {
  // Extraer contenido entre [beansim] y [endbeansim] si existen
  const beanSimStartTag = '[beansim]';
  const beanSimEndTag = '[endbeansim]';
  let processedCode = code;

  const startIndex = code.indexOf(beanSimStartTag);
  const endIndex = code.indexOf(beanSimEndTag);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    processedCode = code.substring(startIndex + beanSimStartTag.length, endIndex).trim();
  }

  // Detectar si es XML o Java
  const isXml = processedCode.trim().startsWith('<?xml') || processedCode.includes('<beans') || processedCode.includes('<bean');
  
  let beans, wirings, methodWirings, constructorWirings, configWirings;
  let warnings;
  
  if (isXml) {
    warnings = validateXmlStructure(processedCode);
    // Si hay errores críticos en la estructura XML, no procesar beans
    const hasCriticalErrors = warnings.xmlTagWarning || warnings.xmlClosingWarning || warnings.beanUnclosedWarning;
    if (hasCriticalErrors) {
      beans = [];
      wirings = [];
      methodWirings = [];
      constructorWirings = [];
      configWirings = [];
    } else {
      // Obtener clases declaradas en el código Java
      const declaredClasses = Array.from(processedCode.matchAll(/public\s+class\s+(\w+)/g)).map(m => m[1]);
      // Analizar todos los wirings definidos en el XML (aunque apunten a beans inexistentes)
      const allXmlBeans = parseXmlBeans(processedCode);
      const filteredBeans = allXmlBeans.filter(bean => declaredClasses.includes(bean.className));
      const allWirings = parseXmlWirings(processedCode, allXmlBeans); // todos los wirings posibles
      const validBeanNames = filteredBeans.map(b => b.beanName);
      // Advertencias para wirings rotos
      const brokenWirings = allWirings.filter(w => !validBeanNames.includes(w.to));
      if (brokenWirings.length > 0) {
        warnings.brokenXmlWirings = brokenWirings.map(w => `El wiring XML desde '${w.from}' apunta a un bean inexistente: '${w.to}'.`);
      }
      // Solo agregar al grafo los wirings válidos
      const xmlWirings = allWirings.filter(w => validBeanNames.includes(w.to));
      beans = filteredBeans;
      wirings = xmlWirings;
      methodWirings = [];
      constructorWirings = [];
      configWirings = [];
    }
  } else {
    // Parsear Java
    beans = parseBeans(processedCode);
    // Obtener clases declaradas
    const declaredClasses = Array.from(processedCode.matchAll(/public\s+class\s+(\w+)/g)).map(m => m[1]);
    // Filtrar beans de métodos @Bean cuyo tipo no existe
    const filteredBeans = beans.filter(bean => {
      if (bean.type === 'bean') {
        return declaredClasses.includes(bean.className);
      }
      return true;
    });
    wirings = parseWirings(processedCode, filteredBeans).wirings;
    methodWirings = parseMethodWirings(processedCode, filteredBeans).methodWirings;
    constructorWirings = parseConstructorWirings(processedCode, filteredBeans).constructorWirings;
    configWirings = parseConfigWirings(processedCode, filteredBeans).configWirings;
    beans = filteredBeans;
    warnings = validateCode(processedCode, beans);
  }
  
  return {
    beans,
    wirings: [
      ...wirings,
      ...methodWirings,
      ...constructorWirings,
      ...configWirings
    ],
    warnings
  };
} 