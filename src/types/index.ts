import type { Timestamp } from 'firebase/firestore';

export interface Runner {
  id: string;
  name: string;
  avatar: string;
  wins: number;
  createdAt: Timestamp;
}

export interface Store {
  id: string;
  name: string;
  emoji: string;
  avatar: string;
  tags: string[];
  wins: number;
  createdAt: Timestamp;
}

export interface DailyPickupPerson {
  id: string;
  name: string;
  avatar: string;
  setAt: Timestamp;
}

export interface DailySelectedStore {
  id: string;
  name: string;
  emoji: string;
  avatar: string;
  setAt: Timestamp;
}

export interface DailyState {
  date: string;
  orderLink: string;
  pickupPerson: DailyPickupPerson | null;
  selectedStore: DailySelectedStore | null;
  lastResetAt: Timestamp | null;
  voteModeEnabled: boolean;
  voteStatus: 'open' | 'closed';
  voteWinnerStore: DailySelectedStore | null;
  allowMultipleVotes: boolean;
}

export interface StoreVoteEntry {
  runnerId: string;
  runnerName: string;
  runnerAvatar: string;
  storeId: string;
  storeName: string;
  storeEmoji: string;
  createdAt: Timestamp | null;
}

export interface StoreRequest {
  id: string;
  name: string;
  emoji: string;
  tags: string[];
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  resolvedAt: Timestamp | null;
}

export interface AppSettings {
  race: {
    baseSpeed: number;
    speedVariation: number;
    animationSpeed: number;
  };
  confetti: {
    count: number;
    duration: number;
  };
}

export type RaceMode = 'people' | 'stores';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  emoji?: string;
}
