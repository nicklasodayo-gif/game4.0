import type { GameRecord, StatisticsSummary, LeaderboardEntry } from './types';

export function calculateAverage(values: number[]): number {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function calculateMedian(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeHuman(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

export function calculateCompletionRate(completed: number, started: number): number {
  if (started === 0) return 0;
  return Math.round((completed / started) * 100);
}

export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function getStatisticsSummary(games: GameRecord[]): StatisticsSummary {
  if (!games || games.length === 0) {
    return {
      totalGames: 0,
      completedGames: 0,
      averageTime: 0,
      averageMoves: 0,
      fastestTime: 0,
      slowestTime: 0,
      medianTime: 0,
    };
  }

  const completed = games.filter((g) => g.completed);
  const times = completed.map((g) => g.time);
  const moves = games.map((g) => g.moves);

  return {
    totalGames: games.length,
    completedGames: completed.length,
    averageTime: Math.round(calculateAverage(times)),
    averageMoves: Math.round(calculateAverage(moves)),
    fastestTime: times.length > 0 ? Math.min(...times) : 0,
    slowestTime: times.length > 0 ? Math.max(...times) : 0,
    medianTime: Math.round(calculateMedian(times)),
    completionRate: calculateCompletionRate(completed.length, games.length),
  };
}

export function getLeaderboard(
  games: GameRecord[],
  sortBy: 'time' | 'moves' = 'time',
  limit = 10
): LeaderboardEntry[] {
  const completed = games.filter((g) => g.completed);

  return completed
    .map((g, index) => ({
      rank: index + 1,
      name: g.name || 'Anonymous',
      time: g.time,
      moves: g.moves,
      date: g.date,
    }))
    .sort((a, b) => (sortBy === 'time' ? a.time - b.time : a.moves - b.moves))
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function groupByDate(games: GameRecord[]): Record<string, GameRecord[]> {
  return games.reduce((groups: Record<string, GameRecord[]>, game) => {
    const date = new Date(game.date).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(game);
    return groups;
  }, {});
}
