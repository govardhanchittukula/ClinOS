// src/components/withViewportAnimation.tsx

import React, { useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useAnime } from '../hooks/useAnime';
import { staggerFadeIn } from '../utils/animation';

/**
 * Higher‑order component that animates its children when they enter the viewport.
 * It applies a staggered fade‑in + translateY animation.
 */
const withViewportAnimation = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const AnimatedComponent: React.FC<P> = (props) => {
    const setRef = useIntersectionObserver((inView) => {
      if (inView) {
        // Trigger animation when element becomes visible
        const anim = staggerFadeIn('.animated-item', {});
        // Clean up handled inside useAnime if needed – here we rely on the library auto‑cleanup.
        // Since we use a static class selector, ensure elements have class "animated-item".
      }
    });

    // Attach the ref to a wrapper div
    return (
      <div ref={setRef as any}>
        <Component {...props} />
      </div>
    );
  };
  return AnimatedComponent;
};

export default withViewportAnimation;
