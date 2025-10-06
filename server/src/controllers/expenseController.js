import Trip from '../models/Trip.js';

// Middleware to find and attach trip to request, and verify user is a member
const findTripAndVerifyMember = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (!trip.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'User is not a member of this trip' });
        }
        req.trip = trip;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new expense to a trip
// @route   POST /api/trips/:tripId/expenses
// @access  Private
const addExpense = async (req, res) => {
    // ... existing addExpense code ...
    const { description, amount, paidBy, splitDetails } = req.body;
    if (!description || !amount || !paidBy || !splitDetails) {
        return res.status(400).json({ message: 'Missing required expense fields' });
    }

    const { trip } = req;
    
    const totalOwed = splitDetails.reduce((sum, detail) => sum + detail.owes, 0);
    if (Math.abs(totalOwed - amount) > 0.01) {
        return res.status(400).json({ message: 'The split amounts do not add up to the total expense amount' });
    }

    const newExpense = { description, amount, paidBy, splitDetails };
    
    trip.expenses.push(newExpense);

    try {
        await trip.save();
        const savedTrip = await Trip.findById(trip._id);
        res.status(201).json(savedTrip.expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding expense' });
    }
};

// @desc    Get all expenses for a trip
// @route   GET /api/trips/:tripId/expenses
// @access  Private
const getExpenses = (req, res) => {
    res.json(req.trip.expenses);
};

// --- NEW: Function to update an existing expense ---
// @desc    Update an expense
// @route   PUT /api/trips/:tripId/expenses/:expenseId
// @access  Private
const updateExpense = async (req, res) => {
    const { description, amount, paidBy, splitDetails } = req.body;
    const { trip } = req;
    const { expenseId } = req.params;

    // Mongoose's .id() method is the perfect way to find a sub-document in an array
    const expense = trip.expenses.id(expenseId);

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    // Update the fields that were provided in the request body
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.paidBy = paidBy || expense.paidBy;
    expense.splitDetails = splitDetails || expense.splitDetails;

    try {
        await trip.save();
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating expense' });
    }
};

// --- NEW: Function to delete an expense ---
// @desc    Delete an expense
// @route   DELETE /api/trips/:tripId/expenses/:expenseId
// @access  Private
const deleteExpense = async (req, res) => {
    const { trip } = req;
    const { expenseId } = req.params;

    const expense = trip.expenses.id(expenseId);

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    
    try {
        // Mongoose provides a direct .deleteOne() method on sub-documents
        await expense.deleteOne();
        await trip.save();
        res.json({ message: 'Expense removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting expense' });
    }
};


// @desc    Calculate real-time balances for a trip
// @route   GET /api/trips/:tripId/balances
// @access  Private
const getTripBalances = (req, res) => {
    // ... existing getTripBalances code ...
    const { trip } = req;
    const balances = new Map();

    trip.members.forEach(memberId => {
        balances.set(memberId.toString(), 0);
    });

    trip.expenses.forEach(expense => {
        const paidByStr = expense.paidBy.toString();
        balances.set(paidByStr, balances.get(paidByStr) + expense.amount);
        expense.splitDetails.forEach(detail => {
            const userStr = detail.user.toString();
            balances.set(userStr, balances.get(userStr) - detail.owes);
        });
    });

    trip.settlements.forEach(settlement => {
        const fromStr = settlement.from.toString();
        const toStr = settlement.to.toString();
        balances.set(fromStr, balances.get(fromStr) - settlement.amount);
        balances.set(toStr, balances.get(toStr) + settlement.amount);
    });
    
    const balanceObject = Object.fromEntries(balances);
    res.json(balanceObject);
};

// @desc    Record a settlement payment
// @route   POST /api/trips/:tripId/settle
// @access  Private
const recordSettlement = async (req, res) => {
    // ... existing recordSettlement code ...
    const { from, to, amount } = req.body;
     if (!from || !to || !amount) {
        return res.status(400).json({ message: 'Missing required settlement fields' });
    }

    const { trip } = req;
    trip.settlements.push({ from, to, amount });

    try {
        await trip.save();
        res.status(201).json({ message: 'Settlement recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while recording settlement' });
    }
};


export { 
    findTripAndVerifyMember,
    addExpense, 
    getExpenses,
    updateExpense, // new export
    deleteExpense, // new export
    getTripBalances,
    recordSettlement
};

