import { motion } from 'framer-motion';
import type { UITheme, UIFonts, ScoreEntry } from '../types';
import { formatTime } from '@red-giant/game-engine';

export interface LeaderboardProps {
  theme: UITheme;
  fonts: UIFonts;
  scores?: ScoreEntry[];
  title?: string;
  onClose: () => void;
}

export function Leaderboard({ theme, fonts, scores = [], title = 'Leaderboard', onClose }: LeaderboardProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: `${theme.background}ee` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md rounded-3xl p-6" style={{ backgroundColor: theme.backgroundLight }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: theme.text, fontFamily: fonts.display }}>
            {title}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full" style={{ backgroundColor: theme.surface }}>
            ✕
          </button>
        </div>

        {scores.length === 0 ? (
          <p className="text-center py-8" style={{ color: theme.text, opacity: 0.6 }}>
            No scores yet. Be the first!
          </p>
        ) : (
          <div className="space-y-3">
            {scores.map((score, index) => (
              <motion.div
                key={score.id ?? index}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  backgroundColor: index < 3 ? `${theme.gold ?? theme.primary}15` : theme.surface,
                  border: index < 3 ? `2px solid ${theme.gold ?? theme.primary}` : 'none',
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor:
                      index === 0 ? theme.gold ?? theme.primary : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : theme.primary,
                    color: index < 3 ? theme.textDark ?? theme.background : theme.text,
                  }}
                >
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="font-semibold" style={{ color: theme.text }}>
                    {score.name || 'Anonymous'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold" style={{ color: theme.primary }}>
                    {formatTime(score.time)}
                  </p>
                  <p className="text-sm" style={{ color: theme.text, opacity: 0.7 }}>
                    {score.moves} moves
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Leaderboard;
