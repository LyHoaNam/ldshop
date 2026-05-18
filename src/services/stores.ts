import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = () => collection(db, 'stores');

export async function addStore(name: string, emoji: string, tags: string[]): Promise<void> {
  await addDoc(col(), { name, emoji, tags, wins: 0, createdAt: serverTimestamp() });
}

export async function deleteStore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'stores', id));
}

export async function incrementStoreWins(id: string): Promise<void> {
  await updateDoc(doc(db, 'stores', id), { wins: increment(1) });
}
