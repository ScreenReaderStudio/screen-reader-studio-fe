import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useResultStore = create(
  persist(
    (set) => ({
      result: { script: [] },

      setResult: (result) => set({ result }),
    }),
    {
      name: 'result-storage',
    }
  )
);
