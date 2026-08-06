export interface GameRecord {
  moves: number;
  time: number;
  gridSize: number;
  completed: boolean;
  date: string;
  name?: string;
}

export interface StatisticsSummary {
  totalGames: number;
  completedGames: number;
  averageTime: number;
  averageMoves: number;
  fastestTime: number;
  slowestTime: number;
  medianTime: number;
  completionRate?: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  time: number;
  moves: number;
  date: string;
}
