// Extrae el cuerpo de una clase a partir de la posición de la llave de apertura
export function extractClassBody(text, startIdx) {
  let open = 0;
  let body = '';
  let started = false;
  for (let i = startIdx; i < text.length; i++) {
    if (text[i] === '{') {
      open++;
      started = true;
    } else if (text[i] === '}') {
      open--;
    }
    if (started) body += text[i];
    if (started && open === 0) break;
  }
  return body;
}

// Parser mejorado para beans con tags y métodos @Bean
export function parseBeans(text) {
  // Regex tolerante a saltos de línea, espacios y comentarios, y soporta implements/extends
  const beanRegex = /@(Component|Service|Repository|Controller|RestController)\s*(\((?:\s*value\s*=)?\s*"([^"]+)"\s*\))?(?:\s*\/\/.*|\s*\/\*[\s\S]*?\*\/|\s*)*public\s+class\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+[\w\s,<>]+)?\s*\{/g;
  const configClassRegex = /@Configuration\s*public\s+class\s+(\w+)\s*\{/g;
  // Mejorar el regex para métodos @Bean: acepta cualquier visibilidad, cualquier tipo, cualquier contenido entre llaves
  // const beanMethodRegex = /@Bean\s*(\((?:\s*value\s*=)?\s*"([^"]+)"\s*\))?\s*(public|protected|private)?\s*\w+\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?return[\s\S]*?\}/g;

  const beans = [];
  let match;
  // Beans por anotación de clase
  while ((match = beanRegex.exec(text)) !== null) {
    let typeRaw = match[1];
    const explicitName = match[3];
    const className = match[4];
    let type = typeRaw.toLowerCase();
    if (type === "restcontroller") type = "controller";
    let beanName = explicitName;
    if (!beanName) {
      beanName = className.charAt(0).toLowerCase() + className.slice(1);
    }
    beans.push({ className, beanName, type });
  }
  // Beans por métodos @Bean en clases @Configuration
  while ((match = configClassRegex.exec(text)) !== null) {
    const classStart = match.index + match[0].length - 1;
    const configBody = extractClassBody(text, classStart);
    for (const m of configBody.matchAll(/@Bean[\s\S]*?(public|protected|private)?[\s\S]*?(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g)) {
      // m[2]: tipo de retorno, m[3]: nombre del método, m[4]: params, m[5]: body
      const returnType = m[2];
      const methodName = m[3];
      beans.push({ className: returnType, beanName: methodName, type: "bean" });
    }
  }
  return beans;
} 