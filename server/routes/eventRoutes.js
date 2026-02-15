import express from 'express';
import { getEvents, getEventById, createEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (admin only - for seeding)
router.post('/', protect, createEvent);

export default router;