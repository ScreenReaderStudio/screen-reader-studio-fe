import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCodeStore = create(
  persist(
    (set) => ({
      code: '',

      setCode: (code) => set({ code }),
    }),
    {
      name: 'code-storage',
    }
  )
);
