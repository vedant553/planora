import express from 'express';
import { 
    addExpense, 
    getExpenses, 
    getTripBalances, 
    recordSettlement,
    findTripAndVerifyMember,
    updateExpense, // new import
    deleteExpense  // new import
} from '../controllers/expenseController.js';

// mergeParams: true is essential for nested routers to access parent params (like :tripId)
const router = express.Router({ mergeParams: true });

// This middleware runs first for all routes in this file
router.use(findTripAndVerifyMember);

// Routes for creating and getting expenses
router.route('/expenses')
    .post(addExpense)
    .get(getExpenses);

// --- NEW: Routes for updating and deleting a specific expense ---
router.route('/expenses/:expenseId')
    .put(updateExpense)
    .delete(deleteExpense);

// Route for getting the trip's financial balances
router.route('/balances')
    .get(getTripBalances);

// Route for recording a settlement payment
router.route('/settle')
    .post(recordSettlement);

export default router;

