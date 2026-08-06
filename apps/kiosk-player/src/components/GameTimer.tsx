import { motion } from 'framer-motion';
import config from '../config';
import { formatTime } from '@red-giant/game-engine';

export interface GameTimerProps {
  time: number;
  targetTime: number;
  isRunning?: boolean;
}

export function GameTimer({ time, targetTime }: GameTimerProps) {
  const isWarning = time >= targetTime * 0.8;
  const isDanger = time >= targetTime;

  const activeColor = isDanger ? config.theme.error : isWarning ? config.theme.gold : config.theme.primary;

  return (
    <motion.div
      className="px-6 py-3 rounded-xl"
      style={{
        backgroundColor: isDanger ? `${config.theme.error}20` : isWarning ? `${config.theme.gold}20` : `${config.theme.primary}15`,
        border: `2px solid ${activeColor}`,
      }}
      animate={isDanger ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isDanger ? Infinity : 0 }}
    >
      <span className="text-xs font-medium block mb-1" style={{ color: config.theme.text, opacity: 0.7 }}>
        {config.labels.time}
      </span>
      <span className="text-3xl font-bold" style={{ color: activeColor, fontFamily: config.fonts.display }}>
        {formatTime(time)}
      </span>
    </motion.div>
  );
}

export default GameTimer;
