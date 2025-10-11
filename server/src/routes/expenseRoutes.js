import express from 'express';
import {
    findTripAndVerifyMember,
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getTripBalances,
    recordSettlement,
    confirmSettlement, // Import the new function
} from '../controllers/expenseController.js';

const router = express.Router({ mergeParams: true });

// This middleware runs for ALL routes in this file, ensuring the user is part of the trip.
router.use(findTripAndVerifyMember);

router.route('/expenses')
    .post(addExpense)
    .get(getExpenses);

router.route('/expenses/:expenseId')
    .put(updateExpense)
    .delete(deleteExpense);

router.route('/balances')
    .get(getTripBalances);

router.route('/settle')
    .post(recordSettlement);

router.route('/settlements/:settlementId/confirm')
    .put(confirmSettlement);

export default router;

