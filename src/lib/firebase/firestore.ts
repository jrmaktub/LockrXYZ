import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';

import { db } from './config';

/** Read a single document by id from a collection. */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

/** Read all documents from a collection, with optional query constraints. */
export async function getCollection<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

/** Create a document with an auto-generated id. */
export function createDocument(collectionName: string, data: DocumentData) {
  return addDoc(collection(db, collectionName), data);
}

/** Create or overwrite a document at a known id. */
export function setDocument(collectionName: string, id: string, data: DocumentData) {
  return setDoc(doc(db, collectionName, id), data);
}

/** Partially update an existing document. */
export function updateDocument(collectionName: string, id: string, data: Partial<DocumentData>) {
  return updateDoc(doc(db, collectionName, id), data);
}

/** Delete a document by id. */
export function deleteDocument(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
}

/** Subscribe to realtime updates on a collection. Returns an unsubscribe function. */
export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  callback: (items: T[]) => void,
  ...constraints: QueryConstraint[]
) {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
  });
}
