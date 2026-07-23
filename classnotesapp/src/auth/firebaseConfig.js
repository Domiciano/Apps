// src/auth/firebaseConfig.js
//
// Per-course Firebase web-app config. This is PUBLIC information, not a secret:
// the apiKey is just a project identifier. Real security is enforced by
// Firestore security rules + the "Authorized domains" list in the Firebase
// console (Authentication → Settings). So it is safe to commit these values.
//
// Curso: Aplicaciones Móviles — proyecto Firebase "facelogprueba".

export const firebaseConfig = {
  apiKey: 'AIzaSyAKjGpzI_x_wlONFdf_qKYNT3QyFW8PlnA',
  authDomain: 'facelogprueba.firebaseapp.com',
  databaseURL: 'https://facelogprueba.firebaseio.com',
  projectId: 'facelogprueba',
  storageBucket: 'facelogprueba.appspot.com',
  messagingSenderId: '612300733454',
  appId: '1:612300733454:web:4eb26ff9e113fc0bf9505f',
  measurementId: 'G-0JEJMW08Q0',
};

// Short identifier for this course, saved on every student record.
export const courseId = 'moviles';

// The gate is active only once a real apiKey is present.
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 0 &&
  !firebaseConfig.apiKey.startsWith('REPLACE');
