// src/agenda/agendaFirebase.js
//
// Conexión al proyecto que hospeda la agenda común (AGENDA_FIREBASE_CONFIG).
//
// Si el curso ya usa ese mismo proyecto (Computación en Internet II), se reutiliza
// su app de Firebase: la sesión del visor sirve para la agenda y nadie inicia
// sesión dos veces. En los otros cursos se abre una segunda app con nombre
// propio, con su propia sesión de Google. Así Seminario, que no tiene inicio de
// sesión, también puede reservar y cancelar.

import { getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app as courseApp } from '@/auth/firebase';
import { AGENDA_FIREBASE_CONFIG } from './agendaConfig';

const AGENDA_APP_NAME = 'agenda';

const sharesCourseProject =
  courseApp?.options?.projectId === AGENDA_FIREBASE_CONFIG.projectId;

const agendaApp = sharesCourseProject
  ? courseApp
  : getApps().find((a) => a.name === AGENDA_APP_NAME) ??
    initializeApp(AGENDA_FIREBASE_CONFIG, AGENDA_APP_NAME);

export const agendaAuth = getAuth(agendaApp);
export const agendaDb = getFirestore(agendaApp);
export const agendaGoogleProvider = new GoogleAuthProvider();
agendaGoogleProvider.setCustomParameters({ prompt: 'select_account' });

export const agendaSharesCourseSession = sharesCourseProject;
