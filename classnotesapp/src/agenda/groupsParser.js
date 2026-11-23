// src/agenda/groupsParser.js
//
// Lee el .md de grupos que el profesor carga desde la agenda:
//
//   # Grupos · moviles
//
//   ## Equipo 1 · Órbita
//   - Ana Gómez
//   - Luis Pérez
//
// Cada `##` es un grupo y cada viñeta debajo, un integrante. El id del grupo se
// deriva del título (sin tildes, en minúsculas y con guiones) y es la llave de la
// reserva: renombrar un grupo después de que reservó le hace perder su fecha.
//
// La lista no va en el repo ni en el bundle: son nombres de estudiantes y los
// sitios son públicos. Vive en Firestore, en agendaGroups/{courseId}.

export const slugifyGroup = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export function parseGroupsMarkdown(text) {
  const groups = [];
  const errors = [];
  let current = null;
  let skipping = false;
  const lines = String(text ?? '').split(/\r?\n/);
  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      const name = heading[1].trim();
      const id = slugifyGroup(name);
      if (!id) {
        errors.push(`Línea ${index + 1}: el título del grupo no tiene letras ni números.`);
        current = null;
        skipping = true;
        return;
      }
      if (groups.some((g) => g.id === id)) {
        errors.push(`Línea ${index + 1}: el grupo «${name}» está repetido.`);
        current = null;
        skipping = true;
        return;
      }
      skipping = false;
      current = { id, name, members: [] };
      groups.push(current);
      return;
    }
    const item = line.match(/^[-*]\s+(.+)$/);
    if (item) {
      if (skipping) return;
      if (!current) {
        errors.push(`Línea ${index + 1}: hay un integrante antes del primer grupo.`);
        return;
      }
      current.members.push(item[1].trim());
    }
  });
  for (const g of groups) {
    if (g.members.length === 0) errors.push(`El grupo «${g.name}» no tiene integrantes.`);
  }
  return { groups, errors };
}

// Si el nombre del archivo nombra otro curso (agenda-grupos-seminario.md
// cargado desde Móviles), es casi seguro un error del profesor.
export function courseFromFileName(fileName, knownCourseIds) {
  const lower = String(fileName ?? '').toLowerCase();
  return knownCourseIds.find((id) => lower.includes(id)) ?? null;
}
