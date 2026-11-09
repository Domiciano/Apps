import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import {
  SIMS, parseSpec, runQuery, queryCode, cacheStart, cacheView, cacheUpload, cacheRestart, cacheWait, cacheUrl,
  fsScenario, fsAt, FS_TYPE_KEYS, FS_TOTAL, pipeStart, pipeAct, rtLayersScenario, chatStart, chatSend, chatReopen, chatPublish,
  pageStart, pageOlder, pageIncoming, pageStage,
  convStart, convOpen,
} from './flutterStateSims';

const renderBlock = (spec) => render(<ThemeProvider><InteractiveBlock spec={spec} /></ThemeProvider>);

const type = (label, value) => {
  const field = screen.getByLabelText(label);
  field.value = value;
  fireEvent.input(field);
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('parseSpec', () => {
  it('splits the simulator name from its options', () => {
    expect(parseSpec('playlist cards')).toEqual({ name: 'playlist', args: ['cards'] });
    expect(parseSpec('  state-counter\n')).toEqual({ name: 'state-counter', args: [] });
    expect(parseSpec('')).toEqual({ name: '', args: [] });
  });
});

describe('InteractiveBlock', () => {
  it('shows a visible notice for an unknown simulator instead of a blank block', () => {
    renderBlock('nope');
    expect(screen.getByText(/Diagrama interactivo desconocido/)).toBeTruthy();
  });

  it('mounts every registered simulator and cleans up on unmount', () => {
    Object.keys(SIMS).forEach((name) => {
      const { container, unmount } = renderBlock(name);
      expect(container.querySelector('.fsim')).toBeTruthy();
      unmount();
    });
    expect(document.getElementById('fsim-style')).toBeTruthy();
  });
});

describe('state-counter', () => {
  it('increments _counter and rebuilds the screen through setState', () => {
    renderBlock('state-counter');
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByTestId('counter-text').textContent).toBe('1');
    expect(screen.getAllByText(/build\(\) con _counter = 1/).length).toBeGreaterThan(0);
  });

  it('leaves the screen stale when setState is forgotten', () => {
    renderBlock('state-counter');
    fireEvent.click(screen.getByLabelText('Olvidar setState'));
    fireEvent.click(screen.getByLabelText('Incrementar'));
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByTestId('counter-text').textContent).toBe('0');
    expect(screen.getByText(/pero nadie pidió reconstruir/)).toBeTruthy();
  });
});

describe('hot-reload', () => {
  it('keeps the counter on hot reload and resets it on hot restart', () => {
    renderBlock('hot-reload');
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(400));
    fireEvent.click(screen.getByText('Hot reload'));
    expect(screen.getByTestId('counter-text').textContent).toBe('1');
    fireEvent.click(screen.getByText('Hot restart'));
    expect(screen.getByTestId('counter-text').textContent).toBe('0');
  });
});

describe('state-tree', () => {
  const STEP = 1100;
  const nodeId = (container, key) => container.querySelector(`[data-node="${key}"] .fs-id`).textContent;

  it('changes the state first and the screen only at the last step', () => {
    const { container } = renderBlock('state-tree');
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(STEP));
    expect(screen.getByTestId('var-_counter').textContent).toBe('1');
    expect(screen.getByTestId('tree-counter').textContent).toBe('0');
    expect(screen.getByText('sucio: pide build()')).toBeTruthy();
    act(() => vi.advanceTimersByTime(STEP * 2));
    expect(container.querySelector('[data-node="text"] b').textContent).toBe("Text('1')");
    expect(screen.getByTestId('tree-counter').textContent).toBe('0');
    act(() => vi.advanceTimersByTime(STEP * 2));
    expect(screen.getByTestId('tree-counter').textContent).toBe('1');
    expect(screen.getByText('al día')).toBeTruthy();
    expect(nodeId(container, 'state')).toBe('#3');
  });

  it('never loses a tap made in the middle of an animation', () => {
    renderBlock('state-tree');
    fireEvent.click(screen.getByLabelText('Incrementar'));
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(STEP * 6));
    expect(screen.getByTestId('var-_counter').textContent).toBe('2');
    expect(screen.getByTestId('tree-counter').textContent).toBe('2');
  });

  it('lights the line that runs in each step and marks where the state is bound', () => {
    const { container } = renderBlock('state-tree bulb');
    const lit = () => [...container.querySelectorAll('.fs-code-line.fs-on')].map((l) => l.textContent.trim());
    const bound = [...container.querySelectorAll('.fs-code-line.fs-bind')].map((l) => l.textContent.trim());
    expect(bound).toContain("Text(_isOn ? 'Encendido' : 'Apagado'),");
    expect(bound).toContain("_isOn ? 'Apagar' : 'Encender',");
    expect(container.querySelectorAll('.fs-sv').length).toBeGreaterThan(4);
    fireEvent.click(screen.getByRole('button', { name: 'Encender' }));
    expect(lit()).toEqual(['onPressed: () => _toggle(),']);
    act(() => vi.advanceTimersByTime(STEP));
    expect(lit()).toEqual(['setState(() {', '_isOn = !_isOn;']);
    act(() => vi.advanceTimersByTime(STEP * 2));
    expect(lit()).toEqual(bound);
  });

  it('switches between the tree and the code without touching the state', () => {
    const { container } = renderBlock('state-tree bulb');
    const treeBox = () => container.querySelector('[data-node="app"]').closest('.fs-panel');
    const codeBox = () => container.querySelector('.fs-code-line').closest('.fs-dark');
    expect(treeBox().hidden).toBe(false);
    expect(codeBox().hidden).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Encender' }));
    act(() => vi.advanceTimersByTime(STEP));
    fireEvent.click(screen.getByRole('button', { name: 'Código' }));
    expect(treeBox().hidden).toBe(true);
    expect(codeBox().hidden).toBe(false);
    expect(screen.getByTestId('var-_isOn').textContent).toBe('true');
    act(() => vi.advanceTimersByTime(STEP * 5));
    expect(screen.getByTestId('bulb-text').textContent).toBe('Encendido');
    fireEvent.click(screen.getByRole('button', { name: 'Árbol de widgets' }));
    expect(container.querySelector('[data-node="text"] b').textContent).toBe("Text('Encendido')");
  });

  it('shows the forgotten setState: the state moves, the screen does not', () => {
    const { container } = renderBlock('state-tree forget');
    fireEvent.click(screen.getByLabelText('Olvidar setState'));
    expect(container.textContent).not.toContain('setState(() {');
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(STEP * 4));
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(STEP * 4));
    expect(screen.getByTestId('var-_counter').textContent).toBe('2');
    expect(screen.getByTestId('tree-counter').textContent).toBe('0');
    expect(screen.getByText('Flutter no se enteró')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Olvidar setState'));
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(STEP * 6));
    expect(screen.getByTestId('tree-counter').textContent).toBe('3');
    expect(screen.getByText('al día')).toBeTruthy();
  });

  it('waits for Siguiente paso in step-by-step mode', () => {
    renderBlock('state-tree');
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    fireEvent.click(screen.getByLabelText('Incrementar'));
    act(() => vi.advanceTimersByTime(STEP * 5));
    expect(screen.getByTestId('var-_counter').textContent).toBe('0');
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente paso' }));
    expect(screen.getByTestId('var-_counter').textContent).toBe('1');
  });

  it('keeps the State and _isOn when the parent rebuilds (bulb)', () => {
    const { container } = renderBlock('state-tree bulb');
    fireEvent.click(screen.getByRole('button', { name: 'Encender' }));
    act(() => vi.advanceTimersByTime(STEP * 6));
    expect(screen.getByTestId('bulb-text').textContent).toBe('Encendido');
    const widgetBefore = nodeId(container, 'widget');
    const stateBefore = nodeId(container, 'state');
    fireEvent.click(screen.getByRole('button', { name: 'Reconstruir App' }));
    act(() => vi.advanceTimersByTime(STEP * 6));
    expect(nodeId(container, 'widget')).not.toBe(widgetBefore);
    expect(nodeId(container, 'state')).toBe(stateBefore);
    expect(screen.getByTestId('var-_isOn').textContent).toBe('true');
    expect(container.querySelectorAll('.fs-lines .fs-read')).toHaveLength(3);
  });
});

describe('state-lifecycle', () => {
  it('creates the controller in initState, frees it in dispose and flags a late setState', () => {
    renderBlock('state-lifecycle');
    fireEvent.click(screen.getByText('Abrir saludo'));
    act(() => vi.advanceTimersByTime(800));
    expect(screen.getByText('#1 activo')).toBeTruthy();
    type('Nombre', 'Ana');
    expect(screen.getByText('Hola, Ana')).toBeTruthy();
    fireEvent.click(screen.getByText('Guardar (tarda 2 s)'));
    fireEvent.click(screen.getByText('Volver'));
    expect(screen.getByText('#1 liberado')).toBeTruthy();
    act(() => vi.advanceTimersByTime(2100));
    expect(screen.getByText(/setState\(\) called after dispose\(\)/)).toBeTruthy();
  });
});

describe('playlist', () => {
  it('adds whatever the fields hold, like the minimal _addSong of the lesson', () => {
    renderBlock('playlist');
    expect(screen.getByTestId('playlist-list').childNodes).toHaveLength(0);
    type('Nombre de la canción', 'Bohemian Rhapsody');
    type('Artista', 'Queen');
    fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByTestId('playlist-list').textContent).toBe('Bohemian Rhapsody · Queen');
    expect(screen.getByLabelText('Nombre de la canción').value).toBe('Bohemian Rhapsody');
    type('Nombre de la canción', '');
    type('Artista', '');
    fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByTestId('playlist-list').childNodes).toHaveLength(2);
    expect(screen.getByText(/canción vacía/)).toBeTruthy();
  });

  it('switches the same state between Text and SongCard views', () => {
    const { container } = renderBlock('playlist cards');
    type('Nombre de la canción', 'Yellow');
    type('Artista', 'Coldplay');
    fireEvent.click(screen.getByText('Agregar'));
    expect(container.querySelectorAll('.fs-card')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Text' }));
    expect(container.querySelectorAll('.fs-card')).toHaveLength(0);
    expect(screen.getByTestId('playlist-list').textContent).toBe('Yellow · Coldplay');
  });
});

describe('register-layers', () => {
  const runAll = () => act(() => vi.advanceTimersByTime(60000));
  const register = () => fireEvent.click(screen.getByText('Registrarme'));

  it('creates the account and the profile, then navigates to /home', () => {
    renderBlock('register-layers');
    register();
    act(() => vi.advanceTimersByTime(1400));
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterLoadingState');
    expect(screen.queryByText(/Espere mientras tanto/)).toBeNull();
    act(() => vi.advanceTimersByTime(1400));
    expect(screen.getByText(/Espere mientras tanto/)).toBeTruthy();
    runAll();
    expect(screen.getByTestId('auth-users').textContent).toContain('ana@icesi.edu.co');
    expect(screen.getByTestId('profiles-table').textContent).toContain('Ana Gómez');
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterSuccessState');
    expect(screen.getByText('Perfil')).toBeTruthy();
  });

  it('stops in the view when the passwords differ, without any event', () => {
    renderBlock('register-layers');
    type('Confirmar contraseña', 'otra');
    register();
    expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy();
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterIdleState');
    expect(screen.queryByText(/OnRegisterSubmittedEvent\)$/)).toBeNull();
  });

  it('shows the AuthException text when the email is already registered', () => {
    renderBlock('register-layers');
    register();
    runAll();
    fireEvent.click(screen.getByText('Volver a /register'));
    register();
    runAll();
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterErrorState');
    expect(screen.getByTestId('register-phone').textContent).toContain('User already registered');
  });

  it('waits for the next button in step mode', () => {
    renderBlock('register-layers');
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    register();
    runAll();
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterIdleState');
    fireEvent.click(screen.getByText('Siguiente paso'));
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterLoadingState');
  });
});

describe('register-clean', () => {
  const runAll = () => act(() => vi.advanceTimersByTime(60000));
  const register = () => fireEvent.click(screen.getByText('Registrarme'));

  it('switches to the code tab and marks the current layer in the strip', () => {
    const { container } = renderBlock('register-clean');
    expect(container.querySelector('.fr-strip').closest('[hidden]')).toBeTruthy();
    fireEvent.click(screen.getByText('Código'));
    expect(container.querySelector('.fr-strip').closest('[hidden]')).toBeNull();
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    register();
    fireEvent.click(screen.getByText('Siguiente paso'));
    fireEvent.click(screen.getByText('Siguiente paso'));
    expect(container.querySelector('.fr-st.fr-on').textContent).toBe('Vista');
    fireEvent.click(screen.getByText('Siguiente paso'));
    expect(container.querySelector('.fr-st.fr-on').textContent).toBe('Bloc');
    expect(screen.getByText('register_bloc.dart')).toBeTruthy();
    fireEvent.click(screen.getByText('Siguiente paso'));
    expect(container.querySelector('.fr-st.fr-on').textContent).toBe('Bloc');
    fireEvent.click(screen.getByText('Siguiente paso'));
    expect(container.querySelector('.fr-st.fr-on').textContent).toBe('Dominio');
    expect(screen.getByText('sign_up_usecase.dart')).toBeTruthy();
  });

  it('goes through the use case and both data branches, then shows the real profile', () => {
    renderBlock('register-clean');
    register();
    runAll();
    expect(screen.getByTestId('auth-users').textContent).toContain('ana@icesi.edu.co');
    expect(screen.getByTestId('profiles-table').textContent).toContain('Ana Gómez');
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterStatus.success');
    expect(screen.getByTestId('register-phone').textContent).toContain('@ana');
  });

  it('keeps the form with the error message when the email already exists', () => {
    renderBlock('register-clean');
    register();
    runAll();
    fireEvent.click(screen.getByText('Volver a /register'));
    register();
    runAll();
    expect(screen.getByTestId('bloc-state').textContent).toBe('RegisterStatus.failure');
    expect(screen.getByText(/User already registered/)).toBeTruthy();
    expect(screen.getByText('Registrarme').disabled).toBe(false);
  });
});

describe('register-clean circle tab', () => {
  it('only exists in the clean simulator and mirrors the saved rows', () => {
    const { unmount } = renderBlock('register-layers');
    expect(screen.queryByText('Clean')).toBeNull();
    unmount();
    const { container } = renderBlock('register-clean');
    fireEvent.click(screen.getByText('Clean'));
    expect(container.querySelector('.fc-wrap').hidden).toBe(false);
    fireEvent.click(screen.getByText('Registrarme'));
    act(() => vi.advanceTimersByTime(60000));
    const circle = container.querySelector('.fc-svg').textContent;
    expect(circle).toContain('ana@icesi.edu');
    expect(circle).toContain('@ana');
    expect(circle).toContain('RegisterStatus.success');
  });
});

describe('register-clean arrows inside a layer', () => {
  it('draws the use case call to each contract in the Clean tab', () => {
    const { container } = renderBlock('register-clean');
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    fireEvent.click(screen.getByText('Registrarme'));
    const banners = [];
    while (screen.getByText('Siguiente paso').style.display !== 'none') {
      fireEvent.click(screen.getByText('Siguiente paso'));
      if (container.querySelector('.fc-hop')) banners.push(container.querySelector('.fc-banner').textContent);
    }
    expect(banners).toContain('↓ _auth.signUp(email, password)');
    expect(banners).toContain('↓ _profiles.createProfile(profile)');
    expect(banners).toContain('↓ _dataSource.signUp(email, password)');
  });
});

describe('register simulators step by step', () => {
  const walk = (name, email) => {
    const { container } = renderBlock(name);
    if (email) {
      fireEvent.click(screen.getByText('Registrarme'));
      act(() => vi.advanceTimersByTime(60000));
      fireEvent.click(screen.getByText('Volver a /register'));
    }
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    fireEvent.click(screen.getByText('Registrarme'));
    const bands = [...container.querySelectorAll('.fr-band')];
    const snapshot = () => ({
      messages: container.querySelectorAll('.fr-msg').length,
      arrows: container.querySelectorAll('.fc-hop').length,
      layer: bands.findIndex((band) => band.classList.contains('fr-on')),
    });
    const steps = [snapshot()];
    while (screen.getByText('Siguiente paso').style.display !== 'none') {
      fireEvent.click(screen.getByText('Siguiente paso'));
      steps.push(snapshot());
    }
    return steps;
  };

  [
    ['register-layers', false],
    ['register-layers', true],
    ['register-clean', false],
    ['register-clean', true],
  ].forEach(([name, repeated]) => {
    const label = repeated ? 'with a repeated email' : 'on success';
    it(`${name} shows at most one hop per step ${label}`, () => {
      const steps = walk(name, repeated);
      expect(steps.length).toBeGreaterThan(8);
      expect(Math.max(...steps.map((step) => step.messages))).toBe(1);
      expect(Math.max(...steps.map((step) => step.arrows))).toBeLessThanOrEqual(1);
    });

    it(`${name} never skips a layer between steps ${label}`, () => {
      const steps = walk(name, repeated);
      steps.forEach((step) => expect(step.layer).toBeGreaterThanOrEqual(0));
      steps.slice(1).forEach((step, index) => {
        expect(Math.abs(step.layer - steps[index].layer)).toBeLessThanOrEqual(1);
      });
    });
  });
});

describe('query-builder', () => {
  it('chains filters as AND and keeps the order of the query', () => {
    expect(runQuery({ filter1: 'flutter' }).ordered).toEqual(['p10', 'p8', 'p4', 'p2']);
    expect(runQuery({ filter1: 'flutter', filter2: 'mine' }).ordered).toEqual(['p10', 'p4']);
    expect(runQuery({ filter1: 'recent', order: 'oldest' }).ordered).toEqual(['p6', 'p7', 'p8', 'p9', 'p10']);
  });

  it('treats both ends of range as inclusive', () => {
    expect(runQuery({ page: 'r0' }).kept).toEqual(['p10', 'p9', 'p8']);
    expect(runQuery({ page: 'r1' }).kept).toEqual(['p7', 'p6', 'p5']);
    expect(runQuery({ page: 'limit3' }).kept).toEqual(runQuery({ page: 'r0' }).kept);
    expect(runQuery({ filter1: 'flutter', page: 'r1' }).kept).toEqual(['p2']);
  });

  it('projects the selected columns, with the author nested', () => {
    expect(runQuery({ columns: 'some', filter1: 'one' }).result).toEqual([{ id: 'p7', content: 'Ya entiendo single()' }]);
    expect(runQuery({ columns: 'author', filter1: 'one', end: 'single' }).result).toEqual({
      id: 'p7',
      content: 'Ya entiendo single()',
      author: { username: 'ana.dev' },
    });
  });

  it('makes single() demand exactly one row and maybeSingle() accept none', () => {
    expect(runQuery({ filter1: 'one', end: 'single' }).error).toBeNull();
    expect(runQuery({ filter1: 'missing', end: 'single' }).error.code).toBe('PGRST116');
    expect(runQuery({ filter1: 'flutter', end: 'single' }).error.details).toBe('The result contains 4 rows');
    const none = runQuery({ filter1: 'missing', end: 'maybe' });
    expect(none.error).toBeNull();
    expect(none.result).toBeNull();
    expect(runQuery({ end: 'maybe' }).error.code).toBe('PGRST116');
  });

  it('writes the Dart chain in the order the SDK expects', () => {
    expect(queryCode({ filter1: 'flutter', page: 'r1' })).toBe(
      [
        'final rows = await _client',
        "    .from('posts')",
        '    .select()',
        "    .ilike('content', '%flutter%')",
        "    .order('created_at', ascending: false)",
        '    .range(3, 5);',
      ].join('\n')
    );
    expect(queryCode({ order: 'none', end: 'maybe' })).toBe(
      ["final row = await _client", "    .from('posts')", '    .select()', '    .maybeSingle();'].join('\n')
    );
  });

  it('updates the rows, the code and the result as the student changes the query', () => {
    renderBlock('query-builder');
    fireEvent.change(screen.getByLabelText('Filtro'), { target: { value: 'flutter' } });
    fireEvent.change(screen.getByLabelText('Recorte'), { target: { value: 'r0' } });
    const statuses = [...screen.getByTestId('qb-rows').children].map((row) => row.dataset.status);
    expect(statuses.filter((s) => s === 'in')).toHaveLength(3);
    expect(statuses.filter((s) => s === 'skip')).toHaveLength(1);
    expect(statuses.filter((s) => s === 'out')).toHaveLength(6);
    expect(document.querySelector('.fs-dark').textContent).toContain('.range(0, 2);');
    expect(screen.getByTestId('qb-summary').textContent).toMatch(/4 de 10 filas pasan el filtro/);

    fireEvent.change(screen.getByLabelText('Terminador'), { target: { value: 'single' } });
    expect(screen.getByTestId('qb-result').textContent).toMatch(/Cannot coerce the result to a single JSON object/);
    expect(screen.getByTestId('qb-summary').textContent).toMatch(/llegaron 3: lanza PostgrestException/);
  });
});

describe('storage-cache', () => {
  const layerOf = (s) => s.trace[s.trace.length - 1][0];

  it('with the same name, every cache keeps answering with the old photo', () => {
    let s = cacheView(cacheStart('fixed'));
    expect([s.shown, layerOf(s)]).toEqual([1, 'origin']);
    s = cacheView(cacheUpload(s));
    expect(s.dbPath).toBe('u1/avatar.jpg');
    expect([s.shown, layerOf(s)]).toEqual([1, 'memory']);
    s = cacheView(cacheRestart(s));
    expect([s.shown, layerOf(s)]).toEqual([1, 'cdn']);
    s = cacheView(cacheRestart(cacheWait(s)));
    expect([s.shown, layerOf(s)]).toEqual([2, 'origin']);
  });

  it('with a random name, the new URL misses every cache and the old file is gone', () => {
    let s = cacheView(cacheStart('random'));
    s = cacheUpload(s);
    expect(s.dbPath).toBe('u1/e4b05d11.jpg');
    expect(Object.keys(s.bucket)).toEqual(['u1/e4b05d11.jpg']);
    s = cacheView(s);
    expect(s.trace).toEqual([['memory', false], ['cdn', false], ['origin', true]]);
    expect(s.shown).toBe(2);
    expect(s.cdn[cacheUrl('u1/9c1e7b20.jpg')].version).toBe(1);
  });

  it('a long max-age only matters for URLs that never change', () => {
    let s = cacheView(cacheStart('random'));
    for (let i = 0; i < 5; i += 1) s = cacheWait(s);
    s = cacheView(cacheRestart(s));
    expect([s.shown, layerOf(s)]).toEqual([1, 'cdn']);
  });

  it('shows which layer answered and warns when the photo is stale', () => {
    renderBlock('storage-cache');
    fireEvent.click(screen.getByText('Abrir el perfil'));
    expect(document.querySelector('[data-layer="origin"]').dataset.result).toBe('hit');
    fireEvent.click(screen.getByText('Subir foto nueva'));
    fireEvent.click(screen.getByText('Abrir el perfil'));
    expect(document.querySelector('[data-layer="memory"]').dataset.result).toBe('hit');
    expect(screen.getByTestId('sc-summary').textContent).toMatch(/muestra la foto 1.*La última que subiste es la 2/);
    expect(document.querySelector('.fs-dark').textContent).toContain('upsert: true');

    fireEvent.click(screen.getByText('Nombre aleatorio'));
    fireEvent.click(screen.getByText('Abrir el perfil'));
    fireEvent.click(screen.getByText('Subir foto nueva'));
    fireEvent.click(screen.getByText('Abrir el perfil'));
    expect(screen.getByTestId('sc-summary').textContent).toMatch(/^La app muestra la foto 2: nadie la tenía/);
    expect(document.querySelector('.fs-dark').textContent).toContain("remove([oldPath])");
  });
});

describe('future-stream', () => {
  it('a future sends one request and gets exactly one reply, typed for every tab', () => {
    FS_TYPE_KEYS.forEach((key) => {
      const sc = fsScenario('future', key);
      expect(sc.hops.filter((h) => h.from === 'app')).toHaveLength(1);
      expect(sc.hops.filter((h) => h.from === 'server')).toHaveLength(1);
      expect(sc.code).toContain(`Future<${sc.spec.type}>`);
      expect(sc.code).toContain('await future');
      const end = fsAt(sc, sc.duration);
      expect(end.logs).toHaveLength(1);
      expect(end.finished).toBe(true);
      expect(sc.duration).toBeLessThanOrEqual(FS_TOTAL);
    });
  });

  it('while awaiting nothing below the await runs', () => {
    const sc = fsScenario('future', 'string');
    const mid = fsAt(sc, 1500);
    expect(mid.line).toBe(1);
    expect(mid.logs).toHaveLength(0);
    expect(fsAt(sc, sc.duration).logs[0].text).toBe('llegó Hola');
  });

  it('a stream keeps the app free, delivers values at uneven times and an error, and the app cancels', () => {
    FS_TYPE_KEYS.forEach((key) => {
      const sc = fsScenario('stream', key);
      expect(sc.code).toContain(`Stream<${sc.spec.type}>`);
      const fromServer = sc.hops.filter((h) => h.from === 'server');
      expect(fromServer.map((h) => h.tone)).toEqual(['data', 'data', 'error', 'data']);
      expect(sc.hops[sc.hops.length - 1]).toMatchObject({ from: 'app', chip: 'cancel()' });
      expect(sc.code).toContain('subscription.cancel()');
      expect(sc.code).not.toContain('onDone');
      const gaps = fromServer.slice(1).map((h, i) => h.t1 - fromServer[i].t1);
      expect(new Set(gaps).size).toBeGreaterThan(1);
      const logs = fsAt(sc, sc.duration).logs.map((l) => l.text);
      expect(logs[0]).toBe('sigo libre');
      expect(logs[logs.length - 1]).toMatch(/^llegó/);
      expect(logs.filter((l) => l.startsWith('llegó'))).toHaveLength(3);
      expect(sc.duration).toBeLessThanOrEqual(FS_TOTAL);
    });
  });

  it('a list stream sends the whole list on every event', () => {
    const logs = fsAt(fsScenario('stream', 'list'), FS_TOTAL).logs.map((l) => l.text);
    expect(logs).toContain('llegó [Message(Ana: Hola)]');
    expect(logs).toContain('llegó [Message(Ana: Hola), Message(Luis: ¿Vienes?), Message(Ana: Voy)]');
  });

  it('plays over time, prints on arrival and switches tabs', () => {
    const { container } = renderBlock('future-stream');
    const log = () => container.querySelector('.fs-log').textContent;
    fireEvent.click(screen.getByRole('button', { name: 'Reproducir' }));
    act(() => vi.advanceTimersByTime(1500));
    expect(log()).toBe('');
    expect(screen.getByTestId('fs-summary').textContent).toMatch(/await/);
    act(() => vi.advanceTimersByTime(2000));
    expect(log()).toContain('llegó 42');
    expect(screen.getByRole('button', { name: 'Repetir' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Stream' }));
    fireEvent.click(screen.getByRole('button', { name: 'Objeto' }));
    expect(log()).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Reproducir' }));
    act(() => vi.advanceTimersByTime(800));
    expect(log()).toContain('sigo libre');
    act(() => vi.advanceTimersByTime(7000));
    expect(log()).toContain('llegó Message(Luis: ¿Vienes?)');
    expect(screen.getByTestId('fs-summary').textContent).toMatch(/ya no le llega/);
    expect(screen.getByTestId('fs-clock').textContent).toMatch(/t = 6,9 s/);
  });
});

describe('stream-pipe', () => {
  const run = (s, ...actions) => actions.reduce((acc, a) => {
    const r = pipeAct(acc.s, a);
    return { s: r.s, effects: [...acc.effects, r.effect] };
  }, { s, effects: [] });

  it('a stream delivers many values, survives an error and refuses events after close', () => {
    const { effects } = run(pipeStart('stream'), 'add', 'add', 'error', 'add', 'close', 'add');
    expect(effects.map((e) => e.kind)).toEqual(['data', 'data', 'error', 'data', 'done', 'throw']);
    expect(effects[3].value).toBe(3);
    expect(effects[5].text).toMatch(/after calling close/);
  });

  it('map transforms each value and cancel stops the delivery', () => {
    const { effects } = run(pipeStart('stream', true), 'add', 'cancel', 'add');
    expect(effects[0].out).toBe(10);
    expect(effects[2].lost).toBe(true);
  });

  it('a future completes only once', () => {
    const { effects } = run(pipeStart('future'), 'complete', 'complete');
    expect(effects.map((e) => e.kind)).toEqual(['data', 'throw']);
    expect(effects[1].text).toMatch(/already completed/);
  });

  it('prints what reaches listen once the value crosses the pipe', () => {
    const { container } = renderBlock('stream-pipe');
    fireEvent.click(screen.getByText('add(1)'));
    expect(container.querySelector('.fs-log').textContent).toBe('');
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector('.fs-log').textContent).toContain('llegó 1');
    fireEvent.click(screen.getByText('cancel()'));
    fireEvent.click(screen.getByText('add(2)'));
    act(() => vi.advanceTimersByTime(2000));
    expect(container.querySelector('.fs-log').textContent).not.toContain('llegó 2');
    expect(screen.getByTestId('rt-pipe-summary').textContent).toMatch(/nadie lo recibió/);
  });
});

describe('stream-layers', () => {
  ['open', 'ana', 'me', 'close'].forEach((key) => {
    it(`${key}: one hop per step and no skipped layers inside a row`, () => {
      rtLayersScenario(key).forEach((row) => {
        row.steps.slice(1).forEach((step, i) => {
          expect(Math.abs(step.at - row.steps[i].at)).toBeLessThanOrEqual(1);
        });
        row.steps.filter((step) => step.hop).forEach((step) => {
          expect(Math.abs(step.hop[0] - step.hop[1])).toBe(1);
          expect(step.hop[1]).toBe(step.at);
        });
      });
    });
  });

  it('only the Bloc listens, and walking step by step shows at most one hop', () => {
    const { container } = renderBlock('stream-layers');
    expect(screen.getByRole('button', { name: 'Ana envía un mensaje' }).disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir el chat' }));
    let max = 0;
    let guard = 0;
    while (screen.getByText('Siguiente paso').style.display !== 'none' && guard < 100) {
      max = Math.max(max, container.querySelectorAll('.rt-hop').length);
      fireEvent.click(screen.getByText('Siguiente paso'));
      guard += 1;
    }
    expect(max).toBe(1);
    expect(container.querySelector('.rt-ear').style.display).toBe('');
    expect(container.querySelectorAll('.rt-bub').length).toBe(3);
    expect(screen.getByRole('button', { name: 'Ana envía un mensaje' }).disabled).toBe(false);
  });

  it('closing cancels the subscription and removes the pipe', () => {
    const { container } = renderBlock('stream-layers');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir el chat' }));
    act(() => vi.advanceTimersByTime(60000));
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar el chat' }));
    act(() => vi.advanceTimersByTime(60000));
    expect(container.querySelector('.rt-ear').style.display).toBe('none');
    expect(container.querySelector('.rt-pipe-bar').style.display).toBe('none');
    expect(screen.getByRole('button', { name: 'Abrir el chat' }).disabled).toBe(false);
  });
});

describe('realtime-chat', () => {
  it('a published table pushes every insert to both phones', () => {
    const s = chatSend(chatStart(), 'me', 'hola');
    expect(s.seen.me).toContain(3);
    expect(s.seen.ana).toContain(3);
  });

  it('without the publication nobody hears, until the chat is opened again', () => {
    let s = chatSend(chatPublish(chatStart(), false), 'ana', 'hola');
    expect(s.rows).toHaveLength(3);
    expect(s.seen.me).not.toContain(3);
    expect(s.seen.ana).not.toContain(3);
    s = chatReopen(s, 'me');
    expect(s.seen.me).toContain(3);
  });

  it('puts my messages on the right in each phone', () => {
    const { container } = renderBlock('realtime-chat');
    type('Mensaje de Ana', 'hola a todos');
    fireEvent.click(screen.getByLabelText('Enviar como Ana'));
    act(() => vi.advanceTimersByTime(500));
    const last = (who) => [...container.querySelectorAll(`[data-phone="${who}"] .rc-b`)].pop();
    expect(last('ana').textContent).toBe('hola a todos');
    expect(last('ana').classList.contains('rc-mine')).toBe(true);
    expect(last('me').classList.contains('rc-mine')).toBe(false);
    expect(screen.getByTestId('rc-summary').textContent).toMatch(/a los dos teléfonos/);
  });
});

describe('chat-pagination', () => {
  it('pages back five at a time until there is nothing left', () => {
    let s = pageStart('merge', 22);
    expect(s.messages.map((m) => m.id)[0]).toBe(8);
    s = pageOlder(s);
    expect(s.messages[0].id).toBe(3);
    expect(s.hasMore).toBe(true);
    s = pageOlder(s);
    expect(s.messages[0].id).toBe(1);
    expect(s.hasMore).toBe(false);
  });

  it('in part 1 reaching the top only prints', () => {
    const s = pageOlder(pageStart('p1'));
    expect(s.messages).toHaveLength(15);
    expect(s.last.kind).toBe('ignored');
  });

  it('replacing on MessagesUpdated loses the pages; merging keeps them', () => {
    const lost = pageIncoming(pageOlder(pageStart('older')));
    expect(lost.messages).toHaveLength(15);
    expect(lost.last.lost).toBe(6);
    const kept = pageIncoming(pageOlder(pageStage(pageStart('older'), 'merge')), 'me', 'hola');
    expect(kept.messages).toHaveLength(21);
    expect(kept.messages[kept.messages.length - 1]).toMatchObject({ id: 33, from: 'me', text: 'hola' });
  });

  it('scrolling to the top loads a page by Future and a new message drops it', () => {
    renderBlock('chat-pagination');
    const scroller = screen.getByTestId('pg-scroll');
    fireEvent.scroll(scroller);
    expect(screen.getByTestId('pg-summary').textContent).toMatch(/solo lo imprime/);
    fireEvent.click(screen.getByText('Parte 2 · cargar anteriores'));
    fireEvent.scroll(scroller, { target: { scrollTop: 200 } });
    fireEvent.scroll(scroller, { target: { scrollTop: 0 } });
    expect(screen.getByText('cargando anteriores…')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(800); });
    expect(document.querySelectorAll('.pg-page')).toHaveLength(5);
    fireEvent.click(screen.getByText('Ana envía un mensaje'));
    expect(document.querySelectorAll('.pg-page')).toHaveLength(0);
    expect(screen.getByTestId('pg-summary').textContent).toMatch(/se perdieron 6/);
  });

  it('a typed message comes back through the Stream and merging keeps the pages', () => {
    renderBlock('chat-pagination');
    fireEvent.click(screen.getByText('Parte 2 · juntar por id'));
    const scroller = screen.getByTestId('pg-scroll');
    fireEvent.scroll(scroller, { target: { scrollTop: 0 } });
    act(() => { vi.advanceTimersByTime(800); });
    const input = screen.getByTestId('pg-input');
    fireEvent.change(input, { target: { value: 'hola' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByTestId('pg-summary').textContent).toMatch(/MessageSent/);
    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByTestId('pg-list').textContent).toMatch(/m33 hola/);
    expect(document.querySelectorAll('.pg-page')).toHaveLength(5);
  });
});

describe('conversation-open', () => {
  it('creates the pair once and finds it from either side', () => {
    let { next, steps } = convOpen(convStart(), 'ana', 'beto');
    expect(next.rows).toHaveLength(2);
    expect(next.rows[1]).toMatchObject({ u1: '1a9d…', u2: '7c2e…' });
    expect(steps[steps.length - 1].done).toBe(true);
    expect(steps.some((st) => st.added)).toBe(true);
    const created = next.rows[1].id;
    const again = convOpen(next, 'beto', 'ana');
    expect(again.next.rows).toHaveLength(2);
    expect(again.next.last).toEqual({ kind: 'found', id: created });
    expect(again.steps.some((st) => st.added)).toBe(false);
  });

  it('a chat with yourself repeats your id', () => {
    const { next } = convOpen(convStart(), 'caro', 'caro');
    expect(next.rows[1]).toMatchObject({ u1: 'b45f…', u2: 'b45f…' });
  });

  it('every hop goes one way per step and answers come right after', () => {
    const { steps } = convOpen(convStart(), 'ana', 'caro');
    const hops = steps.filter((st) => st.hop).map((st) => st.hop.dir);
    expect(hops).toEqual(['up', 'down', 'up', 'down']);
    steps.forEach((st, i) => {
      if (st.hop && st.hop.dir === 'down') expect(steps[i - 1].hop.dir).toBe('up');
    });
  });

  it('plays the lookup and adds the row to the table', () => {
    renderBlock('conversation-open');
    expect(screen.getByTestId('cv-table').children).toHaveLength(1);
    fireEvent.click(screen.getByTestId('cv-contact-beto'));
    act(() => { vi.advanceTimersByTime(1500 * 10); });
    expect(screen.getByTestId('cv-table').children).toHaveLength(2);
    expect(screen.getByTestId('cv-caption').textContent).toMatch(/La próxima vez/);
    fireEvent.click(screen.getByText('Soy Beto'));
    fireEvent.click(screen.getByTestId('cv-contact-ana'));
    act(() => { vi.advanceTimersByTime(1500 * 10); });
    expect(screen.getByTestId('cv-table').children).toHaveLength(2);
    expect(screen.getByTestId('cv-caption').textContent).toMatch(/no crea nada/);
  });
});
