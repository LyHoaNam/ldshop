import {
  collection, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = () => collection(db, 'storeRequests');

export async function addRequest(
  name: string, emoji: string, tags: string[], note: string,
): Promise<string> {
  const ref = await addDoc(col(), {
    name, emoji, tags, note,
    status: 'pending',
    createdAt: serverTimestamp(),
    resolvedAt: null,
  });
  return ref.id;
}

export async function approveRequest(id: string): Promise<void> {
  await updateDoc(doc(db, 'storeRequests', id), {
    status: 'approved',
    resolvedAt: serverTimestamp(),
  });
}

export async function rejectRequest(id: string): Promise<void> {
  await updateDoc(doc(db, 'storeRequests', id), {
    status: 'rejected',
    resolvedAt: serverTimestamp(),
  });
}
