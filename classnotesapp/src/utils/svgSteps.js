// Animated lesson figures declare their timeline on the <svg> root:
// data-steps (how many) and data-step-seconds (how long each lasts).

// Fraction of a step shown before a manual prev/next comes to rest: late enough
// for the step to have played, early enough that its fade-out has not started.
export const STEP_HOLD = 0.8;

export const readSteps = (svg) => {
  const steps = Number(svg?.dataset?.steps);
  const seconds = Number(svg?.dataset?.stepSeconds);
  if (!Number.isInteger(steps) || steps < 2 || !(seconds > 0)) return null;
  return { steps, stepMs: seconds * 1000 };
};

export const stepAt = (timeMs, { steps, stepMs }) => {
  const total = steps * stepMs;
  const inCycle = ((Number(timeMs) || 0) % total + total) % total;
  return Math.min(steps - 1, Math.floor(inCycle / stepMs));
};

export const wrapStep = (index, steps) => ((index % steps) + steps) % steps;

// The animations that follow the figure's timeline. A figure may also carry
// short decorative loops (a spinner), which keep their own clock.
export const timelineAnimations = (animations, { steps, stepMs }) =>
  animations.filter(
    (a) => Math.abs(Number(a.effect?.getComputedTiming?.().duration) - steps * stepMs) < 1
  );
