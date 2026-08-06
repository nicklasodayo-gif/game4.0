/**
 * Flushes the local offline queue (leads/games captured while the kiosk
 * had no network) to the backend API, so the touch-screen device keeps
 * working uninterrupted even if connectivity briefly drops.
 */
import { getSyncQueue, removeFromSyncQueue, markLeadSynced, type LeadRecord, type StoredGame } from './localStorage';
import { submitLead, submitScore } from './api';

const MAX_RETRIES = 5;

export async function syncPendingItems(brand: string): Promise<{ synced: number; failed: number }> {
  const queue = getSyncQueue();
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      if (item.type === 'lead') {
        const lead = item.data as LeadRecord;
        await submitLead({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          company: lead.company,
          brand,
          timestamp: lead.timestamp || new Date().toISOString(),
        });
        if (lead.id) markLeadSynced(lead.id);
      } else {
        const game = item.data as StoredGame;
        await submitScore({
          brand,
          gridSize: game.gridSize,
          moves: game.moves,
          time: game.time,
          completed: game.completed,
        });
      }

      if (item.data.id) removeFromSyncQueue(item.data.id);
      synced++;
    } catch (error) {
      item.retries += 1;
      failed++;
      if (item.retries >= MAX_RETRIES && item.data.id) {
        // Drop items that have failed repeatedly so the queue doesn't grow unbounded.
        removeFromSyncQueue(item.data.id);
      }
    }
  }

  return { synced, failed };
}

/** Starts a background interval that periodically flushes the sync queue. */
export function startBackgroundSync(brand: string, intervalMs = 30000): () => void {
  const interval = setInterval(() => {
    syncPendingItems(brand).catch(() => {
      // Network likely unavailable; will retry on next tick.
    });
  }, intervalMs);

  return () => clearInterval(interval);
}
