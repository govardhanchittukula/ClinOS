// src/utils/animation.ts

import anime, { AnimeParams, AnimeInstance } from 'animejs';

/**
 * Create a simple fade‑in animation.
 */
export const fadeIn = (
  targets: any,
  {
    duration = 450,
    delay = 0,
    easing = 'easeOutQuad',
  }: Partial<AnimeParams> = {}
): AnimeInstance =>
  anime({
    targets,
    opacity: [0, 1],
    translateY: [30, 0],
    duration,
    delay,
    easing,
  });

/**
 * Create a slide‑in from left animation.
 */
export const slideInFromLeft = (
  targets: any,
  {
    distance = '250px',
    duration = 450,
    delay = 0,
    easing = 'easeOutCubic',
  }: {
    distance?: string | number;
    duration?: number;
    delay?: number;
    easing?: string;
  } = {}
): AnimeInstance =>
  anime({
    targets,
    translateX: [typeof distance === 'number' ? -distance : `-${distance}`, 0],
    opacity: [0, 1],
    duration,
    delay,
    easing,
  });

/**
 * Staggered fade‑in + translateY for a list of elements.
 */
export const staggerFadeIn = (
  targets: any,
  {
    distance = 20,
    duration = 450,
    delay = 100,
    easing = 'easeOutQuad',
  }: {
    distance?: number;
    duration?: number;
    delay?: number;
    easing?: string;
  } = {}
): AnimeInstance =>
  anime({
    targets,
    opacity: [0, 1],
    translateY: [distance, 0],
    duration,
    delay: anime.stagger(delay),
    easing,
  });

/**
 * Count‑up animation for numeric text content.
 */
export const countUp = (
  element: HTMLElement,
  {
    start = 0,
    end = Number(element.innerText.replace(/[^0-9.]/g, '')) || 0,
    duration = 1000,
    easing = 'easeOutQuad',
    decimals = 0,
    prefix = '',
    suffix = '',
  }: {
    start?: number;
    end?: number;
    duration?: number;
    easing?: string;
    decimals?: number;
    prefix?: string;
    suffix?: string;
  } = {}
): AnimeInstance => {
  const obj = { value: start };
  return anime({
    targets: obj,
    value: end,
    duration,
    easing,
    update: function () {
      element.innerText = `${prefix}${obj.value.toFixed(decimals)}${suffix}`;
    },
  });
};

/**
 * Generic helper to kill an anime instance safely.
 */
export const killAnime = (instance?: AnimeInstance) => {
  if (instance) {
    instance.pause();
    instance.seek(0);
  }
};

