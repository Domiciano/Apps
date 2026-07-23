// Validaciones y advertencias del sistema
export function validateCode(code, beans) {
  const warnings = {
    bracketWarning: null,
    returnWarning: null, // Ya no se usará
    multiNameWarning: null,
    missingClassWarnings: [],
    errors: [],
    duplicateClassWarning: null // NUEVO
  };

  // Advertencia por desbalance de llaves
  const open = (code.match(/\{/g) || []).length;
  const close = (code.match(/\}/g) || []).length;
  warnings.bracketWarning = open !== close ? `Advertencia: El número de llaves de apertura ({) y cierre (}) no coincide (${open} vs ${close}).` : null;

  // Advertencia: misma clase, diferentes nombres de bean
  const classToNames = {};
  beans.forEach(bean => {
    if (!classToNames[bean.className]) classToNames[bean.className] = new Set();
    classToNames[bean.className].add(bean.beanName);
  });
  Object.entries(classToNames).forEach(([className, names]) => {
    if (names.size > 1) {
      warnings.multiNameWarning = `Advertencia: La clase "${className}" está registrada como más de un bean con nombres distintos: ${Array.from(names).join(", ")}.`;
    }
  });

  // Restaurar: advertencia si un método @Bean retorna un tipo no declarado
  const declaredClasses = Array.from(code.matchAll(/public\s+class\s+(\w+)/g)).map(m => m[1]);
  beans.forEach(bean => {
    if (bean.type === 'bean' && !declaredClasses.includes(bean.className)) {
      warnings.missingClassWarnings.push(`Advertencia: El método @Bean '${bean.beanName}' retorna un objeto de tipo '${bean.className}', pero no existe ninguna clase declarada con ese nombre.`);
    }
  });

  // Detección de errores: beans o clases con el mismo nombre
  const nameCount = {};
  const classCount = {};
  beans.forEach(bean => {
    nameCount[bean.beanName] = (nameCount[bean.beanName] || 0) + 1;
    classCount[bean.className] = (classCount[bean.className] || 0) + 1;
  });
  Object.entries(nameCount).forEach(([name, count]) => {
    if (count > 1) warnings.errors.push(`Hay ${count} beans con el nombre "${name}".`);
  });
  Object.entries(classCount).forEach(([name, count]) => {
    if (count > 1) warnings.errors.push(`ERROR: Hay ${count} clases públicas con el nombre "${name}". Esto no es válido en Java.`);
  });

  // Detección de clases duplicadas (todas las clases, no solo beans)
  const allClassNames = Array.from(code.matchAll(/public\s+class\s+(\w+)/g)).map(m => m[1]);
  const classNameCounts = {};
  allClassNames.forEach(name => {
    classNameCounts[name] = (classNameCounts[name] || 0) + 1;
  });
  const duplicates = Object.entries(classNameCounts).filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    warnings.duplicateClassWarning = `Advertencia: Hay clases declaradas más de una vez: ${duplicates.map(([name, count]) => `"${name}" (${count} veces)`).join(", ")}.`;
  }

  return warnings;
} 