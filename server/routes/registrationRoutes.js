import express from 'express';
import {
  registerForEvent,
  cancelRegistration,  // This should match the export name
  getMyRegistrations
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', registerForEvent);
router.get('/my-registrations', getMyRegistrations);
router.delete('/:eventId', cancelRegistration);  // This should match

export default router;