import express from 'express';
import {
    addActivity,
    getActivities,
    createPoll,
    castVote,
    getPolls
} from '../controllers/itineraryController.js';
import { findTripAndVerifyMember } from '../controllers/expenseController.js'; // We can reuse this!

const router = express.Router({ mergeParams: true });

// Protect all routes in this file
router.use(findTripAndVerifyMember);

// Itinerary routes
router.route('/activities')
    .post(addActivity)
    .get(getActivities);

// Voting routes
router.route('/polls')
    .post(createPoll)
    .get(getPolls);

router.route('/polls/:pollId/vote')
    .put(castVote);

export default router;
