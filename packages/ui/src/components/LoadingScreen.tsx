import { motion } from 'framer-motion';
import type { UITheme } from '../types';

export interface LoadingScreenProps {
  theme: UITheme;
  message?: string;
}

/** Full-screen loading indicator, themeable by any app in the monorepo. */
export function LoadingScreen({ theme, message = 'Loading...' }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.backgroundLight} 100%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark ?? theme.primary} 100%)`,
        }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity },
        }}
      >
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <rect x="10" y="10" width="35" height="35" rx="8" fill="white" opacity="0.9" />
          <rect x="55" y="10" width="35" height="35" rx="8" fill="white" opacity="0.7" />
          <rect x="10" y="55" width="35" height="35" rx="8" fill="white" opacity="0.6" />
          <rect x="55" y="55" width="35" height="35" rx="8" fill="white" opacity="0.3" />
        </svg>
      </motion.div>

      <p className="text-xl font-medium" style={{ color: theme.text }}>
        {message}
      </p>

      <div className="w-48 h-2 rounded-full mt-4 overflow-hidden" style={{ backgroundColor: theme.surface }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: theme.primary }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
