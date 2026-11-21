// Small role helpers built on useAuth.

import type { Role } from '../types/models';
import { useAuth } from './useAuth';

/** Current signed-in role, or null when signed out. */
export function useRole(): Role | null {
  const { user } = useAuth();
  return user ? user.role : null;
}

export function useIsRole(role: Role): boolean {
  return useRole() === role;
}
