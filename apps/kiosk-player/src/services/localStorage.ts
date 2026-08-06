/**
 * LocalStorage service for offline data persistence.
 * Acts as the kiosk's local cache; syncService.ts flushes queued
 * items to the backend API when connectivity is available.
 */
import type { GameRecord } from '@red-giant/game-engine';

export interface LeadRecord {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  consent?: boolean;
  timestamp?: string;
  synced?: boolean;
}

export interface StoredGame extends GameRecord {
  id: string;
  timestamp: string;
}

export interface DailyStat {
  games: number;
  completed: number;
  players?: number;
}

export interface Stats {
  totalPlayers: number;
  totalGames: number;
  completedGames: number;
  totalMoves: number;
  totalTime: number;
  leadsCollected: number;
  idleSessions: number;
  dailyStats: Record<string, DailyStat>;
}

export interface Settings {
  soundEnabled: boolean;
  soundVolume: number;
  currentBrand: string;
  gridSize: number;
  difficulty: string;
}

export interface SyncQueueItem {
  type: 'lead' | 'game';
  data: LeadRecord | StoredGame;
  timestamp: string;
  retries: number;
}

const STORAGE_KEYS = {
  GAMES: 'activation_games',
  LEADS: 'activation_leads',
  STATS: 'activation_stats',
  SETTINGS: 'activation_settings',
  SYNC_QUEUE: 'activation_sync_queue',
} as const;

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function getItem<T>(key: string, defaultValue: T): T {
  if (!isLocalStorageAvailable()) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('localStorage setItem error:', error);
    return false;
  }
}

export function removeItem(key: string): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(key);
}

export function clearAll(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ============ Games ============

export function getGames(): StoredGame[] {
  return getItem<StoredGame[]>(STORAGE_KEYS.GAMES, []);
}

export function addGame(game: GameRecord): StoredGame {
  const games = getGames();
  const newGame: StoredGame = {
    ...game,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  games.unshift(newGame);

  const trimmed = games.slice(0, 1000);
  setItem(STORAGE_KEYS.GAMES, trimmed);

  updateStatsOnGame(newGame);
  addToSyncQueue('game', newGame);

  return newGame;
}

export function getCompletedGames(): StoredGame[] {
  return getGames().filter((g) => g.completed);
}

export function getPersonalBest(): StoredGame | null {
  const completed = getCompletedGames();
  if (completed.length === 0) return null;
  return completed.reduce<StoredGame | null>(
    (best, game) => (!best || game.time < best.time ? game : best),
    null
  );
}

// ============ Leads ============

export function getLeads(): LeadRecord[] {
  return getItem<LeadRecord[]>(STORAGE_KEYS.LEADS, []);
}

export function addLead(lead: LeadRecord): LeadRecord {
  const leads = getLeads();
  const newLead: LeadRecord = {
    ...lead,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    synced: false,
  };
  leads.unshift(newLead);

  const trimmed = leads.slice(0, 500);
  setItem(STORAGE_KEYS.LEADS, trimmed);

  addToSyncQueue('lead', newLead);

  return newLead;
}

export function getUnsyncedLeads(): LeadRecord[] {
  return getLeads().filter((l) => !l.synced);
}

export function markLeadSynced(leadId: string): void {
  const leads = getLeads();
  const updated = leads.map((l) => (l.id === leadId ? { ...l, synced: true } : l));
  setItem(STORAGE_KEYS.LEADS, updated);
}

// ============ Statistics ============

const DEFAULT_STATS: Stats = {
  totalPlayers: 0,
  totalGames: 0,
  completedGames: 0,
  totalMoves: 0,
  totalTime: 0,
  leadsCollected: 0,
  idleSessions: 0,
  dailyStats: {},
};

export function getStats(): Stats {
  return getItem<Stats>(STORAGE_KEYS.STATS, { ...DEFAULT_STATS, dailyStats: {} });
}

function updateStatsOnGame(game: StoredGame): void {
  const stats = getStats();

  stats.totalGames++;
  stats.totalMoves += game.moves || 0;
  stats.totalTime += game.time || 0;

  if (game.completed) stats.completedGames++;

  const today = new Date().toDateString();
  if (!stats.dailyStats[today]) {
    stats.dailyStats[today] = { games: 0, completed: 0, players: 0 };
  }
  stats.dailyStats[today].games++;
  if (game.completed) stats.dailyStats[today].completed++;

  setItem(STORAGE_KEYS.STATS, stats);
}

export function incrementLeadsCollected(): void {
  const stats = getStats();
  stats.leadsCollected++;
  setItem(STORAGE_KEYS.STATS, stats);
}

export function incrementIdleSessions(): void {
  const stats = getStats();
  stats.idleSessions++;
  setItem(STORAGE_KEYS.STATS, stats);
}

export function resetStats(): void {
  setItem(STORAGE_KEYS.STATS, { ...DEFAULT_STATS, dailyStats: {} });
}

// ============ Sync Queue ============

export function getSyncQueue(): SyncQueueItem[] {
  return getItem<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
}

export function addToSyncQueue(type: SyncQueueItem['type'], data: SyncQueueItem['data']): void {
  const queue = getSyncQueue();
  queue.push({ type, data, timestamp: new Date().toISOString(), retries: 0 });
  setItem(STORAGE_KEYS.SYNC_QUEUE, queue);
}

export function removeFromSyncQueue(id: string): void {
  const queue = getSyncQueue();
  const filtered = queue.filter((item) => (item.data as { id?: string }).id !== id);
  setItem(STORAGE_KEYS.SYNC_QUEUE, filtered);
}

export function clearSyncQueue(): void {
  setItem(STORAGE_KEYS.SYNC_QUEUE, []);
}

// ============ Settings ============

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  soundVolume: 0.7,
  currentBrand: 'demo',
  gridSize: 3,
  difficulty: 'normal',
};

export function getSettings(): Settings {
  return getItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function updateSettings(updates: Partial<Settings>): void {
  const settings = getSettings();
  setItem(STORAGE_KEYS.SETTINGS, { ...settings, ...updates });
}

export function resetAllData(): void {
  clearAll();
  resetStats();
}

export { STORAGE_KEYS };
