import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { DailyPickupPerson, DailySelectedStore } from '../types';

const dailyRef = () => doc(db, 'app', 'dailyState');

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export async function resetToday(): Promise<void> {
  await setDoc(dailyRef(), {
    date: todayKey(),
    orderLink: '',
    pickupPerson: null,
    selectedStore: null,
    lastResetAt: serverTimestamp(),
    voteModeEnabled: false,
    voteStatus: 'open',
    voteWinnerStore: null,
  });
}

export async function setVoteMode(enabled: boolean): Promise<void> {
  await updateDoc(dailyRef(), {
    voteModeEnabled: enabled,
    voteStatus: 'open',
    voteWinnerStore: null,
  });
}

export async function closeVotingWithWinner(winner: DailySelectedStore): Promise<void> {
  await updateDoc(dailyRef(), {
    voteStatus: 'closed',
    voteWinnerStore: winner,
  });
}

export async function publishVoteWinner(winner: DailySelectedStore, link: string): Promise<void> {
  await updateDoc(dailyRef(), {
    selectedStore: winner,
    orderLink: link,
  });
}

export async function setOrderLink(link: string): Promise<void> {
  await updateDoc(dailyRef(), { orderLink: link });
}

export async function setPickupPerson(person: DailyPickupPerson): Promise<void> {
  await updateDoc(dailyRef(), { pickupPerson: person });
}

export async function setSelectedStore(store: DailySelectedStore): Promise<void> {
  await updateDoc(dailyRef(), { selectedStore: store });
}
