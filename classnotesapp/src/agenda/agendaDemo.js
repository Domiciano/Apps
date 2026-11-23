// src/agenda/agendaDemo.js
//
// Agenda en memoria para revisar la interfaz sin tocar Firestore. Solo se usa en
// `npm run dev` con `/agenda?demo` (vista de estudiante) o `/agenda?demo=profesor`.
// Los nombres son inventados a propósito: este archivo va en el bundle.

import { accountIdFor, bookingIdFor, isClosedSlot } from './agendaSlots';

const DEMO_GROUPS = [
  { id: 'equipo-1-orbita', name: 'Equipo 1 · Órbita', members: ['Ana Gómez', 'Luis Pérez', 'Sara Ríos'] },
  { id: 'equipo-2-faro', name: 'Equipo 2 · Faro', members: ['Mateo Díaz', 'Valeria Cruz'] },
  { id: 'equipo-3-colmena', name: 'Equipo 3 · Colmena', members: ['Tomás Vélez', 'Lucía Mora', 'Daniel Ruiz', 'Paula León'] },
  { id: 'equipo-4-brujula', name: 'Equipo 4 · Brújula', members: ['Camila Soto', 'Andrés Lara', 'Julián Paz'] },
  { id: 'equipo-5-raiz', name: 'Equipo 5 · Raíz', members: ['Sofía Niño', 'Martín Gil'] },
];

const OTHER_COURSE = { moviles: 'compunet2', compunet2: 'seminario', seminario: 'moviles' };

export function createDemoAgenda(courseId, { teacher = false } = {}) {
  const user = teacher
    ? { uid: 'demo-profesor', email: 'profesor@demo', displayName: 'Profesor demo' }
    : { uid: 'demo-estudiante', email: 'estudiante@demo', displayName: 'Estudiante demo' };
  const other = OTHER_COURSE[courseId] ?? 'seminario';

  const state = {
    groups: DEMO_GROUPS,
    slots: new Map(),
    bookings: new Map(),
    accounts: new Map(),
  };
  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => fn());

  const put = (courseIdOf, group, slotId, modality, bookerName, by) => {
    state.slots.set(slotId, { id: slotId, slotId, courseId: courseIdOf, groupId: group.id, uid: by.uid });
    state.bookings.set(bookingIdFor(courseIdOf, group.id), {
      courseId: courseIdOf,
      groupId: group.id,
      groupName: group.name,
      members: group.members,
      slotId,
      modality,
      bookerName,
      bookedBy: by,
    });
  };
  const someone = { uid: 'otro', email: 'otro@demo', displayName: 'Otra persona' };
  put(courseId, DEMO_GROUPS[0], '2026-11-25_14-00', 'presencial', 'Ana Gómez', someone);
  put(courseId, DEMO_GROUPS[2], '2026-11-26_10-00', 'virtual', 'Lucía Mora', someone);
  put(other, { id: 'x1', name: 'Grupo de otro curso', members: ['Persona A', 'Persona B'] }, '2026-11-25_14-30', 'virtual', 'Persona A', someone);
  put(other, { id: 'x2', name: 'Otro grupo externo', members: ['Persona C'] }, '2026-11-26_09-00', 'presencial', 'Persona C', someone);
  put(other, { id: 'x3', name: 'Tercer grupo externo', members: ['Persona D', 'Persona E'] }, '2026-11-30_14-00', 'presencial', 'Persona D', someone);

  const subscribe = (fn) => {
    const run = () => fn();
    listeners.add(run);
    run();
    return () => listeners.delete(run);
  };

  const wait = () => new Promise((r) => setTimeout(r, 450));
  const taken = (code) => Object.assign(new Error(code), { code });

  return {
    isDemo: true,
    user,
    isTeacher: teacher,
    watchSlots: (onData) => subscribe(() => onData([...state.slots.values()])),
    watchBookings: (cid, onData, _onError, { allCourses = false } = {}) =>
      subscribe(() =>
        onData([...state.bookings.values()].filter((b) => allCourses || b.courseId === cid)),
      ),
    watchGroups: (_cid, onData) => subscribe(() => onData(state.groups)),
    saveGroups: async (_cid, groups) => {
      await wait();
      state.groups = groups;
      emit();
    },
    bookSlot: async ({ courseId: cid, group, slot: wanted, modality, bookerName, user: by, isTeacher = false }) => {
      await wait();
      const slotId = wanted.id;
      if (!isTeacher && isClosedSlot(wanted)) throw taken('too-late');
      const slot = state.slots.get(slotId);
      if (slot && !(slot.courseId === cid && slot.groupId === group.id)) throw taken('slot-taken');
      const key = bookingIdFor(cid, group.id);
      const account = state.accounts.get(accountIdFor(cid, by.uid));
      if (!isTeacher && account && account !== key) throw taken('account-booked');
      const previous = state.bookings.get(key);
      if (previous && previous.bookedBy.uid !== by.uid) throw taken('group-booked');
      if (previous) state.slots.delete(previous.slotId);
      if (!isTeacher) state.accounts.set(accountIdFor(cid, by.uid), key);
      put(cid, group, slotId, modality, bookerName, { uid: by.uid, email: by.email, displayName: by.displayName });
      emit();
    },
    cancelBooking: async (booking) => {
      await wait();
      const key = bookingIdFor(booking.courseId, booking.groupId);
      const current = state.bookings.get(key);
      if (!current) return;
      state.slots.delete(current.slotId);
      state.bookings.delete(key);
      state.accounts.delete(accountIdFor(current.courseId, current.bookedBy.uid));
      emit();
    },
  };
}
