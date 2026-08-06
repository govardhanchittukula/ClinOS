// src/hooks/useAnime.ts

import { useEffect, useRef } from 'react';
import anime, { AnimeInstance, AnimeParams } from 'animejs';
import { killAnime } from '../utils/animation';

/**
 * Hook that returns a ref callback which, when attached to a DOM element,
 * creates an anime.js animation based on the supplied params.
 *
 * The animation instance is automatically cleaned up on unmount.
 * It respects the prefers‑reduced‑motion media query – callers should
 * check `window.matchMedia('(prefers-reduced-motion: reduce)')` before
 * invoking heavy animations.
 */
export const useAnime = (
  paramsFactory: (target: HTMLElement) => AnimeParams,
  deps: any[] = []
) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<AnimeInstance | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    // Create animation using the provided factory
    const params = paramsFactory(el);
    animationRef.current = anime(params as AnimeParams);
    return () => {
      killAnime(animationRef.current ?? undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Return a function that can be used as a ref callback
  const setRef = (node: HTMLElement | null) => {
    elementRef.current = node;
  };

  return setRef;
};
