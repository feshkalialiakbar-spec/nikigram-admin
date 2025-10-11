import { useState, useEffect, useRef } from 'react';

interface UseSkeletonLoadingOptions {
  isLoading: boolean;
  minDisplayTime?: number; // Minimum time to show skeleton in milliseconds
}

export const useSkeletonLoading = ({ 
  isLoading, 
  minDisplayTime = 500 
}: UseSkeletonLoadingOptions) => {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Start loading
      setShowSkeleton(true);
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current !== null) {
      // Loading finished, check minimum display time
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setShowSkeleton(false);
          startTimeRef.current = null;
        }, remainingTime);
        
        return () => clearTimeout(timer);
      } else {
        setShowSkeleton(false);
        startTimeRef.current = null;
      }
    }
  }, [isLoading, minDisplayTime]);

  return showSkeleton;
};
