// src/auth/firebase.js
//
// Lazily initializes the Firebase app only when a real config is present
// (see firebaseConfig.js). When it's left as the REPLACE_* placeholder,
// every export is null and the auth gate stays disabled — so the app builds
// and runs without any Firebase project wired up.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  // Always let the user pick which Google account to use.
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export { app, auth, db, googleProvider };
