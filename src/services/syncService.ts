import { supabase } from '../config/supabase';
import { db } from '../db/db';
import type { SyncResult } from '../types/sync';

/**
 * Push local unsynced changes to Supabase.
 * Reads the `syncEvents` Dexie log table for records that have not been
 * successfully synced yet, then upserts the corresponding row into the
 * remote table.
 *
 * @returns {Promise<SyncResult>} A promise resolving to the sync result.
 */
export async function pushChanges(): Promise<SyncResult> {
  const result: SyncResult = { pushed: 0, pulled: 0, conflictsResolved: 0 };

  // Example: sync soil_readings only (extend as needed)
  const unsyncedReadings = await db.soilReadings
    .where('syncedAt')
    .equals(null as any)
    .toArray();

  for (const reading of unsyncedReadings) {
    // Upsert into Supabase – the primary key is `id`
    const { error } = await supabase
      .from('soil_readings')
      .upsert(reading);
    if (!error) {
      await db.soilReadings.update(reading.id, { syncedAt: Date.now() });
      result.pushed++;
    }
  }

  return result;
}

/**
 * Pull remote changes newer than the last known sync timestamp.
 * For each table we query rows where `updated_at` > lastSync.
 *
 * @param {number} lastSync - The last sync timestamp in milliseconds.
 * @returns {Promise<SyncResult>} A promise resolving to the sync result.
 */
export async function pullUpdates(lastSync: number): Promise<SyncResult> {
  const result: SyncResult = { pushed: 0, pulled: 0, conflictsResolved: 0 };

  // Pull soil readings example
  const { data, error } = await supabase
    .from('soil_readings')
    .select('*')
    .gt('updated_at', new Date(lastSync).toISOString());

  if (error) {
    console.error('Pull error:', error);
    return result;
  }

  if (data) {
    for (const remote of data) {
      const local = await db.soilReadings.get(remote.id as string);
      if (!local) {
        // Insert new record locally
        // @ts-ignore – Dexie expects the exact shape defined in types
        await db.soilReadings.add(remote as any);
        result.pulled++;
      } else if (new Date(remote.updated_at!).getTime() > (local.updatedAt ?? 0)) {
        // Simple LWW conflict resolution
        await db.soilReadings.update(remote.id as string, remote as any);
        result.conflictsResolved++;
      }
    }
  }

  return result;
}

/**
 * Starts a periodic sync loop.
 *
 * @param {number} [intervalMs=120000] - Interval between sync cycles in milliseconds (default 2 minutes).
 * @returns {() => void} A cleanup function to stop the periodic sync loop.
 */
export function startPeriodicSync(intervalMs = 120_000): () => void {
  let timerId: number | null = null;
  const sync = async () => {
    const now = Date.now();
    await pushChanges();
    await pullUpdates(now);
  };

  // Run immediately then schedule
  sync();
  timerId = window.setInterval(sync, intervalMs);

  // Return a cleanup function if needed
  return () => {
    if (timerId) window.clearInterval(timerId);
  };
}
