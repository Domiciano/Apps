const modules = import.meta.glob('@/content/*.md', { query: '?raw', import: 'default', eager: true });

const lessonRawContents = {};

for (const path in modules) {
  const fileName = path.split('/').pop();
  lessonRawContents[fileName] = modules[path];
}

export default lessonRawContents;