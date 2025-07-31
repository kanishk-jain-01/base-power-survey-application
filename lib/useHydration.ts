import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration mismatches with persisted stores
 * Returns true only after component has mounted (client-side)
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
