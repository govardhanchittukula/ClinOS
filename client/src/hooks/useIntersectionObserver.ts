// src/hooks/useIntersectionObserver.ts

import { useEffect, useRef } from 'react';

/**
 * Hook that triggers a callback when the element enters the viewport.
 * It uses the IntersectionObserver API and disconnects on unmount.
 * The callback receives a boolean `inView` indicating visibility.
 */
export const useIntersectionObserver = (
  callback: (inView: boolean) => void,
  options?: IntersectionObserverInit
) => {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry.isIntersecting);
      });
    }, options);
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return a ref callback for the target element
  const setRef = (node: HTMLElement | null) => {
    elementRef.current = node;
  };
  return setRef;
};
