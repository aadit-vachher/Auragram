// src/workers/auraWorker.js
// BullMQ worker for processing aura events + scheduled jobs

import { Worker, QueueScheduler } from 'bullmq';
import cron from 'node-cron';
import Event from '../models/Event.js';
import { processEvent } from '../services/auraEngine.js';
import { runDecay } from '../services/decayService.js';
import { getGlobal } from '../services/leaderboardService.js';
import { emitToRoom } from '../socket/socketManager.js';
import { bullMQConnection } from '../config/redis.js';

let worker = null;

/**
 * Initialize the BullMQ worker and scheduled jobs.
 * Should be called once on server startup.
 */
export function startWorker() {
  worker = new Worker(
    'aura-events',
    async (job) => {
      const { eventId } = job.data;

      try {
        const event = await Event.findById(eventId);
        if (!event) {
          console.warn(`[Worker] Event ${eventId} not found, skipping`);
          return;
        }
        if (event.processed) {
          console.warn(`[Worker] Event ${eventId} already processed, skipping`);
          return;
        }

        await processEvent(event);
        console.log(`[Worker] Job ${job.id} completed successfully`);
      } catch (err) {
        console.error(`[Worker] Job ${job.id} failed:`, err.message);
        throw err; // Re-throw to trigger BullMQ retry
      }
    },
    {
      connection: bullMQConnection,
      concurrency: 5,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err.message);
  });

  // ────────────────────────────────────────────────────────────────────
  // Scheduled Jobs
  // ────────────────────────────────────────────────────────────────────

  // Daily decay — runs at 2:00am UTC every day
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cron] Running daily decay job...');
    try {
      await runDecay();
    } catch (err) {
      console.error('[Cron] Daily decay failed:', err.message);
    }
  }, { timezone: 'UTC' });

  // Leaderboard sync — runs every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('[Cron] Syncing leaderboard...');
    try {
      const top100 = await getGlobal(100);
      emitToRoom('leaderboard-updates', 'leaderboard_update', {
        type: 'global',
        data: top100,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[Cron] Leaderboard sync failed:', err.message);
    }
  });

  console.log('[Worker] BullMQ worker started with concurrency 5');
  console.log('[Worker] Scheduled jobs registered (decay: 2am UTC, leaderboard: every 5min)');

  return worker;
}

/**
 * Gracefully stop the worker.
 */
export async function stopWorker() {
  if (worker) {
    await worker.close();
    console.log('[Worker] Worker stopped gracefully');
  }
}

export default { startWorker, stopWorker };
