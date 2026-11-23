import { describe, it, expect } from 'vitest';
import { courseFromFileName, parseGroupsMarkdown, slugifyGroup } from './groupsParser';

describe('slugifyGroup', () => {
  it('quita tildes y signos y deja guiones', () => {
    expect(slugifyGroup('Grupo 3 · Colmena Logística')).toBe('grupo-3-colmena-logistica');
    expect(slugifyGroup('Faro — Agentes IA')).toBe('faro-agentes-ia');
    expect(slugifyGroup('Los Halcones')).toBe('los-halcones');
  });
});

describe('parseGroupsMarkdown', () => {
  it('lee cada ## como grupo y sus viñetas como integrantes', () => {
    const { groups, errors } = parseGroupsMarkdown(
      '# Grupos · moviles\n\n## Equipo 1 · Órbita\n- Ana Gómez\n- Luis Pérez\n\n## Equipo 2 · Faro\n* Sara Ríos\n',
    );
    expect(errors).toEqual([]);
    expect(groups).toEqual([
      { id: 'equipo-1-orbita', name: 'Equipo 1 · Órbita', members: ['Ana Gómez', 'Luis Pérez'] },
      { id: 'equipo-2-faro', name: 'Equipo 2 · Faro', members: ['Sara Ríos'] },
    ]);
  });

  it('acepta saltos de línea de Windows', () => {
    const { groups } = parseGroupsMarkdown('## A\r\n- Uno\r\n');
    expect(groups[0].members).toEqual(['Uno']);
  });

  it('reporta grupos repetidos, vacíos e integrantes sin grupo', () => {
    const { errors } = parseGroupsMarkdown('- Suelto\n## A\n- Uno\n## A\n- Dos\n## B\n');
    expect(errors).toHaveLength(3);
    expect(errors.join(' ')).toMatch(/antes del primer grupo/);
    expect(errors.join(' ')).toMatch(/repetido/);
    expect(errors.join(' ')).toMatch(/«B» no tiene integrantes/);
  });
});

describe('courseFromFileName', () => {
  const ids = ['moviles', 'compunet2', 'seminario'];

  it('reconoce el curso nombrado en el archivo', () => {
    expect(courseFromFileName('agenda-grupos-seminario.md', ids)).toBe('seminario');
    expect(courseFromFileName('Agenda-Grupos-MOVILES.md', ids)).toBe('moviles');
  });

  it('no adivina si el archivo no nombra ninguno', () => {
    expect(courseFromFileName('grupos.md', ids)).toBeNull();
  });
});
