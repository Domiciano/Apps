import { describe, it, expect } from 'vitest';
import { detectCycles } from './cycleDetection';

const bean = (name) => ({ beanName: name });
const wire = (from, to) => ({ from, to });

describe('detectCycles', () => {
  it('returns empty array when there are no beans', () => {
    expect(detectCycles([], [])).toHaveLength(0);
  });

  it('returns empty array when there are beans but no wirings', () => {
    const beans = [bean('a'), bean('b')];
    expect(detectCycles(beans, [])).toHaveLength(0);
  });

  it('returns empty array for a linear dependency chain (no cycle)', () => {
    const beans = [bean('a'), bean('b'), bean('c')];
    const wirings = [wire('a', 'b'), wire('b', 'c')];
    expect(detectCycles(beans, wirings)).toHaveLength(0);
  });

  it('detects a direct A → B → A cycle', () => {
    const beans = [bean('a'), bean('b')];
    const wirings = [wire('a', 'b'), wire('b', 'a')];
    const cycles = detectCycles(beans, wirings);
    expect(cycles.length).toBeGreaterThan(0);
  });

  it('detects a three-node A → B → C → A cycle', () => {
    const beans = [bean('a'), bean('b'), bean('c')];
    const wirings = [wire('a', 'b'), wire('b', 'c'), wire('c', 'a')];
    const cycles = detectCycles(beans, wirings);
    expect(cycles.length).toBeGreaterThan(0);
  });

  it('does not report a cycle when a bean depends on itself transitively without a loop', () => {
    // a → b, a → c (diamond, but no cycle)
    const beans = [bean('a'), bean('b'), bean('c'), bean('d')];
    const wirings = [wire('a', 'b'), wire('a', 'c'), wire('b', 'd'), wire('c', 'd')];
    expect(detectCycles(beans, wirings)).toHaveLength(0);
  });

  it('each cycle element is an array of bean names', () => {
    const beans = [bean('x'), bean('y')];
    const wirings = [wire('x', 'y'), wire('y', 'x')];
    const cycles = detectCycles(beans, wirings);
    expect(Array.isArray(cycles[0])).toBe(true);
    expect(typeof cycles[0][0]).toBe('string');
  });
});
