// src/utils/markdownUtils.js

/**
 * Extrae el primer título (líneas que empiezan con '[t]') de un contenido Markdown.
 * @param {string} markdownContent El contenido completo del archivo Markdown.
 * @returns {string|null} El primer título encontrado o null si no hay ninguno.
 */
export const getFirstTitleFromMarkdown = (markdownContent) => {
  const lines = markdownContent.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('[t]')) {
      return trimmedLine.slice(3).trim();
    }
  }
  return null;
};