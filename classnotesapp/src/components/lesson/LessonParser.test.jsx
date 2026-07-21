import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';

vi.mock('@/assets/index.js', () => ({ default: { 'image1.png': '/mock-image1.png' } }));

vi.mock('@/components/lesson/MermaidBlock', () => ({
  default: ({ chart }) => <div data-testid="mermaid-block">{chart}</div>,
}));

import LessonParser from './LessonParser';

const parse = (content) => LessonParser({ content });
const renderElements = (elements) => render(<ThemeProvider>{elements}</ThemeProvider>);

describe('LessonParser — lessonTitle and subtitles', () => {
  it('extracts lessonTitle from the first h1', () => {
    const { lessonTitle } = parse('# Mi Título\n\n## Sección 1');
    expect(lessonTitle).toBe('Mi Título');
  });

  it('collects subtitles from h2 headings', () => {
    const { subtitles } = parse('# Título\n\n## Sección A\n\n## Sección B');
    expect(subtitles).toHaveLength(2);
    expect(subtitles[0].text).toBe('Sección A');
  });

  it('h2 ids assigned during render match the ids in subtitles', () => {
    const { elements, subtitles } = parse('## Primera\n\n## Segunda');
    renderElements(elements);
    expect(document.getElementById(subtitles[0].id).textContent).toBe('Primera');
    expect(document.getElementById(subtitles[1].id).textContent).toBe('Segunda');
  });
});

describe('LessonParser — Dart-specific try-it-live blocks', () => {
  it('renders a DartPad tab when a code fence has trycode= meta', () => {
    const content = '```dart trycode=abc123\nvoid main() {}\n```';
    const { elements } = parse(content);
    renderElements(elements);
    expect(screen.getByText('Fire it up!')).toBeTruthy();
  });

  it('does not throw for a standalone dartpad fence', () => {
    expect(() => parse('```dartpad\nabc123gistid\n```')).not.toThrow();
  });
});

describe('LessonParser — block constructs', () => {
  it('does not throw for all supported block constructs', () => {
    const content = [
      '# Título',
      '',
      '## Subtítulo',
      '',
      '```dart',
      'void main() {}',
      '```',
      '',
      '```youtube',
      'dQw4w9WgXcQ | Video de prueba',
      '```',
      '',
      '![Diagrama](image1.png)',
      '',
      '![Ícono](image1.png "icon")',
      '',
      '[Enlace](https://example.com)',
      '',
      '- Elemento uno',
      '- Elemento dos',
    ].join('\n');
    expect(() => parse(content)).not.toThrow();
  });
});

describe('LessonParser — inline formatting', () => {
  it('handles backtick inline code inside a paragraph', () => {
    const { elements } = parse('Usa `runApp()` para iniciar la app.');
    renderElements(elements);
    expect(screen.getByText('runApp()')).toBeTruthy();
  });

  it('handles inline links with standard markdown syntax', () => {
    const { elements } = parse('Ver [la documentación](https://dart.dev) para más info.');
    renderElements(elements);
    const link = screen.getByText('la documentación').closest('a');
    expect(link.getAttribute('href')).toBe('https://dart.dev');
  });
});
