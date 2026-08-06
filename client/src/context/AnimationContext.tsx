// src/context/AnimationContext.tsx

import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface AnimationContextProps {
  reducedMotion: boolean;
}

export const AnimationContext = createContext<AnimationContextProps>({
  reducedMotion: false,
});

interface ProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<ProviderProps> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      // Safari fallback
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  return (
    <AnimationContext.Provider value={{ reducedMotion }}>
      {children}
    </AnimationContext.Provider>
  );
};
