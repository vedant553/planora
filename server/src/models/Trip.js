import mongoose from 'mongoose';

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
  // Link to the User model for the trip creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // An array of users who are part of the trip
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
