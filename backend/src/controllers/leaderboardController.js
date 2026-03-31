// src/controllers/leaderboardController.js
import { sendSuccess, sendError } from '../utils/helpers.js';
import { getGlobal, getByCategory, getUserRank } from '../services/leaderboardService.js';
import { CATEGORIES } from '../utils/constants.js';

export async function globalLeaderboard(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);
    const data = await getGlobal(limit);
    sendSuccess(res, { leaderboard: data });
  } catch (err) {
    next(err);
  }
}

export async function categoryLeaderboard(req, res, next) {
  try {
    const { cat } = req.params;
    if (!CATEGORIES.includes(cat)) return sendError(res, 'Invalid category', 400);

    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);
    const data = await getByCategory(cat, limit);
    sendSuccess(res, { leaderboard: data, category: cat });
  } catch (err) {
    next(err);
  }
}

export async function myRank(req, res, next) {
  try {
    const rank = await getUserRank(req.user._id);
    sendSuccess(res, { rank, userId: req.user._id });
  } catch (err) {
    next(err);
  }
}
