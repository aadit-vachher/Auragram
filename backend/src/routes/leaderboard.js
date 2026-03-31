// src/routes/leaderboard.js
import { Router } from 'express';
import authenticate from '../middlewares/auth.js';
import { globalLeaderboard, categoryLeaderboard, myRank } from '../controllers/leaderboardController.js';

const router = Router();

router.get('/global', globalLeaderboard);
router.get('/category/:cat', categoryLeaderboard);
router.get('/me/rank', authenticate, myRank);

export default router;
