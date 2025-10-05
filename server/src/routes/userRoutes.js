import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Applying the 'protect' middleware to this route
// GET /api/users/me
router.get('/me', protect, getUserProfile);

export default router;