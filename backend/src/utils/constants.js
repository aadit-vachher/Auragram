// src/utils/constants.js
// Shared constants for the aura scoring system

export const EVENT_WEIGHTS = {
  post_created: 10,
  post_liked: 3,
  post_commented: 5,
  post_shared: 8,
  post_bookmarked: 4,
  comment_liked: 2,
  profile_followed: 6,
  post_reported: -15,
  post_removed: -30,
};

export const TIERS = ['Dormant', 'Spark', 'Rising', 'Resonant', 'Influential', 'Luminary', 'Apex'];

export const TIER_THRESHOLDS = {
  Apex: 10000,
  Luminary: 5000,
  Influential: 2000,
  Resonant: 800,
  Rising: 250,
  Spark: 50,
  Dormant: 0,
};

export const RATE_LIMITS = {
  post_created: 10,
  post_liked: 100,
  profile_followed: 50,
  post_commented: 30,
};

export const RATE_LIMIT_WINDOW = 3600; // seconds

export const VELOCITY_LIMIT = 200; // events per hour before soft ban

export const BAN_DURATION = 86400; // 24h in seconds

export const CATEGORIES = ['tech', 'art', 'science', 'gaming', 'culture'];

export const CACHE_TTL = {
  USER: 300,      // 5 minutes
  POST: 120,      // 2 minutes
  LEADERBOARD: 60, // 1 minute
};
