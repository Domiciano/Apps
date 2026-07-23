// Detectar ciclos en wiring de beans
export function detectCycles(beans, wirings) {
  // Grafo dirigido: beanName -> [beanName]
  const graph = {};
  beans.forEach(b => { graph[b.beanName] = []; });
  wirings.forEach(w => {
    if (graph[w.from]) graph[w.from].push(w.to);
  });
  // DFS para detectar ciclos
  const visited = {};
  const stack = {};
  const cycles = [];
  function dfs(node, path) {
    if (stack[node]) {
      // Encontrado ciclo
      const idx = path.indexOf(node);
      if (idx !== -1) cycles.push([...path.slice(idx), node]);
      return;
    }
    if (visited[node]) return;
    visited[node] = true;
    stack[node] = true;
    for (const neighbor of graph[node] || []) {
      dfs(neighbor, [...path, neighbor]);
    }
    stack[node] = false;
  }
  beans.forEach(b => {
    dfs(b.beanName, [b.beanName]);
  });
  return cycles;
} 