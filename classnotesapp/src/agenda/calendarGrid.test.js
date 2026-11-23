import { describe, it, expect } from 'vitest';
import { addDays, monthGrid, monthLabel, monthsFor, weekBand } from './calendarGrid';

const WEEKS = [
  { number: 17, start: '2026-11-23' },
  { number: 18, start: '2026-11-30' },
];

describe('monthGrid', () => {
  it('arma noviembre de 2026 empezando en lunes', () => {
    const rows = monthGrid(2026, 11);
    expect(rows[0]).toEqual([null, null, null, null, null, null, '2026-11-01']);
    expect(rows.at(-1)).toEqual(['2026-11-30', null, null, null, null, null, null]);
    rows.forEach((r) => expect(r).toHaveLength(7));
  });

  it('arma diciembre de 2026 con el 1 en martes', () => {
    expect(monthGrid(2026, 12)[0].slice(0, 3)).toEqual([null, '2026-12-01', '2026-12-02']);
  });
});

describe('weekBand', () => {
  it('marca de lunes a viernes la semana 17', () => {
    const row = monthGrid(2026, 11).find((r) => r.includes('2026-11-23'));
    expect(weekBand(row, WEEKS)).toEqual({ number: 17, from: 0, to: 4 });
  });

  it('parte la semana 18 entre noviembre y diciembre', () => {
    const nov = monthGrid(2026, 11).at(-1);
    const dec = monthGrid(2026, 12)[0];
    expect(weekBand(nov, WEEKS)).toEqual({ number: 18, from: 0, to: 0 });
    expect(weekBand(dec, WEEKS)).toEqual({ number: 18, from: 1, to: 4 });
  });

  it('no marca otras semanas', () => {
    expect(weekBand(monthGrid(2026, 11)[1], WEEKS)).toBeNull();
    expect(weekBand(monthGrid(2026, 12)[1], WEEKS)).toBeNull();
  });
});

describe('ayudas', () => {
  it('suma días cruzando de mes', () => {
    expect(addDays('2026-11-30', 4)).toBe('2026-12-04');
  });

  it('saca los meses en orden y sin repetir', () => {
    expect(monthsFor(['2026-12-01', '2026-11-25', '2026-11-30'])).toEqual([
      { year: 2026, month: 11 },
      { year: 2026, month: 12 },
    ]);
  });

  it('nombra el mes en español', () => {
    expect(monthLabel(2026, 11)).toBe('Noviembre 2026');
  });
});
