/**
 * Per-user Firestore repository. Every collection here lives under
 * `users/{uid}/...` so Firestore security rules can grant access with a
 * single `request.auth.uid == uid` check (see /firestore.rules).
 */
import { doc, orderBy, runTransaction, type QueryConstraint } from 'firebase/firestore';

import type { Address, Guia, Invoice, Notif, Payment, UserProfile } from '@/types';

import { db } from './config';
import {
  createDocument,
  getCollection,
  getDocument,
  setDocument,
  subscribeToCollection,
  updateDocument,
} from './firestore';

const usersCol = 'users';
const sub = (uid: string, name: string) => `${usersCol}/${uid}/${name}`;

/* ---------- profile ---------- */

export function getUserProfile(uid: string) {
  return getDocument<UserProfile>(usersCol, uid);
}

/** Admin only (see firestore.rules `isAdmin()`) — lists every client casillero. */
export function listAllUsers() {
  return getCollection<UserProfile>(usersCol);
}

export function createUserProfile(uid: string, profile: Omit<UserProfile, 'id'>) {
  return setDocument(usersCol, uid, profile);
}

/**
 * Casillero numbers must be unique across all users. `casilleros/{number}`
 * is a reservation collection (number -> uid); claiming a slot is a
 * transaction so two sign-ups racing for the same generated number can't
 * both succeed.
 */
function randomCasillero() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `LK${n}`;
}

/**
 * Claims a casillero number before the Firebase Auth user exists (the auth
 * user's synthetic email is derived FROM the casillero, so the number has
 * to be decided first). Call `finalizeCasillero` right after sign-up
 * succeeds to record the real uid on the same reservation doc.
 */
export async function reserveNewCasillero(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = randomCasillero();
    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, 'casilleros', candidate);
        const snap = await tx.get(ref);
        if (snap.exists()) throw new Error('taken');
        tx.set(ref, { uid: null, reservedAt: Date.now() });
      });
      return candidate;
    } catch {
      // collision — try another candidate
    }
  }
  throw new Error('No se pudo asignar un numero de casillero, intenta de nuevo.');
}

export function finalizeCasillero(casillero: string, uid: string) {
  return setDocument('casilleros', casillero, { uid });
}

export function updateUserProfile(uid: string, patch: Partial<UserProfile>) {
  return updateDocument(usersCol, uid, patch);
}

/* ---------- guias (paquetes) ---------- */

export function getGuias(uid: string, ...constraints: QueryConstraint[]) {
  return getCollection<Guia>(sub(uid, 'guias'), orderBy('createdAt', 'desc'), ...constraints);
}

export function subscribeGuias(uid: string, cb: (guias: Guia[]) => void) {
  return subscribeToCollection<Guia>(sub(uid, 'guias'), cb, orderBy('createdAt', 'desc'));
}

export function getGuia(uid: string, guiaId: string) {
  return getDocument<Guia>(sub(uid, 'guias'), guiaId);
}

export function createGuia(uid: string, guia: Omit<Guia, 'id'>) {
  return createDocument(sub(uid, 'guias'), guia);
}

export function updateGuia(uid: string, guiaId: string, patch: Partial<Guia>) {
  return updateDocument(sub(uid, 'guias'), guiaId, patch);
}

/* ---------- notifs ---------- */

export function getNotifs(uid: string) {
  return getCollection<Notif>(sub(uid, 'notifs'), orderBy('createdAt', 'desc'));
}

export function subscribeNotifs(uid: string, cb: (notifs: Notif[]) => void) {
  return subscribeToCollection<Notif>(sub(uid, 'notifs'), cb, orderBy('createdAt', 'desc'));
}

export function markNotifRead(uid: string, notifId: string) {
  return updateDocument(sub(uid, 'notifs'), notifId, { unread: false });
}

/* ---------- addresses ---------- */

export function getAddresses(uid: string) {
  return getCollection<Address>(sub(uid, 'addresses'));
}

/* ---------- payments ---------- */

export function getPayments(uid: string) {
  return getCollection<Payment>(sub(uid, 'payments'));
}

/* ---------- invoices ---------- */

export function getInvoices(uid: string) {
  return getCollection<Invoice>(sub(uid, 'invoices'), orderBy('date', 'desc'));
}
