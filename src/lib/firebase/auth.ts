import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';

import { auth } from './config';

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return fbSignOut(auth);
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Firebase Auth is email-based; the app logs in with a casillero number
 * (per the cotizacion), so each casillero maps to a synthetic, never-shown
 * email under a reserved domain. The user's real email is stored separately
 * in their profile and used for password-reset messages and support.
 */
export function casilleroToEmail(casillero: string) {
  return `${casillero.trim().toLowerCase()}@casillero.lockr.app`;
}

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
