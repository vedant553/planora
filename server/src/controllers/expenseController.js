import Trip from '../models/Trip.js';

// Middleware to find the trip and verify the user is a member
const findTripAndVerifyMember = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.tripId || req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (!trip.members.some(member => member.equals(req.user._id))) {
            return res.status(403).json({ message: 'User not authorized for this trip' });
        }
        req.trip = trip;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addExpense = async (req, res) => {
    const { description, amount, paidBy, splitDetails } = req.body;
    const { trip, io } = req;
    const expense = { description, amount, paidBy, splitDetails };
    trip.expenses.push(expense);
    try {
        await trip.save();
        io.to(trip._id.toString()).emit('expense_updated', trip.expenses);
        res.status(201).json(trip.expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding expense' });
    }
};

const getExpenses = (req, res) => {
    res.json(req.trip.expenses);
};

const updateExpense = async (req, res) => {
    const { description, amount, paidBy, splitDetails } = req.body;
    const { trip, io } = req;
    const { expenseId } = req.params;
    const expense = trip.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    expense.set({ description, amount, paidBy, splitDetails });
    try {
        await trip.save();
        io.to(trip._id.toString()).emit('expense_updated', trip.expenses);
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating expense' });
    }
};

const deleteExpense = async (req, res) => {
    const { trip, io } = req;
    const { expenseId } = req.params;
    const expense = trip.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    try {
        expense.deleteOne();
        await trip.save();
        io.to(trip._id.toString()).emit('expense_updated', trip.expenses);
        res.json({ message: 'Expense removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting expense' });
    }
};

const getTripBalances = (req, res) => {
    const { trip } = req;
    const balances = new Map();
    trip.members.forEach(member => balances.set(member.toString(), 0));
    trip.expenses.forEach(expense => {
        const paidBy = expense.paidBy.toString();
        balances.set(paidBy, (balances.get(paidBy) || 0) + expense.amount);
        expense.splitDetails.forEach(detail => {
            const owesBy = detail.user.toString();
            balances.set(owesBy, (balances.get(owesBy) || 0) - detail.owes);
        });
    });
    trip.settlements.forEach(settlement => {
        const from = settlement.from.toString();
        const to = settlement.to.toString();
        balances.set(from, (balances.get(from) || 0) - settlement.amount);
        balances.set(to, (balances.get(to) || 0) + settlement.amount);
    });
    res.json(Object.fromEntries(balances));
};

const recordSettlement = async (req, res) => {
    const { from, to, amount } = req.body;
    const { trip, io } = req;
    const settlement = { from, to, amount };
    trip.settlements.push(settlement);
    try {
        await trip.save();
        io.to(trip._id.toString()).emit('settlement_updated', trip.settlements);
        res.status(201).json({ message: 'Settlement recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while recording settlement' });
    }
};

export {
    findTripAndVerifyMember,
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getTripBalances,
    recordSettlement,
};

