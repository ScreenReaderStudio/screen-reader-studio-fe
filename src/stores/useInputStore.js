import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInputStore = create(
  persist(
    (set) => ({
      code: '',
      url: '',

      setCode: (code) => set({ code }),
      setUrl: (url) => set({ url }),
    }),
    {
      name: 'input-storage',
    }
  )
);
