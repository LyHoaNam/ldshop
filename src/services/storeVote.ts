import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export async function castRunnerVote(
  runnerId: string,
  runnerName: string,
  runnerAvatar: string,
  storeId: string,
  storeName: string,
  storeEmoji: string,
): Promise<void> {
  const ref = doc(db, 'storeVotes', todayKey());
  const vote = {
    runnerId,
    runnerName,
    runnerAvatar,
    storeId,
    storeName,
    storeEmoji,
    createdAt: serverTimestamp(),
  };
  try {
    await updateDoc(ref, { [`votes.${runnerId}`]: vote });
  } catch {
    await setDoc(ref, { date: todayKey(), votes: { [runnerId]: vote } });
  }
}
