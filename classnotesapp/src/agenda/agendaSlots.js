// src/agenda/agendaSlots.js
//
// Lógica pura de la agenda: de las ventanas de agendaConfig.js a franjas, y de
// las franjas + reservas + grupos al tablero que pinta AgendaPage. Sin Firebase,
// para poder probarla entera.

import {
  AGENDA_WINDOWS,
  BOOKING_LEAD_HOURS,
  MODALITIES,
  SLOT_MINUTES,
  TIMEZONE_OFFSET,
} from './agendaConfig';

const pad = (n) => String(n).padStart(2, '0');

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const fromMinutes = (total) => `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;

// "2026-11-25" + "14:00" → "2026-11-25_14-00". Es el id del documento en
// agendaSlots/: que sea único por franja es lo que impide los traslapes.
export const slotIdFor = (date, start) => `${date}_${start.replace(':', '-')}`;

export const SLOT_ID_PATTERN = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}$/;

export function buildSlots(windows = AGENDA_WINDOWS, minutes = SLOT_MINUTES) {
  const slots = [];
  const seen = new Set();
  for (const w of windows) {
    const from = toMinutes(w.start);
    const to = toMinutes(w.end);
    for (let t = from; t + minutes <= to; t += minutes) {
      const start = fromMinutes(t);
      const id = slotIdFor(w.date, start);
      if (seen.has(id)) continue;
      seen.add(id);
      slots.push({
        id,
        date: w.date,
        start,
        end: fromMinutes(t + minutes),
        modalities: w.modalities ?? MODALITIES.map((m) => m.id),
      });
    }
  }
  return slots.sort((a, b) => a.id.localeCompare(b.id));
}

export const slotStartDate = (slot) =>
  new Date(`${slot.date}T${slot.start}:00${TIMEZONE_OFFSET}`);

export const isPastSlot = (slot, now = new Date()) => slotStartDate(slot) <= now;

// Cerrada: todavía no empieza, pero falta menos de BOOKING_LEAD_HOURS.
export const isClosedSlot = (slot, now = new Date(), leadHours = BOOKING_LEAD_HOURS) =>
  slotStartDate(slot).getTime() - now.getTime() < leadHours * 3_600_000;

const DAY_FORMAT = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Bogota',
});

export const formatDay = (date) => {
  const text = DAY_FORMAT.format(new Date(`${date}T12:00:00${TIMEZONE_OFFSET}`));
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatSlotTime = (slot) => `${slot.start} – ${slot.end}`;

export const formatSlot = (slot) => `${formatDay(slot.date)} · ${formatSlotTime(slot)}`;

export const modalityLabel = (id) => MODALITIES.find((m) => m.id === id)?.label ?? id;

export const bookingIdFor = (courseId, groupId) => `${courseId}__${groupId}`;

// agendaAccounts/{courseId}__{uid}: marca que esa cuenta ya tiene su reserva en
// ese curso. Es lo que permite a las reglas exigir una sola fecha por cuenta.
export const accountIdFor = (courseId, uid) => `${courseId}__${uid}`;

export function groupSlotsByDay(slots) {
  const days = [];
  for (const slot of slots) {
    let day = days[days.length - 1];
    if (!day || day.date !== slot.date) {
      day = { date: slot.date, label: formatDay(slot.date), slots: [] };
      days.push(day);
    }
    day.slots.push(slot);
  }
  return days;
}

// Estado de cada franja visto desde un curso:
//   free     — nadie la tiene
//   mine     — la tiene un grupo de este curso (con su reserva)
//   taken    — la tiene otro curso (sin detalles, salvo para el profesor)
// `past` se añade aparte: una franja pasada no se puede reservar, pero sigue
// mostrando quién la tuvo.
export function buildBoard({ slots, slotDocs, bookings, courseId, now = new Date() }) {
  const slotById = new Map(slotDocs.map((s) => [s.id ?? s.slotId, s]));
  const bookingByKey = new Map(bookings.map((b) => [bookingIdFor(b.courseId, b.groupId), b]));
  return slots.map((slot) => {
    const taken = slotById.get(slot.id);
    const past = isPastSlot(slot, now);
    const closed = isClosedSlot(slot, now);
    if (!taken) return { slot, status: 'free', past, closed };
    const booking = bookingByKey.get(bookingIdFor(taken.courseId, taken.groupId)) ?? null;
    if (taken.courseId === courseId) return { slot, status: 'mine', booking, past, closed };
    return { slot, status: 'taken', courseId: taken.courseId, booking, past, closed };
  });
}

export function splitGroups(groups, bookings, courseId) {
  const booked = new Map(
    bookings.filter((b) => b.courseId === courseId).map((b) => [b.groupId, b]),
  );
  const withDate = [];
  const withoutDate = [];
  for (const g of groups) {
    const booking = booked.get(g.id);
    if (booking) withDate.push({ group: g, booking });
    else withoutDate.push(g);
  }
  withDate.sort((a, b) => a.booking.slotId.localeCompare(b.booking.slotId));
  return { withDate, withoutDate };
}

export const friendlyAgendaError = (err) => {
  const code = err?.code ?? err?.message ?? '';
  if (code === 'slot-taken') return 'Otra persona acaba de tomar esa franja. Escoge otra.';
  if (code === 'too-late') return `Las franjas se reservan con al menos ${BOOKING_LEAD_HOURS} horas de anticipación. Escoge una más adelante.`;
  if (code === 'account-booked') return 'Con esta cuenta ya reservaste para otro grupo de este curso. Solo se puede tener una fecha.';
  if (code === 'group-booked') return 'Ese grupo ya tiene fecha. Si quieres cambiarla, pídeselo a quien reservó o escríbele al profesor.';
  if (String(code).includes('permission-denied')) {
    return 'Firestore rechazó la operación. Si la franja estaba libre, es probable que otra persona la haya tomado en ese instante: recarga y vuelve a intentarlo.';
  }
  if (String(code).includes('unavailable')) return 'Sin conexión con el servidor. Revisa tu red e inténtalo de nuevo.';
  return 'No se pudo completar la operación. Inténtalo de nuevo.';
};
