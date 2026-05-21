import { doc, updateDoc, setDoc, deleteField, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Cast or update a vote.
 * Single-vote mode: key = runnerId (overwrites previous vote for that runner).
 * Multi-vote mode:  key = runnerId_storeId (one entry per runner-store pair).
 */
export async function castRunnerVote(
  runnerId: string,
  runnerName: string,
  runnerAvatar: string,
  storeId: string,
  storeName: string,
  storeEmoji: string,
  multiVote = false,
): Promise<void> {
  const key = multiVote ? `${runnerId}_${storeId}` : runnerId;
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
    await updateDoc(ref, { [`votes.${key}`]: vote });
  } catch {
    await setDoc(ref, { date: todayKey(), votes: { [key]: vote } });
  }
}

/** Remove a single store vote in multi-vote mode. */
export async function removeRunnerVote(runnerId: string, storeId: string): Promise<void> {
  const key = `${runnerId}_${storeId}`;
  const ref = doc(db, 'storeVotes', todayKey());
  await updateDoc(ref, { [`votes.${key}`]: deleteField() });
}
