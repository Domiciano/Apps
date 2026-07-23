import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';

// Mock assets (import.meta.glob)
vi.mock('@/assets/index.js', () => ({ default: { 'image1.png': '/mock-image1.png' } }));

// Mock BeanVisualizer to avoid canvas complexity in tests
vi.mock('@/components/BeanVisualizer/BeanVisualizer', () => ({
  default: ({ initialCode }) => <div data-testid="bean-visualizer">{initialCode}</div>,
}));

// Mock MermaidBlock — mermaid.render() is async and touches the DOM in ways jsdom doesn't like
vi.mock('@/components/lesson/MermaidBlock', () => ({
  default: ({ chart }) => <div data-testid="mermaid-block">{chart}</div>,
}));

import LessonParser from './LessonParser';

// Helper: call the parser and get back the plain data (no rendering needed)
const parse = (content) => LessonParser({ content });

// Every component in the tree reads theme via ThemeContext — wrap for renders.
const renderElements = (elements) => render(<ThemeProvider>{elements}</ThemeProvider>);

describe('LessonParser — lessonTitle and subtitles', () => {
  it('extracts lessonTitle from the first h1', () => {
    const { lessonTitle } = parse('# Mi Título\n\n## Sección 1');
    expect(lessonTitle).toBe('Mi Título');
  });

  it('returns null lessonTitle when there is no h1', () => {
    const { lessonTitle } = parse('## Solo subtítulo\n\nTexto.');
    expect(lessonTitle).toBeNull();
  });

  it('collects subtitles from h2 headings', () => {
    const { subtitles } = parse('# Título\n\n## Sección A\n\n## Sección B');
    expect(subtitles).toHaveLength(2);
    expect(subtitles[0].text).toBe('Sección A');
    expect(subtitles[1].text).toBe('Sección B');
  });

  it('each subtitle has an id and text', () => {
    const { subtitles } = parse('## Introducción');
    expect(subtitles[0]).toHaveProperty('id');
    expect(subtitles[0]).toHaveProperty('text', 'Introducción');
  });

  it('returns empty subtitles array when no h2 headings exist', () => {
    const { subtitles } = parse('# Título\n\nTexto normal.');
    expect(subtitles).toHaveLength(0);
  });

  it('h2 ids assigned during render match the ids in subtitles', () => {
    const { elements, subtitles } = parse('## Primera\n\n## Segunda');
    renderElements(elements);
    expect(document.getElementById(subtitles[0].id).textContent).toBe('Primera');
    expect(document.getElementById(subtitles[1].id).textContent).toBe('Segunda');
  });
});

describe('LessonParser — elements shape', () => {
  it('returns a React element from elements', () => {
    const { elements } = parse('# Título');
    expect(elements).not.toBeNull();
    expect(typeof elements).toBe('object'); // React element
  });

  it('produces elements for an empty content string', () => {
    const { elements } = parse('');
    expect(elements).not.toBeNull();
  });
});

describe('LessonParser — block constructs', () => {
  it('does not throw for all supported block constructs', () => {
    const content = [
      '# Título',
      '',
      '## Subtítulo',
      '',
      '```java',
      'System.out.println("hola");',
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

  it('does not throw for a beansim fenced block', () => {
    const content = '```beansim\n@Component\npublic class A {}\n```';
    expect(() => parse(content)).not.toThrow();
  });

  it('renders a framed image for a frameNN image title', () => {
    const { elements } = parse('![Captura](image1.png "frame60")');
    renderElements(elements);
    expect(screen.getByAltText('Captura')).toBeTruthy();
  });

  it('renders a dartpad tab when a code fence has trycode= meta', () => {
    const content = '```dart trycode=abc123\nint x = 1;\n```';
    const { elements } = parse(content);
    renderElements(elements);
    expect(screen.getByText('Fire it up!')).toBeTruthy();
  });

  it('does not throw for a standalone dartpad fence', () => {
    expect(() => parse('```dartpad\nabc123gistid\n```')).not.toThrow();
  });
});

describe('LessonParser — lists', () => {
  it('collects list items correctly (no extra subtitles)', () => {
    const { subtitles } = parse('- Primer punto\n- Segundo punto');
    expect(subtitles).toHaveLength(0);
  });

  it('renders list item text', () => {
    const { elements } = parse('- Primer punto\n- Segundo punto');
    renderElements(elements);
    expect(screen.getByText('Primer punto')).toBeTruthy();
    expect(screen.getByText('Segundo punto')).toBeTruthy();
  });
});

describe('LessonParser — code fences', () => {
  it('does not add code block lines to subtitles', () => {
    const { subtitles } = parse('```java\n// Este es código\n```');
    expect(subtitles).toHaveLength(0);
  });

  it('handles multiple code blocks', () => {
    const content = '```java\nint a = 1;\n```\n\n```sql\nSELECT * FROM t;\n```';
    expect(() => parse(content)).not.toThrow();
  });
});

describe('LessonParser — inline formatting', () => {
  it('handles backtick inline code inside a paragraph', () => {
    const { elements } = parse('Usa `@Component` para registrar beans.');
    renderElements(elements);
    expect(screen.getByText('@Component')).toBeTruthy();
  });

  it('handles inline links with standard markdown syntax', () => {
    const { elements } = parse('Ver [documentación oficial](https://example.com) para más info.');
    renderElements(elements);
    const link = screen.getByText('documentación oficial').closest('a');
    expect(link.getAttribute('href')).toBe('https://example.com');
  });
});
