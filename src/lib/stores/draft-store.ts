import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Draft } from '../types';

interface DraftState {
  drafts: Record<string, Draft>;
  saveDraft: (grantId: string, content: string) => void;
  getDraft: (grantId: string) => Draft | undefined;
  deleteDraft: (grantId: string) => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      saveDraft: (grantId, content) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [grantId]: {
              id: `draft-${grantId}`,
              grantId,
              content,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
      getDraft: (grantId) => get().drafts[grantId],
      deleteDraft: (grantId) =>
        set((state) => {
          const { [grantId]: deleted, ...rest } = state.drafts;
          return { drafts: rest };
        }),
    }),
    {
      name: 'capitalcupid-drafts',
    }
  )
);