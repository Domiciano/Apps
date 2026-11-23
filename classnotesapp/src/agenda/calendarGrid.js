// src/agenda/calendarGrid.js
//
// Lógica pura del calendario mensual de la agenda: la cuadrícula de un mes con
// la semana empezando en lunes, y qué parte de cada fila cae dentro de una de las
// semanas marcadas (AGENDA_WEEKS). Las fechas van como texto 'AAAA-MM-DD' para no
// pelear con zonas horarias.

const pad = (n) => String(n).padStart(2, '0');

export const isoDate = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

const utc = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

export const addDays = (iso, days) => {
  const dt = new Date(utc(iso) + days * 86_400_000);
  return isoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
};

// Filas de 7 celdas (lunes → domingo); las celdas fuera del mes son null.
export function monthGrid(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells = [
    ...Array(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => isoDate(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// Meses (en orden) que contienen alguna de las fechas dadas.
export function monthsFor(dates) {
  const keys = [...new Set(dates.map((d) => d.slice(0, 7)))].sort();
  return keys.map((k) => ({ year: Number(k.slice(0, 4)), month: Number(k.slice(5, 7)) }));
}

// Para una fila del calendario: la semana marcada que la toca y las columnas
// (0 = lunes … 4 = viernes) que cubre la franja. null si ninguna.
export function weekBand(row, weeks) {
  for (const w of weeks) {
    const last = addDays(w.start, 4);
    const cols = row
      .map((date, col) => (date && col <= 4 && date >= w.start && date <= last ? col : -1))
      .filter((c) => c >= 0);
    if (cols.length > 0) return { number: w.number, from: cols[0], to: cols[cols.length - 1] };
  }
  return null;
}

const MONTH_NAME = new Intl.DateTimeFormat('es-CO', { month: 'long', timeZone: 'UTC' });

export const monthLabel = (year, month) => {
  const name = MONTH_NAME.format(new Date(Date.UTC(year, month - 1, 1)));
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
};
