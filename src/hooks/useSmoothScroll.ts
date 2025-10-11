import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    e.preventDefault();
    scrollToElement(elementId);
  }, [scrollToElement]);

  return {
    scrollToElement,
    handleSmoothScroll
  };
};

export default useSmoothScroll; 