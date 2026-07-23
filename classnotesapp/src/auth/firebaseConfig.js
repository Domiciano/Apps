// src/auth/firebaseConfig.js
//
// Per-course Firebase web-app config. This is PUBLIC information, not a secret:
// the apiKey is just a project identifier. Real security is enforced by
// Firestore security rules + the "Authorized domains" list in the Firebase
// console (Authentication → Settings). So it is safe to commit these values.
//
// FOUNDING A COURSE (one Firebase project PER course — see docs/AUTH_SETUP.md):
//   1. Firebase console → create a project → add a Web app → copy its config
//      object and paste it below (replace every REPLACE_* value).
//   2. Set `courseId` to a short slug for this course (stored on each student
//      record so a shared analytics pipeline can tell courses apart).
//
// While the values are left as REPLACE_* the auth gate stays DISABLED and the
// app renders normally — handy for the template and for local development.

export const firebaseConfig = {
  apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
  authDomain: 'REPLACE_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_PROJECT',
  storageBucket: 'REPLACE_PROJECT.appspot.com',
  messagingSenderId: 'REPLACE_SENDER_ID',
  appId: 'REPLACE_APP_ID',
};

// Short identifier for this course, saved on every student record.
export const courseId = 'moviles';

// The gate is active only once a real apiKey is present.
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 0 &&
  !firebaseConfig.apiKey.startsWith('REPLACE');
