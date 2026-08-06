// src/components/PageTransition.tsx

import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import anime from 'animejs';
import { killAnime } from '../utils/animation';

interface PageTransitionProps {
  children?: React.ReactNode;
}

/**
 * Wraps route content and provides a fade + slide‑up transition on navigation.
 * Respects prefers‑reduced‑motion.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = document.getElementById('page-transition-container');
    if (!container) return;
    const anim = anime({
      targets: container,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 450,
      easing: 'easeOutQuad',
    });
    return () => killAnime(anim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <div id="page-transition-container" className="relative min-h-screen">
      {children || <Outlet />}
    </div>
  );
};

export default PageTransition;

