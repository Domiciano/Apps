// Validaciones específicas para XML Spring
export function validateXmlStructure(text) {
  const warnings = {
    xmlStructureWarning: null,
    xmlTagWarning: null,
    xmlClosingWarning: null,
    beanUnclosedWarning: null
  };

  // Verificar que el documento XML comience correctamente
  if (!text.includes('<?xml')) {
    warnings.xmlStructureWarning = "Advertencia: El documento XML debe comenzar con la declaración <?xml version=\"1.0\" encoding=\"UTF-8\"?>.";
  }

  // Verificar que no haya tags de apertura mal escritos (como <beaasdns>)
  const openingTags = text.match(/<([^/\s>]+)\s+/g);
  if (openingTags) {
    const validTags = ['beans', 'bean', 'property', 'constructor-arg', 'qualifier'];
    const invalidOpeningTags = openingTags.filter(tag => {
      // Excluir declaraciones XML
      if (tag.startsWith('<?')) return false;
      const tagName = tag.match(/<([^/\s>]+)\s+/)[1];
      return !validTags.includes(tagName);
    });

    if (invalidOpeningTags.length > 0) {
      warnings.xmlTagWarning = `Advertencia: Se encontraron tags de apertura inválidos: ${invalidOpeningTags.join(', ')}. Solo se permiten tags válidos de Spring.`;
    }
  }

  // Buscar tag de apertura <beans>
  const openingBeansMatch = text.match(/<beans\s+([^>]*?)>/);
  if (!openingBeansMatch) {
    warnings.xmlTagWarning = "Advertencia: No se encontró el tag de apertura <beans>. El documento XML debe tener un elemento raíz <beans>.";
  }

  // Buscar tag de cierre </beans>
  const closingBeansMatch = text.match(/<\/beans>/);
  if (!closingBeansMatch) {
    warnings.xmlClosingWarning = "Advertencia: No se encontró el tag de cierre </beans>. El documento XML debe cerrar correctamente el elemento <beans>.";
  }

  // Verificar que no haya tags de cierre mal escritos
  const allClosingTags = text.match(/<\/[^>]+>/g);
  if (allClosingTags) {
    const malformedBeanTags = allClosingTags.filter(tag => {
      const tagContent = tag.slice(2, -1); // Remover </ y >
      return tagContent !== 'beans' && tagContent !== 'bean';
    });
    
    if (malformedBeanTags.length > 0) {
      warnings.xmlClosingWarning = `Advertencia: Se encontraron tags de cierre inválidos: ${malformedBeanTags.join(', ')}. Solo se permiten </beans> y </bean>.`;
    }
  }

  // Verificar que haya igual número de tags de apertura y cierre
  const openingTagsCount = (text.match(/<beans\s+/g) || []).length;
  const closingTagsCount = (text.match(/<\/beans>/g) || []).length;
  
  if (openingTagsCount !== closingTagsCount) {
    warnings.xmlTagWarning = `Advertencia: Desbalance en tags <beans>. Hay ${openingTagsCount} tags de apertura y ${closingTagsCount} tags de cierre.`;
  }

  // Validar beans abiertos sin cierre correspondiente
  const lines = text.split('\n');
  const beanStack = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Buscar apertura de bean (no self-closing)
    const beanOpenMatch = line.match(/<bean\b[^>]*>/);
    if (beanOpenMatch && !line.includes('/>')) {
      const idMatch = line.match(/id="([^"]+)"/);
      const beanId = idMatch ? idMatch[1] : `bean_${i + 1}`;
      beanStack.push(beanId);
    }
    
    // Buscar cierre de bean
    if (line.includes('</bean>')) {
      if (beanStack.length > 0) {
        beanStack.pop(); // Bean cerrado correctamente
      }
    }
  }
  
  // Los beans que quedan en el stack están mal cerrados
  if (beanStack.length > 0) {
    warnings.beanUnclosedWarning = `Advertencia: Los siguientes beans están mal cerrados (sin </bean> ni />): ${beanStack.join(', ')}.`;
  }

  return warnings;
} 