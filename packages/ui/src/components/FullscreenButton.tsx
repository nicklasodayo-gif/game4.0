import { motion } from 'framer-motion';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import type { UITheme } from '../types';

export interface FullscreenButtonProps {
  theme: UITheme;
  isFullscreen: boolean;
  onToggle: () => void;
}

export function FullscreenButton({ theme, isFullscreen, onToggle }: FullscreenButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 left-4 z-50 p-3 rounded-full"
      style={{ backgroundColor: theme.backgroundLight, opacity: 0.9 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <FiMinimize2 size={24} style={{ color: theme.text }} />
      ) : (
        <FiMaximize2 size={24} style={{ color: theme.text }} />
      )}
    </motion.button>
  );
}

export default FullscreenButton;
