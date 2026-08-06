import { motion } from 'framer-motion';
import type { UITheme, UIFonts } from '../types';

export interface GameFooterProps {
  theme: UITheme;
  fonts: UIFonts;
  instruction: string;
}

/** Bottom footer with contextual instructions. */
export function GameFooter({ theme, fonts, instruction }: GameFooterProps) {
  return (
    <motion.div
      className="text-center mb-4 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-base md:text-lg" style={{ color: theme.text, opacity: 0.7, fontFamily: fonts.body }}>
        {instruction}
      </p>
    </motion.div>
  );
}

export default GameFooter;
