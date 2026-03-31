// src/routes/events.js
import { Router } from 'express';
import { body } from 'express-validator';
import authenticate from '../middlewares/auth.js';
import { submitEvent } from '../controllers/eventsController.js';

const EVENT_TYPES = [
  'post_created', 'post_liked', 'post_commented', 'post_shared',
  'post_bookmarked', 'comment_liked', 'profile_followed', 'post_reported', 'post_removed',
];

const router = Router();

router.post(
  '/',
  authenticate,
  [
    body('type').isIn(EVENT_TYPES).withMessage('Invalid event type'),
    body('targetUserId').optional().isMongoId().withMessage('Invalid targetUserId'),
    body('postId').optional().isMongoId().withMessage('Invalid postId'),
  ],
  submitEvent
);

export default router;
