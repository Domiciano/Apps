import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import SvgBlock from './SvgBlock';
import { readSteps, stepAt, wrapStep, timelineAnimations } from '@/utils/svgSteps';

const STATIC = '<svg id="plain" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';
const ANIMATED = '<svg id="anim" data-steps="4" data-step-seconds="3" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';

const fakeAnimation = (durationMs) => ({
  currentTime: 0,
  pause: vi.fn(),
  play: vi.fn(),
  effect: { getComputedTiming: () => ({ duration: durationMs }) },
});

const renderBlock = (svg) => render(<ThemeProvider><SvgBlock svg={svg} /></ThemeProvider>);

describe('svgSteps', () => {
  it('reads the timeline from the svg root and rejects figures without one', () => {
    expect(readSteps({ dataset: { steps: '8', stepSeconds: '3' } })).toEqual({ steps: 8, stepMs: 3000 });
    expect(readSteps({ dataset: {} })).toBeNull();
    expect(readSteps({ dataset: { steps: '1', stepSeconds: '3' } })).toBeNull();
    expect(readSteps(null)).toBeNull();
  });

  it('maps a time to its step, across loops', () => {
    const t = { steps: 4, stepMs: 3000 };
    expect(stepAt(0, t)).toBe(0);
    expect(stepAt(2999, t)).toBe(0);
    expect(stepAt(3000, t)).toBe(1);
    expect(stepAt(11999, t)).toBe(3);
    expect(stepAt(12000 + 6500, t)).toBe(2);
    expect(stepAt(null, t)).toBe(0);
  });

  it('wraps previous and next around the ends', () => {
    expect(wrapStep(-1, 4)).toBe(3);
    expect(wrapStep(4, 4)).toBe(0);
  });

  it('keeps only the animations that last the whole timeline', () => {
    const main = fakeAnimation(12000);
    const spinner = fakeAnimation(1000);
    expect(timelineAnimations([main, spinner], { steps: 4, stepMs: 3000 })).toEqual([main]);
  });
});

describe('SvgBlock', () => {
  let main;
  let spinner;

  beforeEach(() => {
    vi.useFakeTimers();
    main = fakeAnimation(12000);
    spinner = fakeAnimation(1000);
    SVGElement.prototype.getAnimations = vi.fn(() => [main, spinner]);
  });

  afterEach(() => {
    vi.useRealTimers();
    delete SVGElement.prototype.getAnimations;
  });

  it('renders a static figure without controls', () => {
    const { container } = renderBlock(STATIC);
    expect(container.querySelector('svg#plain')).not.toBeNull();
    expect(screen.queryByLabelText('Paso siguiente')).toBeNull();
  });

  it('renders no controls when the browser reports no running animation', () => {
    SVGElement.prototype.getAnimations = vi.fn(() => []);
    renderBlock(ANIMATED);
    expect(screen.queryByLabelText('Paso siguiente')).toBeNull();
  });

  it('shows the controls and the current step for an animated figure', () => {
    renderBlock(ANIMATED);
    expect(screen.getByLabelText('Paso anterior')).toBeTruthy();
    expect(screen.getByLabelText('Pausar')).toBeTruthy();
    expect(screen.getByText('Paso 1 de 4')).toBeTruthy();
  });

  it('follows the animation while it plays', () => {
    renderBlock(ANIMATED);
    main.currentTime = 7000;
    act(() => { vi.advanceTimersByTime(100); });
    expect(screen.getByText('Paso 3 de 4')).toBeTruthy();
  });

  it('pauses and resumes every animation of the figure', () => {
    renderBlock(ANIMATED);
    fireEvent.click(screen.getByLabelText('Pausar'));
    expect(main.pause).toHaveBeenCalled();
    expect(spinner.pause).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Reproducir'));
    expect(main.play).toHaveBeenCalled();
    expect(screen.getByLabelText('Pausar')).toBeTruthy();
  });

  it('jumps to the next step and keeps playing when it was playing', () => {
    renderBlock(ANIMATED);
    fireEvent.click(screen.getByLabelText('Paso siguiente'));
    expect(main.currentTime).toBe(3000);
    expect(spinner.currentTime).toBe(0);
    expect(screen.getByText('Paso 2 de 4')).toBeTruthy();
    expect(screen.getByLabelText('Pausar')).toBeTruthy();
  });

  it('wraps from the first step back to the last', () => {
    renderBlock(ANIMATED);
    fireEvent.click(screen.getByLabelText('Paso anterior'));
    expect(main.currentTime).toBe(9000);
    expect(screen.getByText('Paso 4 de 4')).toBeTruthy();
  });

  it('when paused, plays the chosen step and comes to rest inside it', () => {
    renderBlock(ANIMATED);
    fireEvent.click(screen.getByLabelText('Pausar'));
    main.pause.mockClear();
    fireEvent.click(screen.getByLabelText('Paso siguiente'));
    expect(main.currentTime).toBe(3000);
    expect(main.play).toHaveBeenCalled();

    main.currentTime = 4000;
    act(() => { vi.advanceTimersByTime(100); });
    expect(main.pause).not.toHaveBeenCalled();

    main.currentTime = 5500;
    act(() => { vi.advanceTimersByTime(100); });
    expect(main.pause).toHaveBeenCalled();
    expect(screen.getByText('Paso 2 de 4')).toBeTruthy();
    expect(screen.getByLabelText('Reproducir')).toBeTruthy();
  });
});
