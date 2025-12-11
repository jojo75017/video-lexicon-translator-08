import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = useCallback((options?: {
    particleCount?: number;
    spread?: number;
    origin?: { x: number; y: number };
    colors?: string[];
  }) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
      ...options
    };

    confetti({
      ...defaults,
      disableForReducedMotion: true
    });
  }, []);

  const fireStars = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        disableForReducedMotion: true
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ffd700']
    });

    fire(0.2, {
      spread: 60,
      colors: ['#8b5cf6', '#a855f7']
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#06b6d4', '#22d3ee']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#10b981', '#34d399']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#f59e0b', '#fbbf24']
    });
  }, []);

  const fireSchoolPride = useCallback(() => {
    const end = Date.now() + 3000;
    const colors = ['#8b5cf6', '#ffd700'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const fireSideCanons = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981'],
        disableForReducedMotion: true
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#ef4444', '#ec4899'],
        disableForReducedMotion: true
      });
    }, 250);
  }, []);

  return {
    fireConfetti,
    fireStars,
    fireSchoolPride,
    fireSideCanons
  };
};
