import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Grant, SwipeDecision } from '../types';

interface DeckState {
  grants: Grant[];
  currentIndex: number;
  decisions: SwipeDecision[];
  shortlistIds: string[];
  setGrants: (grants: Grant[]) => void;
  nextCard: () => void;
  addDecision: (decision: SwipeDecision) => void;
  addToShortlist: (grantId: string) => void;
  removeFromShortlist: (grantId: string) => void;
  resetDeck: () => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      grants: [],
      currentIndex: 0,
      decisions: [],
      shortlistIds: [],
      setGrants: (grants) => set({ grants, currentIndex: 0 }),
      nextCard: () =>
        set((state) => ({
          currentIndex: Math.min(state.currentIndex + 1, state.grants.length),
        })),
      addDecision: (decision) =>
        set((state) => ({
          decisions: [...state.decisions, decision],
        })),
      addToShortlist: (grantId) =>
        set((state) => ({
          shortlistIds: [...new Set([...state.shortlistIds, grantId])],
        })),
      removeFromShortlist: (grantId) =>
        set((state) => ({
          shortlistIds: state.shortlistIds.filter((id) => id !== grantId),
        })),
      resetDeck: () =>
        set({
          grants: [],
          currentIndex: 0,
          decisions: [],
          shortlistIds: [],
        }),
    }),
    {
      name: 'capitalcupid-deck',
    }
  )
);