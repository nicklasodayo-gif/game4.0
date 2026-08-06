import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tile } from './Tile';
import { generateSolvablePuzzle, isSolved, getValidMoves } from '@red-giant/game-engine';
import config from '../config';

export interface PuzzleBoardProps {
  onMove?: (moves: number) => void;
  onWin?: (finalMoves: number) => void;
  onMoveCount?: (count: number) => void;
  gridSize?: number;
  gameKey: number;
  disabled?: boolean;
  sound?: (name: string) => void;
}

/** Main sliding-puzzle board. */
export function PuzzleBoard({
  onMove,
  onWin,
  onMoveCount,
  gridSize = 3,
  gameKey,
  disabled = false,
  sound,
}: PuzzleBoardProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const hasWonRef = useRef(false);

  const initializeBoard = useCallback(() => {
    const newTiles = generateSolvablePuzzle(gridSize, config.settings.shuffleMoves);
    setTiles(newTiles);
    setMoves(0);
    setIsShuffled(false);
    hasWonRef.current = false;
  }, [gridSize]);

  useEffect(() => {
    initializeBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey, initializeBoard]);

  useEffect(() => {
    if (tiles.length > 0 && !isShuffled) {
      const timer = setTimeout(() => setIsShuffled(true), 500);
      return () => clearTimeout(timer);
    }
  }, [tiles, isShuffled]);

  useEffect(() => {
    if (isShuffled && tiles.length > 0 && !hasWonRef.current) {
      if (isSolved(tiles)) {
        hasWonRef.current = true;
        sound?.('win');
        onWin?.(moves);
      }
    }
  }, [tiles, isShuffled, moves, onWin, sound]);

  const getEmptyIndex = useCallback(() => tiles.indexOf(gridSize * gridSize), [tiles, gridSize]);

  const canMoveTile = useCallback(
    (index: number) => {
      const emptyIndex = getEmptyIndex();
      if (emptyIndex === -1) return false;
      return getValidMoves(emptyIndex, gridSize).includes(index);
    },
    [getEmptyIndex, gridSize]
  );

  const moveTile = useCallback(
    (index: number) => {
      if (disabled || !canMoveTile(index)) return false;

      const emptyIndex = getEmptyIndex();
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);

      const newMoves = moves + 1;
      setMoves(newMoves);

      sound?.('move');
      onMove?.(newMoves);
      onMoveCount?.(newMoves);

      return true;
    },
    [tiles, moves, disabled, canMoveTile, getEmptyIndex, sound, onMove, onMoveCount]
  );

  const handleTileClick = (index: number) => {
    moveTile(index);
  };

  const boardStyle = {
    width: 'min(400px, 85vw)',
    height: 'min(400px, 85vw)',
    padding: '8px',
  };

  return (
    <motion.div
      className="relative rounded-3xl p-2 shadow-2xl"
      style={{
        ...boardStyle,
        backgroundColor: config.theme.backgroundLight,
        boxShadow: `0 0 60px ${config.theme.primary}30`,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full bg-gray-800/30 rounded-2xl" style={{ padding: '4px' }}>
        {tiles.map((tile, index) => (
          <Tile
            key={`${gameKey}-${tile}-${index}`}
            value={tile}
            position={index}
            gridSize={gridSize}
            onClick={() => handleTileClick(index)}
            isEmpty={tile === gridSize * gridSize}
            canMove={canMoveTile(index) && !disabled}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default PuzzleBoard;
