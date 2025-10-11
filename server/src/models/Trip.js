import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  splitDetails: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owes: { type: Number }
  }]
});

const settlementSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending',
  }
});

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    location: String,
    dateTime: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const voteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voteType: { type: String, enum: ['upvote', 'downvote'] }
});

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votes: [voteSchema]
});


const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  tripImage: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1612281245/sample.jpg' },
  dates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expenses: [expenseSchema],
  settlements: [settlementSchema], // This now uses the updated schema
  activities: [activitySchema],
  polls: [pollSchema]
}, {
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

