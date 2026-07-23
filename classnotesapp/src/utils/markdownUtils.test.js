import { describe, it, expect } from 'vitest';
import { getFirstTitleFromMarkdown } from './markdownUtils';

describe('getFirstTitleFromMarkdown', () => {
  it('extracts the text of the first [t] line', () => {
    const content = '[t] Mi Lección\n[st] Sección 1\nAlgún texto.';
    expect(getFirstTitleFromMarkdown(content)).toBe('Mi Lección');
  });

  it('returns null when there is no [t] line', () => {
    const content = '[st] Solo subtítulo\nAlgún texto.';
    expect(getFirstTitleFromMarkdown(content)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getFirstTitleFromMarkdown('')).toBeNull();
  });

  it('returns only the first [t] when multiple are present', () => {
    const content = '[t] Primero\n[t] Segundo\n[t] Tercero';
    expect(getFirstTitleFromMarkdown(content)).toBe('Primero');
  });

  it('trims whitespace from the title text', () => {
    const content = '[t]   Título con espacios   ';
    expect(getFirstTitleFromMarkdown(content)).toBe('Título con espacios');
  });

  it('ignores non-[t] lines before the actual title', () => {
    const content = '\n\n[st] Subtítulo primero\n[t] Título real\n';
    expect(getFirstTitleFromMarkdown(content)).toBe('Título real');
  });

  it('handles a [t] line with inline code', () => {
    const content = '[t] Clase `AppContext`';
    expect(getFirstTitleFromMarkdown(content)).toBe('Clase `AppContext`');
  });
});
