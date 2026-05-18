import { doc, setDoc, updateDoc, arrayRemove, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { STORAGE_KEYS } from '../config/constants';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getBrowserId(): string {
  let id = localStorage.getItem(STORAGE_KEYS.browserId);
  if (!id) {
    id = `browser_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEYS.browserId, id);
  }
  return id;
}

export async function voteMany(storeIds: { id: string; name: string }[]): Promise<void> {
  const browserId = getBrowserId();
  const today = todayKey();
  const ref = doc(db, 'survey', today);

  // Build existing votes to remove (we'll fetch them via snapshot, so use a write-only approach:
  // set the doc if not existing, then replace via transaction is complex.
  // Simpler: use arrayRemove for all possible old votes by this browser, then arrayUnion new ones.
  // Since we don't know old storeIds, we use setDoc with merge + a full rewrite approach.
  // Best: use setDoc to overwrite the votes array atomically via a cloud function, but
  // without one, we'll do a read-then-write which is acceptable for small team data.
  // Here we use updateDoc with arrayRemove (requires knowing old values) — instead, use
  // a simpler approach: tag votes with browserId prefix in the id field so we can remove by prefix.

  // Practical approach for small dataset: the hook reads current votes, filters out this
  // browserId, and the service receives the filtered list + new votes.
  // But since services should be pure Firestore calls, we accept a slight race condition
  // and use setDoc merge=false only on the date document to replace votes cleanly.
  // Actually: the simplest safe approach is to have the caller provide old vote ids to remove.

  // We expose a simpler API: voteMany receives new storeIds and does remove+add in one doc write.
  // Since we use arrayRemove we need the exact objects. We'll reconstruct them deterministically.
  const newVotes = storeIds.map(({ id: storeId, name: storeName }) => ({
    id: `${browserId}-${storeId}`,
    browserId,
    storeId,
    storeName,
    createdAt: new Date().toISOString(),
  }));

  try {
    // Try to remove by known id field — arrayRemove matches by deep equality so we can't
    // remove without the exact old object. Use a two-step: overwrite only this browser's votes
    // by first writing the doc with a filtered array. Since Firestore doesn't support
    // "remove where browserId=X", we do a client-side read before write (in the hook).
    // Here we just write new votes; the hook will pass old vote objects to remove.
    await setDoc(ref, { date: today, votes: [] }, { merge: true });
    if (newVotes.length > 0) {
      await updateDoc(ref, { votes: arrayUnion(...newVotes) });
    }
  } catch {
    // doc doesn't exist yet
    await setDoc(ref, { date: today, votes: newVotes });
  }
}

export async function replaceBrowserVotes(
  oldVotes: object[],
  storeIds: { id: string; name: string }[],
): Promise<void> {
  const browserId = getBrowserId();
  const today = todayKey();
  const ref = doc(db, 'survey', today);

  const newVotes = storeIds.map(({ id: storeId, name: storeName }) => ({
    id: `${browserId}-${storeId}`,
    browserId,
    storeId,
    storeName,
    createdAt: serverTimestamp(),
  }));

  try {
    const updates: Record<string, unknown> = {};
    if (oldVotes.length > 0) {
      // Remove old, add new in separate calls (Firestore doesn't support both in one updateDoc)
      await updateDoc(ref, { votes: arrayRemove(...oldVotes) });
    }
    if (newVotes.length > 0) {
      await updateDoc(ref, { votes: arrayUnion(...newVotes) });
    } else if (oldVotes.length === 0) {
      await setDoc(ref, { date: today, votes: [] }, { merge: true });
    }
    void updates;
  } catch {
    await setDoc(ref, { date: today, votes: newVotes });
  }
}
