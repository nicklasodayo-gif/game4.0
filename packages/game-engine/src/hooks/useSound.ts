import { useState, useRef, useCallback } from 'react';

export interface UseSoundOptions {
  enabled?: boolean;
  volume?: number;
}

export interface PlaySoundOptions {
  volume?: number;
  playbackRate?: number;
}

export interface UseSoundResult {
  isMuted: boolean;
  volume: number;
  loadSound: (name: string, src: string) => void;
  playSound: (name: string, options?: PlaySoundOptions) => void;
  stopSound: (name: string) => void;
  toggleMute: () => void;
  setVolume: (value: number) => void;
  unloadAll: () => void;
}

/**
 * Sound-effect manager. Persistence of mute/volume preferences is intentionally
 * left to the consuming app (see the kiosk-player's `useSound` wrapper), so this
 * stays a pure, storage-agnostic hook usable by any app in the monorepo.
 */
export function useSound({ enabled: initialEnabled = true, volume: initialVolume = 0.7 }: UseSoundOptions = {}): UseSoundResult {
  const [isMuted, setIsMuted] = useState(!initialEnabled);
  const [volume, setVolumeState] = useState(initialVolume);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const loadSound = useCallback((name: string, src: string) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioRefs.current[name] = audio;
  }, []);

  const playSound = useCallback(
    (name: string, options: PlaySoundOptions = {}) => {
      if (isMuted) return;
      const audio = audioRefs.current[name];
      if (!audio) return;

      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = options.volume ?? volume;
      clone.playbackRate = options.playbackRate || 1;

      clone.play().catch(() => {
        // Ignore autoplay restrictions.
      });

      clone.addEventListener('ended', () => clone.remove());
      setTimeout(() => clone.remove(), 10000);
    },
    [isMuted, volume]
  );

  const stopSound = useCallback((name: string) => {
    const audio = audioRefs.current[name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.max(0, Math.min(1, value)));
  }, []);

  const unloadAll = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    audioRefs.current = {};
  }, []);

  return { isMuted, volume, loadSound, playSound, stopSound, toggleMute, setVolume, unloadAll };
}

export default useSound;
