import { useState, useCallback, useEffect, useRef } from 'react';

interface FullscreenDocument extends Document {
  webkitFullscreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export interface UseFullscreenOptions {
  element?: string | HTMLElement;
  autoEnter?: boolean;
}

export interface UseFullscreenResult {
  isFullscreen: boolean;
  isSupported: boolean;
  enter: () => Promise<boolean>;
  exit: () => Promise<boolean>;
  toggle: () => Promise<boolean>;
  element: HTMLElement | null;
}

export function useFullscreen({
  element = 'body',
  autoEnter = false,
}: UseFullscreenOptions = {}): UseFullscreenResult {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const doc = document as FullscreenDocument;
    setIsSupported(!!(document.fullscreenEnabled || doc.webkitFullscreenEnabled || doc.msFullscreenEnabled));
  }, []);

  useEffect(() => {
    if (typeof element === 'string') {
      elementRef.current = (document.querySelector(element) as HTMLElement) || document.documentElement;
    } else {
      elementRef.current = element || document.documentElement;
    }
  }, [element]);

  useEffect(() => {
    const handleChange = () => {
      const doc = document as FullscreenDocument;
      setIsFullscreen(!!(document.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('MSFullscreenChange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('MSFullscreenChange', handleChange);
    };
  }, []);

  const enter = useCallback(async () => {
    const el = elementRef.current as FullscreenElement | null;
    if (!el || !isSupported) return false;

    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      return true;
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
      return false;
    }
  }, [isSupported]);

  const exit = useCallback(async () => {
    const doc = document as FullscreenDocument;
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) await doc.msExitFullscreen();
      return true;
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
      return false;
    }
  }, []);

  const toggle = useCallback(() => (isFullscreen ? exit() : enter()), [isFullscreen, enter, exit]);

  useEffect(() => {
    if (!autoEnter || !isSupported) return;

    const handleFirstInteraction = () => {
      enter();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [autoEnter, isSupported, enter]);

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
    element: elementRef.current,
  };
}

export default useFullscreen;
