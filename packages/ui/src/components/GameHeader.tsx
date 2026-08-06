import { motion } from 'framer-motion';
import type { UITheme, UIFonts } from '../types';
import { formatTime } from '@red-giant/game-engine';

export interface GameHeaderLabels {
  moves: string;
  time: string;
  target: string;
}

export interface GameHeaderProps {
  theme: UITheme;
  fonts: UIFonts;
  labels: GameHeaderLabels;
  title: string;
  subtitle?: string;
  moves: number;
  time: number;
  targetTime: number;
}

/** Top header showing the game title and live stats. */
export function GameHeader({ theme, fonts, labels, title, subtitle, moves, time, targetTime }: GameHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1
        className="text-3xl md:text-5xl font-black font-display mb-2"
        style={{ color: theme.text, fontFamily: fonts.display }}
      >
        {title}
      </h1>

      {subtitle && (
        <p className="text-lg mb-6" style={{ color: theme.primary, fontFamily: fonts.body }}>
          {subtitle}
        </p>
      )}

      <div className="flex justify-center gap-6">
        <StatBadge label={labels.moves} value={moves} color={theme.primary} theme={theme} fonts={fonts} />
        <StatBadge label={labels.time} value={formatTime(time)} color={theme.primary} theme={theme} fonts={fonts} />
        <StatBadge
          label={labels.target}
          value={formatTime(targetTime)}
          color={theme.gold ?? theme.primary}
          theme={theme}
          fonts={fonts}
        />
      </div>
    </div>
  );
}

interface StatBadgeProps {
  label: string;
  value: string | number;
  color: string;
  theme: UITheme;
  fonts: UIFonts;
}

function StatBadge({ label, value, color, theme, fonts }: StatBadgeProps) {
  return (
    <motion.div
      className="px-6 py-3 rounded-xl"
      style={{ backgroundColor: `${color}15`, border: `2px solid ${color}` }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-xs font-medium block mb-1" style={{ color: theme.text, opacity: 0.7 }}>
        {label}
      </span>
      <span className="text-2xl font-bold" style={{ color, fontFamily: fonts.display }}>
        {value}
      </span>
    </motion.div>
  );
}

export default GameHeader;
