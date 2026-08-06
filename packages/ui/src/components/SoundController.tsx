import { motion } from 'framer-motion';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import type { UITheme } from '../types';

export interface SoundControllerProps {
  theme: UITheme;
  isMuted: boolean;
  onToggle: () => void;
}

export function SoundController({ theme, isMuted, onToggle }: SoundControllerProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full"
      style={{ backgroundColor: theme.backgroundLight, opacity: 0.9 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <FiVolumeX size={24} style={{ color: theme.text }} />
      ) : (
        <FiVolume2 size={24} style={{ color: theme.primary }} />
      )}
    </motion.button>
  );
}

export default SoundController;
