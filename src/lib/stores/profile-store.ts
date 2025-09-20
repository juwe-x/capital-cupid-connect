import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SMEProfile } from '../types';

interface ProfileState {
  profile: SMEProfile;
  setProfile: (profile: Partial<SMEProfile>) => void;
  resetProfile: () => void;
  updateStep: (step: Partial<SMEProfile>) => void;
}

const initialProfile: SMEProfile = {
  industry: '',
  location: '',
  teamSizeBracket: '1-10',
  needs: [],
  years: 0,
  isComplete: false,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: initialProfile,
      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      resetProfile: () => set({ profile: initialProfile }),
      updateStep: (step) =>
        set((state) => ({
          profile: { ...state.profile, ...step },
        })),
    }),
    {
      name: 'capitalcupid-profile',
    }
  )
);