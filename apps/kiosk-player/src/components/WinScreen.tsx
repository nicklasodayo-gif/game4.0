import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import config from '../config';
import { formatTime } from '@red-giant/game-engine';

export interface WinScreenProps {
  moves: number;
  time: number;
  targetTime: number;
  onContinue: () => void;
  onClaimPrize: () => void;
}

export function WinScreen({ moves, time, targetTime, onContinue, onClaimPrize }: WinScreenProps) {
  const triggerConfetti = useCallback(() => {
    const colors = config.visuals.confettiColors;

    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors });

    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0 }, colors });
    }, 250);

    setTimeout(() => {
      confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1 }, colors });
    }, 400);
  }, []);

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  const isUnderTarget = time <= targetTime;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-40"
      style={{
        background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg">
        <motion.div
          className="mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${config.theme.success} 0%, ${config.theme.primary} 100%)`,
              boxShadow: `0 0 60px ${config.theme.success}60`,
            }}
          >
            <TrophyIcon />
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-black font-display mb-4 drop-shadow-lg"
          style={{ color: config.theme.success, fontFamily: config.fonts.display }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {config.win.title}
        </motion.h1>

        <motion.p
          className="text-2xl mb-8"
          style={{ color: config.theme.text, fontFamily: config.fonts.body }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {config.win.subtitle}
        </motion.p>

        <motion.div
          className="flex gap-6 mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <StatBox label={config.labels.moves} value={moves} />
          <StatBox label={config.labels.time} value={formatTime(time)} />
        </motion.div>

        {isUnderTarget && (
          <motion.div
            className="mb-8 px-6 py-3 rounded-full"
            style={{ backgroundColor: `${config.theme.gold}20`, border: `2px solid ${config.theme.gold}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            <p className="text-lg font-bold" style={{ color: config.theme.gold }}>
              ⭐ {config.win.perfectTime} ⭐
            </p>
          </motion.div>
        )}

        <motion.p
          className="text-xl mb-8"
          style={{ color: config.theme.text, fontFamily: config.fonts.body, opacity: 0.8 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.8 }}
        >
          {config.win.message}
        </motion.p>

        <motion.div
          className="mb-8 px-8 py-4 rounded-full"
          style={{ backgroundColor: `${config.theme.gold}20`, border: `3px solid ${config.theme.gold}` }}
          animate={{
            boxShadow: [
              `0 0 20px ${config.theme.gold}40`,
              `0 0 40px ${config.theme.gold}60`,
              `0 0 20px ${config.theme.gold}40`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-2xl font-bold" style={{ color: config.theme.gold, fontFamily: config.fonts.display }}>
            {config.game.prize}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 w-full max-w-xs"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={onClaimPrize}
            className="w-full py-5 px-8 rounded-2xl font-bold text-xl shadow-lg"
            style={{ backgroundColor: config.theme.primary, color: config.theme.text, fontFamily: config.fonts.display }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            {config.buttons.claim}
          </motion.button>

          <motion.button
            onClick={onContinue}
            className="w-full py-4 px-8 rounded-2xl font-semibold text-lg"
            style={{
              backgroundColor: 'transparent',
              color: config.theme.text,
              border: `2px solid ${config.theme.text}`,
              fontFamily: config.fonts.body,
              opacity: 0.8,
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ opacity: 1 }}
          >
            {config.buttons.retry}
          </motion.button>
        </motion.div>
      </div>

      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${config.theme.success}20 0%, transparent 70%)` }}
      />
    </motion.div>
  );
}

interface StatBoxProps {
  label: string;
  value: string | number;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div
      className="flex flex-col items-center px-6 py-4 rounded-2xl"
      style={{ backgroundColor: config.theme.backgroundLight, border: `1px solid ${config.theme.primary}40` }}
    >
      <span className="text-sm font-medium mb-1" style={{ color: config.theme.text, opacity: 0.7 }}>
        {label}
      </span>
      <span className="text-3xl font-bold" style={{ color: config.theme.primary, fontFamily: config.fonts.display }}>
        {value}
      </span>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-16 h-16" fill="white">
      <path d="M12 2C13.1 2 14 2.9 14 4V5H16C17.1 5 18 5.9 18 7V9C18 10.1 17.5 11.1 16.7 11.8C16.3 12.1 16 12.6 16 13.2V14H17C18.1 14 19 14.9 19 16V18H5V16C5 14.9 5.9 14 7 14H8V13.2C8 12.6 7.7 12.1 7.3 11.8C6.5 11.1 6 10.1 6 9V7C6 5.9 6.9 5 8 5H10V4C10 2.9 10.9 2 12 2ZM8 7H16V9C16 10.1 15.5 11.1 14.7 11.8C14.3 12.1 14 12.6 14 13.2V14H10V13.2C10 12.6 9.7 12.1 9.3 11.8C8.5 11.1 8 10.1 8 9V7ZM5 19H19V21H5V19Z" />
    </svg>
  );
}

export default WinScreen;
