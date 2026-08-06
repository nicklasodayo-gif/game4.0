import { useEffect, useRef, useCallback, useState } from 'react';

export interface UseIdleDetectionOptions {
  timeout?: number;
  onIdle?: () => void;
  onActive?: () => void;
  enabled?: boolean;
}

export interface UseIdleDetectionResult {
  isIdle: boolean;
  lastActivity: number;
  resetTimer: () => void;
  timeSinceLastActivity: number;
}

const ACTIVITY_EVENTS = [
  'touchstart',
  'touchmove',
  'touchend',
  'click',
  'mousemove',
  'mousedown',
  'mouseup',
  'keypress',
  'keydown',
  'scroll',
  'wheel',
] as const;

/** Detects user idle state after a period of no interaction (touch/mouse/keyboard). */
export function useIdleDetection({
  timeout = 30000,
  onIdle,
  onActive,
  enabled = true,
}: UseIdleDetectionOptions = {}): UseIdleDetectionResult {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdleRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (isIdleRef.current) {
      isIdleRef.current = false;
      setIsIdle(false);
      setLastActivity(Date.now());
      onActive?.();
    }

    timeoutRef.current = setTimeout(() => {
      isIdleRef.current = true;
      setIsIdle(true);
      onIdle?.();
    }, timeout);
  }, [timeout, onIdle, onActive]);

  const handleActivity = useCallback(() => {
    if (enabled) resetTimer();
  }, [enabled, resetTimer]);

  useEffect(() => {
    if (!enabled) return;

    resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, handleActivity, resetTimer]);

  return {
    isIdle,
    lastActivity,
    resetTimer,
    timeSinceLastActivity: Date.now() - lastActivity,
  };
}

export default useIdleDetection;
