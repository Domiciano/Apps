// Calcula niveles de beans según dependencias para layout jerárquico
export function getBeanLevels(beans, wirings) {
  // Mapa de bean a dependencias entrantes
  const incoming = {};
  beans.forEach(b => { incoming[b.beanName] = 0; });
  wirings.forEach(w => { incoming[w.to] = (incoming[w.to] || 0) + 1; });
  // Beans sin dependencias entrantes (nivel 0)
  const levels = [];
  let currentLevel = beans.filter(b => incoming[b.beanName] === 0).map(b => b.beanName);
  const assigned = new Set(currentLevel);
  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    // Buscar beans que dependen de los del nivel actual
    const nextLevel = [];
    wirings.forEach(w => {
      if (currentLevel.includes(w.from) && !assigned.has(w.to)) {
        // Solo agregar si todas sus dependencias ya están en niveles anteriores
        const froms = wirings.filter(x => x.to === w.to).map(x => x.from);
        if (froms.every(f => assigned.has(f))) {
          nextLevel.push(w.to);
          assigned.add(w.to);
        }
      }
    });
    // Agregar beans que no tienen wiring pero no han sido asignados
    beans.forEach(b => {
      if (!assigned.has(b.beanName) && !wirings.some(w => w.to === b.beanName)) {
        nextLevel.push(b.beanName);
        assigned.add(b.beanName);
      }
    });
    currentLevel = Array.from(new Set(nextLevel));
  }
  // Si quedan beans no asignados (ciclos), ponerlos en el último nivel
  const unassigned = beans.filter(b => !assigned.has(b.beanName)).map(b => b.beanName);
  if (unassigned.length > 0) levels.push(unassigned);
  return levels;
} 