// src/utils/markdownUtils.js

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const headingProcessor = unified().use(remarkParse).use(remarkGfm);

// Joins the plain-text content of a heading node (mdast), skipping formatting nodes.
const headingText = (node) =>
  (node.children || [])
    .map((child) => {
      if (child.type === 'text' || child.type === 'inlineCode') return child.value;
      if (child.children) return headingText(child);
      return '';
    })
    .join('');

/**
 * Extrae el primer título (heading de nivel 1, `# Título`) de contenido Markdown.
 * @param {string} markdownContent El contenido completo del archivo Markdown.
 * @returns {string|null} El primer título encontrado o null si no hay ninguno.
 */
export const getFirstTitleFromMarkdown = (markdownContent) => {
  const tree = headingProcessor.parse(markdownContent);
  for (const node of tree.children || []) {
    if (node.type === 'heading' && node.depth === 1) {
      return headingText(node);
    }
  }
  return null;
};