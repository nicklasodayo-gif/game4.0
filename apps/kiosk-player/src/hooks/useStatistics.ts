import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getGames,
  addGame,
  getStats,
  resetStats,
  incrementLeadsCollected,
  incrementIdleSessions,
  type StoredGame,
  type Stats,
} from '../services/localStorage';
import { calculateAverage, getStatisticsSummary, getLeaderboard, type GameRecord, type LeaderboardEntry } from '@red-giant/game-engine';

export interface RecordGameInput extends Omit<GameRecord, 'date' | 'completed'> {
  completed?: boolean;
}

/** App-level statistics hook: bridges the pure game-engine calculations with local persistence. */
export function useStatistics() {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      setGames(getGames());
      setStats(getStats());
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const recordGame = useCallback((gameData: RecordGameInput) => {
    const newGame = addGame({
      ...gameData,
      completed: gameData.completed ?? false,
      date: new Date().toISOString(),
    });
    setGames((prev) => [newGame, ...prev]);
    return newGame;
  }, []);

  const recordWin = useCallback(
    (gameData: RecordGameInput) => recordGame({ ...gameData, completed: true }),
    [recordGame]
  );

  const recordLoss = useCallback(
    (gameData: RecordGameInput) => recordGame({ ...gameData, completed: false }),
    [recordGame]
  );

  const recordLead = useCallback(() => {
    incrementLeadsCollected();
    setStats((prev) => (prev ? { ...prev, leadsCollected: prev.leadsCollected + 1 } : null));
  }, []);

  const recordIdle = useCallback(() => {
    incrementIdleSessions();
    setStats((prev) => (prev ? { ...prev, idleSessions: prev.idleSessions + 1 } : null));
  }, []);

  const reset = useCallback(() => {
    resetStats();
    setGames([]);
    setStats(getStats());
  }, []);

  const computedStats = useMemo(() => getStatisticsSummary(games), [games]);

  const getTopScores = useCallback(
    (sortBy: 'time' | 'moves' = 'time', limit = 10): LeaderboardEntry[] => getLeaderboard(games, sortBy, limit),
    [games]
  );

  const personalBest = useMemo(() => {
    const completed = games.filter((g) => g.completed);
    if (completed.length === 0) return null;
    return completed.reduce<StoredGame | null>((best, game) => (!best || game.time < best.time ? game : best), null);
  }, [games]);

  const averages = useMemo(() => {
    const completed = games.filter((g) => g.completed);
    return {
      time: completed.length > 0 ? Math.round(calculateAverage(completed.map((g) => g.time))) : 0,
      moves: completed.length > 0 ? Math.round(calculateAverage(completed.map((g) => g.moves))) : 0,
    };
  }, [games]);

  return {
    games,
    stats,
    isLoading,
    computedStats,
    personalBest,
    averages,
    recordGame,
    recordWin,
    recordLoss,
    recordLead,
    recordIdle,
    reset,
    loadData,
    getTopScores,
  };
}

export default useStatistics;
