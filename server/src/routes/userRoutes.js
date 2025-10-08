import express from 'express';
import { getUserProfile, updateUserProfilePicture } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Applying the 'protect' middleware to this route
// GET /api/users/me
router.get('/me', protect, getUserProfile);

// PUT /api/users/me/picture
router.route('/me/picture').put(protect, upload.single('profilePic'), updateUserProfilePicture);

export default router;