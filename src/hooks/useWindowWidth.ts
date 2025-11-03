'use client';

import { useState, useEffect } from 'react';

interface UseWindowWidthReturn {
  width: number;
  hydrated: boolean;
}

function useWindowWidth(): UseWindowWidthReturn {
  const [width, setWidth] = useState<number>(0);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Set initial width and mark as hydrated (client-side only)
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      setHydrated(true);

      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { width, hydrated };
}

export default useWindowWidth;


