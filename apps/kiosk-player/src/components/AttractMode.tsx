import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config';

export interface AttractModeProps {
  onStart: () => void;
}

/** Idle attract-loop screen shown before a session starts. */
export function AttractMode({ onStart }: AttractModeProps) {
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setShowInstruction((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInteraction = () => onStart();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer touch-manipulation z-50"
      style={{
        background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
      }}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackgroundParticles />

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          className="mb-8"
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{
            duration: config.visuals.animations.attractFloat / 1000,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Logo />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black font-display mb-4 drop-shadow-lg"
          style={{ color: config.theme.primary, fontFamily: config.fonts.display }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {config.attract.title}
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl mb-8"
          style={{ color: config.theme.text, fontFamily: config.fonts.body }}
        >
          {config.attract.subtitle}
        </motion.p>

        <AnimatePresence>
          {showInstruction && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: config.theme.primary }}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    `0 0 20px ${config.theme.primary}60`,
                    `0 0 40px ${config.theme.primary}80`,
                    `0 0 20px ${config.theme.primary}60`,
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HandIcon />
              </motion.div>

              <p
                className="text-xl font-semibold"
                style={{ color: config.theme.text, fontFamily: config.fonts.body, opacity: 0.8 }}
              >
                {config.attract.instruction}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-12 px-8 py-4 rounded-full"
          style={{
            backgroundColor: `${config.theme.gold}20`,
            border: `2px solid ${config.theme.gold}`,
          }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-xl font-bold" style={{ color: config.theme.gold, fontFamily: config.fonts.display }}>
            {config.game.prize}
          </p>
        </motion.div>

        <motion.p
          className="mt-6 text-lg italic"
          style={{ color: config.theme.text, opacity: 0.6 }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {config.attract.tagline}
        </motion.p>
      </div>

      <div className="absolute bottom-8">
        <p className="text-sm opacity-40" style={{ color: config.theme.text }}>
          Powered by Red Giant
        </p>
      </div>
    </motion.div>
  );
}

function BackgroundParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-15"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: config.visuals.particles.colors[particle.id % config.visuals.particles.colors.length],
          }}
          animate={{ y: [0, -100, 0], x: [0, 50, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function Logo() {
  return (
    <div
      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center shadow-2xl"
      style={{ background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.primaryDark} 100%)` }}
    >
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <rect x="10" y="10" width="35" height="35" rx="8" fill="white" opacity="0.9" />
        <rect x="55" y="10" width="35" height="35" rx="8" fill="white" opacity="0.7" />
        <rect x="10" y="55" width="35" height="35" rx="8" fill="white" opacity="0.6" />
        <rect x="55" y="55" width="35" height="35" rx="8" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}

function HandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

export default AttractMode;
