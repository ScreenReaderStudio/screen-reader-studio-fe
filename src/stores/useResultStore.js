import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useResultStore = create(
  persist(
    (set) => ({
      result: { script: [] },
      selectedTab: 'script',

      setResult: (result) => set({ result }),
      setSelectedTab: (tab) => set({ selectedTab: tab }),
    }),
    {
      name: 'result-storage',
    }
  )
);
