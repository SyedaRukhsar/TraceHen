// Thin toast wrapper over the AppStore (src/services/store.tsx).

import { useApp } from '../services/store';

export function useToast(): {
  toast: string | null;
  showToast: (msg: string) => void;
} {
  const { toast, showToast } = useApp();
  return { toast, showToast };
}
