// Detecta wiring entre métodos @Bean en clases @Configuration
// Por cada método @Bean, si tiene parámetros, genera wiring desde ese bean hacia los beans de los tipos de los parámetros

export function parseConfigWirings(text, beans) {
  // Mapa de tipo de clase a beanName
  const classToBeanName = {};
  beans.forEach(bean => {
    classToBeanName[bean.className] = bean.beanName;
  });

  const configWirings = [];
  const missingConfigTypes = [];

  // Buscar clases @Configuration
  const configClassRegex = /@Configuration\s*public\s+class\s+(\w+)\s*\{/g;
  let match;
  while ((match = configClassRegex.exec(text)) !== null) {
    const classStart = match.index + match[0].length - 1;
    // Extraer cuerpo de la clase
    let open = 0, started = false, body = '';
    for (let i = classStart; i < text.length; i++) {
      if (text[i] === '{') { open++; started = true; }
      else if (text[i] === '}') { open--; }
      if (started) body += text[i];
      if (started && open === 0) break;
    }
    // Buscar métodos @Bean (permitir cuerpo vacío)
    const beanMethodRegex = /@Bean[\s\S]*?(public|protected|private)?[\s\S]*?(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{[\s\S]*?\}/g;
    let m;
    while ((m = beanMethodRegex.exec(body)) !== null) {
      // m[2]: tipo de retorno, m[3]: nombre del método, m[4]: params
      const methodName = m[3];
      const paramsString = m[4];
      const sourceBeanName = methodName; // wiring debe salir del beanName (nombre del método)
      const params = paramsString.split(',').map(p => p.trim()).filter(Boolean);
      for (const param of params) {
        const paramMatch = param.match(/(\w+)\s+(\w+)/);
        if (!paramMatch) continue;
        const paramType = paramMatch[1];
        const targetBeanName = classToBeanName[paramType];
        if (!targetBeanName) {
          missingConfigTypes.push(`${methodName}(@Bean)(${paramType})`);
          continue;
        }
        configWirings.push({
          from: sourceBeanName,
          to: targetBeanName,
          paramType
        });
      }
    }
  }
  return {
    configWirings,
    missingConfigTypes
  };
} 