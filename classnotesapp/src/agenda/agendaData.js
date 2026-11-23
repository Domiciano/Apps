// src/agenda/agendaData.js
//
// Lecturas y escrituras de la agenda en Firestore (proyecto común, ver
// agendaFirebase.js). Tres colecciones:
//
//   agendaGroups/{courseId}     lista de grupos del curso (la escribe el profesor)
//   agendaSlots/{slotId}        una por franja tomada: { courseId, groupId, uid }
//   agendaBookings/{courseId}__{groupId}
//                               la reserva del grupo: franja, modalidad, quién
//   agendaAccounts/{courseId}__{uid}
//                               la cuenta ya reservó en ese curso (una por cuenta)
//
// La franja y la reserva se escriben siempre juntas en una transacción, y las
// reglas exigen que se apunten la una a la otra. Como el id de agendaSlots ES la
// franja, crear dos veces el mismo documento es imposible: esa es la garantía de
// que dos cursos no se traslapen.

import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { agendaDb } from './agendaFirebase';
import { accountIdFor, bookingIdFor, isClosedSlot } from './agendaSlots';

const agendaError = (code) => Object.assign(new Error(code), { code });

export function watchSlots(onData, onError) {
  return onSnapshot(
    collection(agendaDb, 'agendaSlots'),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

// El estudiante solo pide las reservas de su curso: las de los otros cursos ni
// siquiera llegan a su navegador. El profesor puede pedirlas todas.
export function watchBookings(courseId, onData, onError, { allCourses = false } = {}) {
  const ref = collection(agendaDb, 'agendaBookings');
  const q = allCourses ? ref : query(ref, where('courseId', '==', courseId));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

export function watchGroups(courseId, onData, onError) {
  return onSnapshot(
    doc(agendaDb, 'agendaGroups', courseId),
    (snap) => onData(snap.exists() ? snap.data().groups ?? [] : null),
    onError,
  );
}

export async function saveGroups(courseId, groups) {
  await setDoc(doc(agendaDb, 'agendaGroups', courseId), {
    courseId,
    groups,
    groupIds: groups.map((g) => g.id),
    updatedAt: serverTimestamp(),
  });
}

// Reserva (o mueve) la franja de un grupo. Si el grupo ya tenía una franja y la
// reservó esta misma persona, se libera la vieja en la misma transacción.
// Estudiantes: una sola reserva por cuenta y curso, y con BOOKING_LEAD_HOURS de
// anticipación. El profesor queda exento de las dos cosas.
export async function bookSlot({ courseId, group, slot, modality, bookerName, user, isTeacher = false }) {
  const slotId = slot.id;
  const bookingId = bookingIdFor(courseId, group.id);
  const bookingRef = doc(agendaDb, 'agendaBookings', bookingId);
  const slotRef = doc(agendaDb, 'agendaSlots', slotId);
  const accountRef = doc(agendaDb, 'agendaAccounts', accountIdFor(courseId, user.uid));

  if (!isTeacher && isClosedSlot(slot)) throw agendaError('too-late');

  await runTransaction(agendaDb, async (tx) => {
    const [slotSnap, bookingSnap, accountSnap] = await Promise.all([
      tx.get(slotRef),
      tx.get(bookingRef),
      isTeacher ? Promise.resolve(null) : tx.get(accountRef),
    ]);
    const previous = bookingSnap.exists() ? bookingSnap.data() : null;
    const account = accountSnap?.exists() ? accountSnap.data() : null;
    if (account && account.bookingId !== bookingId) throw agendaError('account-booked');

    if (slotSnap.exists()) {
      const s = slotSnap.data();
      if (!(s.courseId === courseId && s.groupId === group.id)) throw agendaError('slot-taken');
    }
    if (previous && previous.bookedBy?.uid !== user.uid) throw agendaError('group-booked');

    if (previous && previous.slotId !== slotId) {
      tx.delete(doc(agendaDb, 'agendaSlots', previous.slotId));
    }
    if (!slotSnap.exists()) {
      tx.set(slotRef, {
        slotId,
        courseId,
        groupId: group.id,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    }
    if (!isTeacher && !account) {
      tx.set(accountRef, { uid: user.uid, courseId, bookingId, createdAt: serverTimestamp() });
    }
    tx.set(bookingRef, {
      courseId,
      groupId: group.id,
      groupName: group.name,
      members: group.members,
      slotId,
      modality,
      bookerName,
      bookedBy: {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
      },
      createdAt: previous?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

// Libera la franja de un grupo. Lo puede hacer quien reservó o el profesor. La
// marca de la cuenta se borra con ella: quien liberó puede volver a reservar.
export async function cancelBooking(booking) {
  const bookingRef = doc(agendaDb, 'agendaBookings', bookingIdFor(booking.courseId, booking.groupId));
  await runTransaction(agendaDb, async (tx) => {
    const snap = await tx.get(bookingRef);
    if (!snap.exists()) return;
    const data = snap.data();
    tx.delete(doc(agendaDb, 'agendaSlots', data.slotId));
    tx.delete(bookingRef);
    tx.delete(doc(agendaDb, 'agendaAccounts', accountIdFor(data.courseId, data.bookedBy.uid)));
  });
}
