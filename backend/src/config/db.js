// src/config/db.js
// Mongoose connection with retry logic and graceful shutdown

import mongoose from 'mongoose';
import env from './env.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function connectDB(attempt = 1) {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[DB] MongoDB connected successfully');
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      console.error(`[DB] Failed to connect after ${MAX_RETRIES} attempts. Exiting.`);
      process.exit(1);
    }
    console.warn(`[DB] Connection attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS}ms...`);
    await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    return connectDB(attempt + 1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('[DB] MongoDB error:', err.message);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[DB] MongoDB connection closed on app termination');
  process.exit(0);
});

export default connectDB;
