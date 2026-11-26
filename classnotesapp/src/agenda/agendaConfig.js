// src/agenda/agendaConfig.js
//
// Agenda común de los tres cursos (Móviles, Computación en Internet II y
// Seminario). Este archivo es IDÉNTICO en los tres repos: las franjas y el
// proyecto Firebase que las guarda son uno solo, y eso es lo que impide que dos
// cursos reserven la misma media hora.
//
// Para cambiar los horarios se edita AGENDA_WINDOWS aquí y se copia el archivo
// literal a los otros dos repos. Las horas son de Colombia (UTC−5).

// Proyecto que hospeda la agenda: el de Computación en Internet II, donde el
// profesor ya tiene el claim `profesor: true`. Es configuración pública (ver
// src/auth/firebaseConfig.js): la seguridad la ponen las reglas de Firestore.
export const AGENDA_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCMxEq4Gkd0WSdoSMVtEHYqxGbl9NNyDxI',
  authDomain: 'computacion-fcc47.firebaseapp.com',
  projectId: 'computacion-fcc47',
  storageBucket: 'computacion-fcc47.firebasestorage.app',
  messagingSenderId: '623207781442',
  appId: '1:623207781442:web:e6dd0e8661f94e9eb089db',
};

export const AGENDA_TITLE = 'Agenda de presentaciones';

export const SLOT_MINUTES = 30;

// Una franja solo se reserva (o se pasa a ella) con al menos esta anticipación.
// Las reglas de Firestore exigen lo mismo; el profesor queda exento.
export const BOOKING_LEAD_HOURS = 24;

export const TIMEZONE_OFFSET = '-05:00';

// Cada ventana se parte en franjas de SLOT_MINUTES. Todas admiten las dos
// modalidades; si alguna no, se le añade `modalities: ['presencial']`.
export const AGENDA_WINDOWS = [
  { date: '2026-11-25', start: '14:00', end: '16:00' },
  { date: '2026-11-26', start: '09:00', end: '12:00' },
  { date: '2026-11-27', start: '14:00', end: '16:00' },
  { date: '2026-11-30', start: '09:00', end: '12:00' },
  { date: '2026-11-30', start: '14:00', end: '18:00' },
  { date: '2026-12-01', start: '14:00', end: '16:00' },
  { date: '2026-12-02', start: '10:00', end: '12:00' },
  { date: '2026-12-02', start: '14:00', end: '16:00' },
];

// Semanas del semestre que se marcan en el calendario (número grande a la
// izquierda). `start` es el lunes; la marca cubre de lunes a viernes.
export const AGENDA_WEEKS = [
  { number: 17, start: '2026-11-23' },
  { number: 18, start: '2026-11-30' },
];

export const MODALITIES = [
  { id: 'presencial', label: 'Presencial' },
  { id: 'virtual', label: 'Virtual' },
];

// courseId → nombre visible. El courseId es el de src/auth/firebaseConfig.js.
export const AGENDA_COURSES = {
  moviles: 'Aplicaciones Móviles',
  compunet2: 'Computación en Internet II',
  seminario: 'Seminario de Ingeniería de Software',
};
