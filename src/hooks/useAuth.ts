// Thin auth wrapper over the AppStore (src/services/store.tsx).
// Screens use useAuth() for the signed-in user and auth actions;
// the store owns the registry, approval, and session state.

import { useApp } from '../services/store';
import type { AppUser } from '../types/models';

export function useAuth(): {
  user: AppUser | null;
  signIn: (username: string, password: string) => { ok: boolean; error?: string; user?: AppUser };
  signOut: () => void;
} {
  const { currentUser, signIn, signOut } = useApp();
  return { user: currentUser, signIn, signOut };
}
