import { motion } from 'framer-motion';
import type { UITheme, UIFonts } from '../types';

export interface MoveCounterProps {
  theme: UITheme;
  fonts: UIFonts;
  label: string;
  moves: number;
}

export function MoveCounter({ theme, fonts, label, moves }: MoveCounterProps) {
  return (
    <motion.div
      className="px-6 py-3 rounded-xl"
      style={{ backgroundColor: `${theme.primary}15`, border: `2px solid ${theme.primary}` }}
      key={moves}
      animate={moves > 0 ? { scale: [1, 1.1, 1] } : {}}
    >
      <span className="text-xs font-medium block mb-1" style={{ color: theme.text, opacity: 0.7 }}>
        {label}
      </span>
      <span className="text-3xl font-bold" style={{ color: theme.primary, fontFamily: fonts.display }}>
        {moves}
      </span>
    </motion.div>
  );
}

export default MoveCounter;
