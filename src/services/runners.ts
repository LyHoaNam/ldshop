import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = () => collection(db, 'runners');

export async function addRunner(name: string, avatarUrl: string): Promise<void> {
  await addDoc(col(), { name, avatarUrl, wins: 0, createdAt: serverTimestamp() });
}

export async function deleteRunner(id: string): Promise<void> {
  await deleteDoc(doc(db, 'runners', id));
}

export async function incrementRunnerWins(id: string): Promise<void> {
  await updateDoc(doc(db, 'runners', id), { wins: increment(1) });
}
