import { useState, useCallback, type ReactNode } from 'react';

export interface ResetManagerRenderProps {
  gameKey: number;
  resetGame: () => void;
}

export interface ResetManagerProps {
  children: (props: ResetManagerRenderProps) => ReactNode;
  initialKey?: number;
}

/** Manages a `gameKey` that can be bumped to force-remount the puzzle board. */
export function ResetManager({ children, initialKey = 0 }: ResetManagerProps) {
  const [gameKey, setGameKey] = useState(initialKey);

  const resetGame = useCallback(() => {
    setGameKey((prev) => prev + 1);
  }, []);

  return <>{children({ gameKey, resetGame })}</>;
}

/** Hook form of the same reset-key pattern, used directly inside App.tsx. */
export function useGameReset() {
  const [gameKey, setGameKey] = useState(0);

  const resetGame = useCallback(() => {
    setGameKey((prev) => prev + 1);
  }, []);

  return { gameKey, resetGame };
}

export default ResetManager;
