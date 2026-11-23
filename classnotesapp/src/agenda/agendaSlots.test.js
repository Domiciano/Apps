import { describe, it, expect } from 'vitest';
import {
  bookingIdFor,
  buildBoard,
  buildSlots,
  formatDay,
  friendlyAgendaError,
  groupSlotsByDay,
  isClosedSlot,
  isPastSlot,
  accountIdFor,
  slotIdFor,
  SLOT_ID_PATTERN,
  splitGroups,
} from './agendaSlots';

describe('buildSlots', () => {
  const slots = buildSlots();

  it('parte las ventanas configuradas en 32 franjas de 30 minutos', () => {
    expect(slots).toHaveLength(32);
    expect(slots[0]).toMatchObject({ id: '2026-11-25_14-00', start: '14:00', end: '14:30' });
    expect(slots.at(-1)).toMatchObject({ id: '2026-12-01_15-30', start: '15:30', end: '16:00' });
  });

  it('da ids únicos, ordenados y con el formato que exigen las reglas', () => {
    const ids = slots.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(ids);
    ids.forEach((id) => expect(id).toMatch(SLOT_ID_PATTERN));
  });

  it('no deja una franja incompleta al final de una ventana', () => {
    const odd = buildSlots([{ date: '2026-12-02', start: '09:00', end: '10:15' }]);
    expect(odd.map((s) => s.start)).toEqual(['09:00', '09:30']);
  });

  it('une ventanas que se solapan sin duplicar franjas', () => {
    const twice = buildSlots([
      { date: '2026-12-02', start: '09:00', end: '10:00' },
      { date: '2026-12-02', start: '09:30', end: '10:30' },
    ]);
    expect(twice.map((s) => s.start)).toEqual(['09:00', '09:30', '10:00']);
  });

  it('el lunes 30 tiene la mañana y la tarde en un solo día', () => {
    const monday = groupSlotsByDay(slots).find((d) => d.date === '2026-11-30');
    expect(monday.slots).toHaveLength(14);
  });
});

describe('fechas', () => {
  const slot = { date: '2026-11-25', start: '14:00' };

  it('interpreta la hora en Colombia (UTC−5)', () => {
    expect(isPastSlot(slot, new Date('2026-11-25T18:59:00Z'))).toBe(false);
    expect(isPastSlot(slot, new Date('2026-11-25T19:00:00Z'))).toBe(true);
  });

  it('cierra la franja cuando faltan menos de 24 horas', () => {
    expect(isClosedSlot(slot, new Date('2026-11-24T19:00:00Z'))).toBe(false);
    expect(isClosedSlot(slot, new Date('2026-11-24T19:01:00Z'))).toBe(true);
  });

  it('nombra el día en español y con mayúscula', () => {
    expect(formatDay('2026-11-25')).toMatch(/^Miércoles, 25 de noviembre$/);
  });

  it('construye ids de franja y de reserva', () => {
    expect(slotIdFor('2026-11-30', '09:30')).toBe('2026-11-30_09-30');
    expect(bookingIdFor('moviles', 'equipo-1')).toBe('moviles__equipo-1');
    expect(accountIdFor('seminario', 'abc')).toBe('seminario__abc');
  });
});

describe('buildBoard', () => {
  const slots = buildSlots([{ date: '2026-11-25', start: '14:00', end: '15:30' }]);
  const slotDocs = [
    { id: '2026-11-25_14-00', courseId: 'moviles', groupId: 'g1' },
    { id: '2026-11-25_14-30', courseId: 'seminario', groupId: 'g9' },
  ];
  const bookings = [{ courseId: 'moviles', groupId: 'g1', slotId: '2026-11-25_14-00', groupName: 'Equipo 1' }];
  const board = buildBoard({ slots, slotDocs, bookings, courseId: 'moviles', now: new Date('2026-11-20T12:00:00Z') });

  it('distingue franja propia, de otro curso y libre', () => {
    expect(board.map((c) => c.status)).toEqual(['mine', 'taken', 'free']);
  });

  it('adjunta la reserva solo cuando la conoce', () => {
    expect(board[0].booking.groupName).toBe('Equipo 1');
    expect(board[1].booking).toBeNull();
    expect(board[1].courseId).toBe('seminario');
  });

  it('marca como pasadas las franjas cuya hora ya llegó', () => {
    const later = buildBoard({ slots, slotDocs: [], bookings: [], courseId: 'moviles', now: new Date('2026-11-25T19:45:00Z') });
    expect(later.map((c) => c.past)).toEqual([true, true, false]);
    expect(later.map((c) => c.closed)).toEqual([true, true, true]);
  });

  it('deja abiertas las franjas a más de 24 horas', () => {
    expect(board.every((c) => c.closed === false)).toBe(true);
  });
});

describe('splitGroups', () => {
  const groups = [
    { id: 'a', name: 'A', members: [] },
    { id: 'b', name: 'B', members: [] },
    { id: 'c', name: 'C', members: [] },
  ];
  const bookings = [
    { courseId: 'moviles', groupId: 'c', slotId: '2026-11-25_14-00' },
    { courseId: 'moviles', groupId: 'a', slotId: '2026-11-30_09-00' },
    { courseId: 'seminario', groupId: 'b', slotId: '2026-11-26_09-00' },
  ];

  it('separa los grupos con fecha de los que no tienen, solo del propio curso', () => {
    const { withDate, withoutDate } = splitGroups(groups, bookings, 'moviles');
    expect(withoutDate.map((g) => g.id)).toEqual(['b']);
    expect(withDate.map((w) => w.group.id)).toEqual(['c', 'a']);
  });
});

describe('friendlyAgendaError', () => {
  it('traduce los errores propios y los de Firestore', () => {
    expect(friendlyAgendaError({ code: 'slot-taken' })).toMatch(/acaba de tomar/);
    expect(friendlyAgendaError({ code: 'group-booked' })).toMatch(/ya tiene fecha/);
    expect(friendlyAgendaError({ code: 'permission-denied' })).toMatch(/rechazó/);
    expect(friendlyAgendaError({})).toMatch(/No se pudo/);
  });
});
