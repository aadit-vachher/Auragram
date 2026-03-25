// src/config/queue.js
// BullMQ Queue instance for aura events

import { Queue } from 'bullmq';
import { bullMQConnection } from './redis.js';

export const auraQueue = new Queue('aura-events', {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

auraQueue.on('error', (err) => {
  console.error('[Queue] BullMQ queue error:', err.message);
});

export default auraQueue;
