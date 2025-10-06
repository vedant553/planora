import mongoose from 'mongoose';

// --- Sub-schema for individual expenses ---
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  splitDetails: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owes: { type: Number, required: true }
  }],
}, { _id: true, timestamps: true }); // Enable IDs and timestamps for sub-documents

// --- Sub-schema for settlement payments ---
const settlementSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { _id: true, timestamps: true });


const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  dates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // --- NEW: Add the expense and settlement arrays ---
  expenses: [expenseSchema],
  settlements: [settlementSchema],
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

