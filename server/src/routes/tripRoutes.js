import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
    createTrip, 
    getTripsForUser, 
    getTripById,
    addMemberToTrip,
    updateTrip,
    deleteTrip 
} from '../controllers/tripController.js';
import expenseRoutes from './expenseRoutes.js';
  
const router = express.Router();

// Apply the 'protect' middleware to all routes in this file.
// This ensures that only authenticated users can access trip-related endpoints.
router.use(protect);

// Routes for creating a new trip and getting all of the user's trips.
// POST /api/trips
// GET  /api/trips
router.route('/')
  .post(createTrip)
  .get(getTripsForUser);

// Routes for getting, updating, and deleting a single trip by its ID.
// GET    /api/trips/:id
// PUT    /api/trips/:id
// DELETE /api/trips/:id
router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);
  
// Route for adding a member to a specific trip.
// POST /api/trips/:id/members
router.route('/:id/members')
  .post(addMemberToTrip);

// Use the expense router for nested routes
// This line tells the trip router: "For any URL that matches '/:tripId',
// pass the request on to the 'expenseRoutes' router to see if it has a match."
// This is how you connect /api/trips/:tripId/expenses to the expense controller.
router.use('/:tripId', expenseRoutes);

export default router;

