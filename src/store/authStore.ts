import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mock session. The "Continue with Messages" flow stores a local session;
 * real Supabase Auth + backend code-verification swap in here later.
 */
export interface Session {
  userId: string;
  handle: string; // phone or apple id or "demo"
  demo: boolean;
}

interface AuthState {
  session: Session | null;
  hydrated: boolean;
  // Pending mock verification code, set when "Continue with Messages" starts.
  pendingCode: string | null;

  startVerification: (code: string) => void;
  completeSignIn: (handle: string) => void;
  signInDemo: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      pendingCode: null,

      startVerification: (code) => set({ pendingCode: code }),
      completeSignIn: (handle) =>
        set({
          session: { userId: `user_${Date.now().toString(36)}`, handle, demo: false },
          pendingCode: null,
        }),
      signInDemo: () =>
        set({ session: { userId: 'user_demo', handle: 'demo', demo: true } }),
      signOut: () => set({ session: null, pendingCode: null }),
    }),
    {
      name: 'agentic-auth-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ session }) => ({ session }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hydrated: true });
      },
    },
  ),
);
