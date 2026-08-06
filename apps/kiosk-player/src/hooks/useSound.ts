import { useCallback, useEffect } from 'react';
import { useSound as useSoundEngine, type UseSoundResult, type PlaySoundOptions } from '@red-giant/game-engine';
import { getSettings, updateSettings } from '../services/localStorage';

/**
 * Kiosk-player wrapper around the game-engine's `useSound` that persists
 * the mute/volume preference to localStorage across sessions.
 */
export function useSound(): UseSoundResult {
  const settings = getSettings();
  const engine = useSoundEngine({ enabled: settings.soundEnabled, volume: settings.soundVolume });

  useEffect(() => {
    updateSettings({ soundEnabled: !engine.isMuted, soundVolume: engine.volume });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.isMuted, engine.volume]);

  const playSound = useCallback(
    (name: string, options?: PlaySoundOptions) => engine.playSound(name, options),
    [engine]
  );

  return { ...engine, playSound };
}

export default useSound;
