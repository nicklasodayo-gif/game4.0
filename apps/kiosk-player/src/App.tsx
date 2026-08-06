import { useState, useCallback, useEffect, type CSSProperties } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { getConfig, getCSSVariables, type BrandConfig } from './config';

import {
  AttractMode,
  PuzzleBoard,
  WinScreen,
  LeadCapture,
  GameHeader,
  GameFooter,
  SoundController,
  FullscreenButton,
  IdleTimer,
  useGameReset,
  Leaderboard,
  type LeadSubmitData,
} from './components';

import { useGameTimer, useFullscreen } from '@red-giant/game-engine';
import { useSound } from './hooks/useSound';
import { useStatistics } from './hooks/useStatistics';

import { addLead } from './services/localStorage';
import { submitLead, trackEvent } from './services/api';
import { startBackgroundSync } from './services/syncService';

import './styles/index.css';

type GameState = 'attract' | 'playing' | 'won' | 'leadCapture';

function App() {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand') || 'redgiant';
  const config = getConfig(brand);

  // Periodically flush any offline-queued leads/scores to the backend.
  useEffect(() => {
    const stop = startBackgroundSync(brand);
    return stop;
  }, [brand]);

  return (
    <BrowserRouter>
      <CSSVariables config={config} />

      <Routes>
        <Route path="/" element={<GamePage config={config} brand={brand} />} />
        <Route path="/leaderboard" element={<LeaderboardPage config={config} />} />
      </Routes>
    </BrowserRouter>
  );
}

interface GamePageProps {
  config: BrandConfig;
  brand: string;
}

function GamePage({ config, brand }: GamePageProps) {
  const [gameState, setGameState] = useState<GameState>('attract');
  const [moves, setMoves] = useState(0);

  const { recordWin, recordLead, recordIdle } = useStatistics();
  const { gameKey, resetGame } = useGameReset();

  const { isMuted, toggleMute, loadSound, playSound } = useSound();
  const { isFullscreen, isSupported, toggle: toggleFullscreen } = useFullscreen();

  const { time, isRunning, start, stop, reset } = useGameTimer({ maxTime: config.settings.targetTime * 4 });

  useEffect(() => {
    if (config.sounds.move) loadSound('move', config.sounds.move);
    if (config.sounds.win) loadSound('win', config.sounds.win);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleStart = useCallback(() => {
    setMoves(0);
    reset();
    resetGame();
    setGameState('playing');
    trackEvent({ eventType: 'game_start', brand });
  }, [reset, resetGame, brand]);

  const handleMove = useCallback(
    (newMoves: number) => {
      setMoves(newMoves);
      if (!isRunning) start();
    },
    [isRunning, start]
  );

  const handleMoveCount = useCallback((count: number) => {
    setMoves(count);
  }, []);

  const handleWin = useCallback(
    (finalMoves: number) => {
      stop();
      recordWin({ moves: finalMoves, time, gridSize: config.settings.gridSize });
      setMoves(finalMoves);
      setGameState('won');
      trackEvent({ eventType: 'game_win', brand, metadata: { moves: finalMoves, time } });
    },
    [config, stop, time, recordWin, brand]
  );

  const handleContinue = useCallback(() => {
    setMoves(0);
    reset();
    resetGame();
    setGameState('playing');
  }, [reset, resetGame]);

  const handleClaimPrize = useCallback(() => {
    setGameState('leadCapture');
  }, []);

  const handleLeadSubmit = useCallback(
    (lead: LeadSubmitData) => {
      addLead(lead);
      recordLead();
      trackEvent({ eventType: 'lead_capture', brand });

      // Best-effort immediate sync; syncService's background loop will retry on failure.
      submitLead({ ...lead, brand, timestamp: lead.timestamp }).catch(() => {
        // Offline — the queued lead in localStorage will be flushed later.
      });

      setTimeout(() => setGameState('attract'), 2000);
    },
    [recordLead, brand]
  );

  const handleLeadSkip = useCallback(() => {
    setGameState('attract');
  }, []);

  const handleIdle = useCallback(() => {
    stop();
    reset();
    recordIdle();
    setGameState('attract');
    trackEvent({ eventType: 'idle', brand });
  }, [stop, reset, recordIdle, brand]);

  const playSoundEffect = useCallback(
    (name: string) => {
      if (!isMuted) playSound(name);
    },
    [isMuted, playSound]
  );

  return (
    <div
      className="min-h-screen overflow-hidden select-none"
      style={{
        fontFamily: config.fonts.body,
        background: `linear-gradient(135deg, ${config.theme.background}, ${config.theme.backgroundLight})`,
      }}
    >
      <SoundController theme={config.theme} isMuted={isMuted} onToggle={toggleMute} />

      {isSupported && (
        <FullscreenButton theme={config.theme} isFullscreen={isFullscreen} onToggle={() => toggleFullscreen()} />
      )}

      <IdleTimer isActive={gameState !== 'attract'} onIdle={handleIdle} timeout={config.settings.idleTimeout * 1000}>
        <div />
      </IdleTimer>

      <AnimatePresence mode="wait">
        {gameState === 'attract' && <AttractMode key="attract" onStart={handleStart} />}

        {(gameState === 'playing' || gameState === 'won') && (
          <div key="game" className="min-h-screen flex flex-col items-center justify-center p-4">
            <GameHeader
              theme={config.theme}
              fonts={config.fonts}
              labels={config.labels}
              title={config.game.title}
              subtitle={config.game.subtitle}
              moves={moves}
              time={time}
              targetTime={config.settings.targetTime}
            />

            <PuzzleBoard
              key={gameKey}
              gridSize={config.settings.gridSize}
              onMove={handleMove}
              onMoveCount={handleMoveCount}
              onWin={handleWin}
              gameKey={gameKey}
              disabled={gameState === 'won'}
              sound={playSoundEffect}
            />

            <GameFooter theme={config.theme} fonts={config.fonts} instruction={config.game.instruction} />
          </div>
        )}

        {gameState === 'won' && (
          <WinScreen
            key="win"
            moves={moves}
            time={time}
            targetTime={config.settings.targetTime}
            onContinue={handleContinue}
            onClaimPrize={handleClaimPrize}
          />
        )}

        {gameState === 'leadCapture' && (
          <LeadCapture key="leadCapture" onSubmit={handleLeadSubmit} onSkip={handleLeadSkip} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface LeaderboardPageProps {
  config: BrandConfig;
}

function LeaderboardPage({ config }: LeaderboardPageProps) {
  const navigate = useNavigate();
  const { getTopScores } = useStatistics();
  const scores = getTopScores('time', 20);

  return (
    <div
      className="min-h-screen p-4"
      style={{ background: `linear-gradient(135deg, ${config.theme.background}, ${config.theme.backgroundLight})` }}
    >
      <Leaderboard theme={config.theme} fonts={config.fonts} scores={scores} title="🏆 Top Scores" onClose={() => navigate('/')} />
    </div>
  );
}

interface CSSVariablesProps {
  config: BrandConfig;
}

function CSSVariables({ config }: CSSVariablesProps) {
  const variables = getCSSVariables(config) as CSSProperties;
  return <div style={variables} />;
}

export default App;
