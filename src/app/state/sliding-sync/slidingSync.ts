import { atom } from 'jotai';
import { SlidingSync } from 'matrix-js-sdk/lib/sliding-sync';

// Sliding sync instance atom
export const slidingSyncAtom = atom<SlidingSync | null>(null);

// Sliding sync state atom
export const slidingSyncStateAtom = atom<'PREPARED' | 'SYNCING' | 'STOPPED' | 'ERROR'>('STOPPED');

// Sliding sync enabled atom
export const slidingSyncEnabledAtom = atom<boolean>(false);

// Room list data from sliding sync
export const slidingSyncRoomListAtom = atom<Record<string, string[]>>({});

// Room data from sliding sync  
export const slidingSyncRoomDataAtom = atom<Record<string, any>>({});

// Error state for sliding sync
export const slidingSyncErrorAtom = atom<Error | null>(null);