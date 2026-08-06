import axios from 'axios';

/**
 * Backend API client. Talks to the FastAPI service in `backend/`.
 * Base URL is configurable via VITE_API_URL (see .env.example).
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export interface SubmitLeadPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  brand: string;
  timestamp: string;
}

export interface SubmitScorePayload {
  brand: string;
  gridSize: number;
  moves: number;
  time: number;
  completed: boolean;
  playerName?: string;
}

export interface LeaderboardEntryDTO {
  rank: number;
  name: string;
  time: number;
  moves: number;
  date: string;
}

export interface AnalyticsEventPayload {
  eventType: 'attract_start' | 'game_start' | 'game_win' | 'lead_capture' | 'idle';
  brand: string;
  metadata?: Record<string, unknown>;
}

/** Submit a captured lead to the backend (games/leads endpoint). */
export async function submitLead(payload: SubmitLeadPayload) {
  const { data } = await apiClient.post('/api/games/leads', payload);
  return data;
}

/** Submit a completed (or abandoned) game session. */
export async function submitScore(payload: SubmitScorePayload) {
  const { data } = await apiClient.post('/api/games/score', payload);
  return data;
}

/** Fetch the top scores leaderboard for a brand. */
export async function fetchLeaderboard(brand: string, limit = 20): Promise<LeaderboardEntryDTO[]> {
  const { data } = await apiClient.get('/api/games/leaderboard', { params: { brand, limit } });
  return data;
}

/** Fire-and-forget analytics event (attract starts, idle timeouts, etc). */
export async function trackEvent(payload: AnalyticsEventPayload) {
  try {
    await apiClient.post('/api/analytics/event', payload);
  } catch {
    // Analytics failures should never block gameplay.
  }
}

export default apiClient;
