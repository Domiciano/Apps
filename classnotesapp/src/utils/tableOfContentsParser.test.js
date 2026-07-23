import { describe, it, expect } from 'vitest';
import TableOfContentsParser from './tableOfContentsParser';

// SPEC-11: parser is synchronous — no fetch calls, no async behavior.

describe('TableOfContentsParser — titles and dividers', () => {
  it('parses a [t] section title', () => {
    const sections = TableOfContentsParser('[t] SEMANA 1 · HTTP');
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe('title');
    expect(sections[0].label).toBe('SEMANA 1 · HTTP');
  });

  it('generates a slug id from the title', () => {
    const sections = TableOfContentsParser('[t] SEMANA 1 · HTTP');
    expect(sections[0].id).toBe('semana-1--http');
  });

  it('parses a [d] divider', () => {
    const sections = TableOfContentsParser('[d]');
    expect(sections[0].type).toBe('divider');
  });

  it('skips lines prefixed with **', () => {
    const toc = '**[lesson:url] https://example.com/a.md | Ignorada\n[t] Visible';
    const sections = TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe('title');
  });

  it('ignores blank lines', () => {
    const toc = '\n\n[t] Solo título\n\n';
    const sections = TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
  });
});

describe('TableOfContentsParser — [lesson:url] with inline label (required format)', () => {
  it('parses url and inline label', () => {
    const toc = '[lesson:url] https://example.com/lesson7.md | Spring Boot Setup';
    const sections = TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe('lesson');
    expect(sections[0].source).toBe('remote');
    expect(sections[0].url).toBe('https://example.com/lesson7.md');
    expect(sections[0].label).toBe('Spring Boot Setup');
    expect(sections[0].rawContent).toBeNull();
  });

  it('trims whitespace around url and label', () => {
    const toc = '[lesson:url]  https://example.com/lesson7.md  |  Spring Boot Setup  ';
    const sections = TableOfContentsParser(toc);
    expect(sections[0].url).toBe('https://example.com/lesson7.md');
    expect(sections[0].label).toBe('Spring Boot Setup');
  });

  it('assigns sequential numeric ids', () => {
    const toc = '[lesson:url] https://example.com/a.md | Lección A\n[lesson:url] https://example.com/b.md | Lección B';
    const sections = TableOfContentsParser(toc);
    expect(sections[0].id).toBe('1');
    expect(sections[1].id).toBe('2');
  });

  it('ids are sequential across [t] entries', () => {
    const toc = '[t] Semana 1\n[lesson:url] https://example.com/a.md | A\n[t] Semana 2\n[lesson:url] https://example.com/b.md | B';
    const sections = TableOfContentsParser(toc);
    const lessons = sections.filter(s => s.type === 'lesson');
    expect(lessons[0].id).toBe('1');
    expect(lessons[1].id).toBe('2');
  });
});

describe('TableOfContentsParser — [lesson:url] without inline label (fallback)', () => {
  it('uses filename as label when no | separator is present', () => {
    const toc = '[lesson:url] https://example.com/lesson7.md';
    const sections = TableOfContentsParser(toc);
    expect(sections[0].label).toBe('lesson7.md');
  });

  it('still sets rawContent to null', () => {
    const toc = '[lesson:url] https://example.com/lesson7.md';
    const sections = TableOfContentsParser(toc);
    expect(sections[0].rawContent).toBeNull();
  });
});

describe('TableOfContentsParser — mixed content', () => {
  it('handles titles, dividers, and labelled lessons together', () => {
    const toc = [
      '[t] SEMANA 4 · Spring Boot',
      '[lesson:url] https://example.com/lesson7.md | Introducción a Spring Boot',
      '[d]',
      '[lesson:url] https://example.com/lesson8.md | Configuración avanzada',
    ].join('\n');
    const sections = TableOfContentsParser(toc);
    expect(sections).toHaveLength(4);
    expect(sections[0].type).toBe('title');
    expect(sections[1].type).toBe('lesson');
    expect(sections[2].type).toBe('divider');
    expect(sections[3].type).toBe('lesson');
    expect(sections[1].label).toBe('Introducción a Spring Boot');
    expect(sections[3].label).toBe('Configuración avanzada');
  });

  it('ignores [lesson] local entries with a console warning', () => {
    const toc = '[lesson] lesson1.md\n[lesson:url] https://example.com/a.md | Única';
    const sections = TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
    expect(sections[0].label).toBe('Única');
  });
});
