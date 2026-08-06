import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseGameTimerOptions {
  initialTime?: number;
  maxTime?: number;
  onTick?: (time: number) => void;
  onComplete?: (time: number) => void;
}

export interface UseGameTimerResult {
  time: number;
  formattedTime: string;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setTime: (value: number) => void;
  formatTime: (seconds: number) => string;
}

/** Custom hook for game timing (counts up, optionally capped at maxTime). */
export function useGameTimer({
  initialTime = 0,
  maxTime,
  onTick,
  onComplete,
}: UseGameTimerOptions = {}): UseGameTimerResult {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimeRef = useRef(maxTime);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    maxTimeRef.current = maxTime;
  }, [maxTime]);

  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const tick = useCallback(() => {
    setTime((prev) => {
      const newTime = prev + 1;
      onTickRef.current?.(newTime);

      if (maxTimeRef.current && newTime >= maxTimeRef.current) {
        onCompleteRef.current?.(newTime);
        return maxTimeRef.current;
      }

      return newTime;
    });
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!isRunning || isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      intervalRef.current = setInterval(tick, 1000);
    }
  }, [isRunning, isPaused, tick]);

  const reset = useCallback(() => {
    stop();
    setTime(initialTime);
  }, [stop, initialTime]);

  const setTimeValue = useCallback((value: number) => {
    setTime(value);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    isPaused,
    start,
    stop,
    pause,
    resume,
    reset,
    setTime: setTimeValue,
    formatTime,
  };
}

export default useGameTimer;
