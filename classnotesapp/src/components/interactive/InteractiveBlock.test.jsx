import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import { SIMS, parseSpec } from './flutterStateSims';

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
