import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';

const useStore = create(
  persist(
    (set, get) => ({
      ...createAuthSlice(set, get),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useStore;
