import { useState, useEffect } from 'react';

interface UseScrollShadowOptions {
  threshold?: number;
  throttleDelay?: number;
}

export const useScrollShadow = (options: UseScrollShadowOptions = {}) => {
  const { threshold = 10, throttleDelay = 16 } = options;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrolled = window.scrollY > threshold;
        setIsScrolled(scrolled);
      }, throttleDelay);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold, throttleDelay]);

  return isScrolled;
};
