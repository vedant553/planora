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

// --- Sub-schema for individual itinerary activities ---
const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    dateTime: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// --- Sub-schema for voting polls ---
const pollSchema = new mongoose.Schema({
    question: { type: String, required: true }, // e.g., "Which museum should we visit?"
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    votes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        voteType: { type: String, enum: ['upvote', 'downvote'], required: true }
    }]
});

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
  // Add the expense and settlement arrays ---
  expenses: [expenseSchema],
  settlements: [settlementSchema],
  // Add activities and polls to the trip ---
  activities: [activitySchema],
  polls: [pollSchema],
  tripImage: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1612281245/sample.jpg'
  }
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;





/*
// Can be done like this also

import mongoose from 'mongoose';

// --- NEW: Schema for individual itinerary activities ---
const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    dateTime: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// --- NEW: Schema for voting polls ---
const pollSchema = new mongoose.Schema({
    question: { type: String, required: true }, // e.g., "Which museum should we visit?"
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    votes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        voteType: { type: String, enum: ['upvote', 'downvote'], required: true }
    }]
});


// --- Main Trip Schema ---
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
  // --- Schemas from Phase 3 ---
  expenses: [
    new mongoose.Schema({
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        splitDetails: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            owes: { type: Number }
        }]
    }, { timestamps: true })
  ],
  settlements: [
    new mongoose.Schema({
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number },
    }, { timestamps: true })
  ],
  // --- NEW: Add activities and polls to the trip ---
  activities: [activitySchema],
  polls: [pollSchema]

}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

*/