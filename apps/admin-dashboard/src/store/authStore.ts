import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, email: string) => void;
  logout: () => void;
}

/** Zustand store for the admin session token, persisted to localStorage. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      setSession: (token, email) => set({ token, email, isAuthenticated: true }),
      logout: () => set({ token: null, email: null, isAuthenticated: false }),
    }),
    { name: 'red-giant-admin-auth' }
  )
);
