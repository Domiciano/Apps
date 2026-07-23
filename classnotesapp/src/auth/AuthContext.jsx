// src/auth/AuthContext.jsx
//
// Owns the whole auth lifecycle: Google sign-in, the student profile
// (full name + GitHub) stored in Firestore, and the derived `status` the
// AuthGate switches on. When Firebase isn't configured the provider is a
// no-op that reports `status: 'ready'`, so the app renders ungated.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { isFirebaseConfigured, courseId } from './firebaseConfig';

const AuthContext = createContext(null);

// status: 'loading' | 'signed-out' | 'need-profile' | 'ready'
const isProfileComplete = (profile) =>
  !!profile && !!profile.fullName?.trim() && !!profile.github?.trim();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // If Firebase isn't set up, skip straight to 'ready' (ungated app).
  const [status, setStatus] = useState(isFirebaseConfigured ? 'loading' : 'ready');
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthError(null);
      if (!fbUser) {
        setUser(null);
        setProfile(null);
        setStatus('signed-out');
        return;
      }
      setUser(fbUser);
      setStatus('loading');
      try {
        const snap = await getDoc(doc(db, 'students', fbUser.uid));
        const data = snap.exists() ? snap.data() : null;
        setProfile(data);
        setStatus(isProfileComplete(data) ? 'ready' : 'need-profile');
      } catch (err) {
        console.error('[Auth] Error leyendo el perfil del estudiante:', err);
        // Don't lock the user out on a read error — let them fill the form.
        setProfile(null);
        setStatus('need-profile');
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return; // user just closed the popup — not an error worth showing
      }
      console.error('[Auth] Error en el inicio de sesión con Google:', err);
      setAuthError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
    }
  }, []);

  const saveProfile = useCallback(
    async ({ fullName, github }) => {
      if (!isFirebaseConfigured || !user) return;
      const record = {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        fullName: fullName.trim(),
        github: github.trim(),
        courseId,
        updatedAt: serverTimestamp(),
      };
      const ref = doc(db, 'students', user.uid);
      const existing = await getDoc(ref);
      if (!existing.exists()) record.createdAt = serverTimestamp();
      await setDoc(ref, record, { merge: true });
      setProfile((prev) => ({ ...prev, ...record }));
      setStatus('ready');
    },
    [user]
  );

  const signOutUser = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    await signOut(auth);
  }, []);

  const value = {
    configured: isFirebaseConfigured,
    status,
    user,
    profile,
    authError,
    signInWithGoogle,
    saveProfile,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
