import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export interface ConfettiOptions {
  colors?: string[];
  particleCount?: number;
  spread?: number;
  sideBursts?: boolean;
  delay?: number;
}

export interface ConfettiEffectProps {
  trigger: boolean;
  colors: string[];
  options?: ConfettiOptions;
}

/** Fires a confetti burst (plus optional side bursts) when `trigger` becomes true. */
export function ConfettiEffect({ trigger, colors, options = {} }: ConfettiEffectProps) {
  const fireConfetti = useCallback(() => {
    const resolvedColors = options.colors || colors;

    const defaults = {
      particleCount: options.particleCount || 150,
      spread: options.spread || 100,
      origin: { y: 0.6 },
      colors: resolvedColors,
    };

    confetti(defaults);

    if (options.sideBursts !== false) {
      setTimeout(() => {
        confetti({ ...defaults, particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      }, options.delay || 250);

      setTimeout(() => {
        confetti({ ...defaults, particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, (options.delay || 250) + 150);
    }
  }, [options, colors]);

  useEffect(() => {
    if (trigger) fireConfetti();
  }, [trigger, fireConfetti]);

  return null;
}

export interface ContinuousConfettiProps {
  active: boolean;
  colors: string[];
}

/** Low-intensity ambient confetti, useful for attract-mode screens. */
export function ContinuousConfetti({ active, colors }: ContinuousConfettiProps) {
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      confetti({
        particleCount: 5,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors,
        ticks: 200,
        gravity: 0.5,
        scalar: 0.5,
      });
    }, 500);

    return () => clearInterval(interval);
  }, [active, colors]);

  return null;
}

export default ConfettiEffect;
