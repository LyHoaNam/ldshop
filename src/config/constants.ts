import type { AppSettings } from '../types';

export const AVATAR_EMOJIS = [
  '🍚', '🍜', '🍝', '🍛', '🍲', '🥘', '🥗', '🍱', '🥡', '🍣',
  '🍔', '🌮', '🌯', '🥙', '🧆', '🍿', '🥐', '🥖', '🥞', '🧇',
  '🍕', '🥪', '🥚', '🍳', '🧈', '🥓', '🌭', '🍟', '🍗', '🍖',
];

export const STORE_EMOJIS = [
  '🍚', '🍜', '🍝', '🍛', '🍲', '🥘', '🥗', '🍱', '🥡', '🍣',
  '🍔', '🌮', '🌯', '🥙', '🧆', '🍿', '🥐', '🥖', '🍕', '🥪',
  '🍗', '🍖', '🍤', '🥩', '🌶️', '🧄', '🧅', '🫕', '🫔', '🫙',
];

export const DEFAULT_SETTINGS: AppSettings = {
  race: {
    baseSpeed: 2,
    speedVariation: 3,
    animationSpeed: 50,
  },
  confetti: {
    count: 100,
    duration: 3000,
  },
};

export const CONFETTI_COLORS = [
  '#DA251D', '#FFCD00', '#FF6B35', '#4CAF50', '#2196F3',
  '#9C27B0', '#FF9800', '#00BCD4', '#E91E63', '#8BC34A',
];

export const MIN_RACERS = 2;
export const MAX_RACERS = 8;

export const STORAGE_KEYS = {
  browserId: 'ldshop_browser_id',
  myRequests: 'ldshop_my_requests',
};

export const ADMIN_SESSION_KEY = 'ldshop_admin_session';
