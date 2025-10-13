import Trip from '../models/Trip.js';
import User from '../models/User.js';
import sendEmail from '../config/email.js';

// --- Functions from before (create, get, add member) ---
// (No changes to the existing functions)

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  const { name, destination, startDate, endDate } = req.body;

  if (!name || !destination || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const trip = new Trip({
    name,
    destination,
    dates: { start: startDate, end: endDate },
    createdBy: req.user._id,
    members: [req.user._id],
    activities: [],
    expenses: [],
    settlements: [],
    polls: []
  });

  try {
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating trip' });
  }
};

// @desc    Get all trips for the logged-in user
// @route   GET /api/trips
// @access  Private
const getTripsForUser = async (req, res) => {
  try {
    const trips = await Trip.find({ members: req.user._id });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching trips' });
  }
};

// @desc    Get a single trip by its ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    // Populate members with name, email, and profilePicture
    const trip = await Trip.findById(req.params.id).populate('members', 'name email profilePicture');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!trip.members.some(member => member._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'User not authorized to view this trip' });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching trip' });
  }
};

// @desc    Add a member to a trip
// @route   POST /api/trips/:id/members
// @access  Private
const addMemberToTrip = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Please provide an email' });
  }
  
  try {
    const trip = await Trip.findById(req.params.id);
    const newMember = await User.findOne({ email });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    if (!newMember) {
      return res.status(404).json({ message: 'User with that email not found' });
    }

    if (!trip.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the trip creator can add members' });
    }
    
    if (trip.members.includes(newMember._id)) {
      return res.status(400).json({ message: 'User is already a member of this trip' });
    }

    trip.members.push(newMember._id);
    
    await trip.save(); // This line already exists

    // --- ADD THIS EMAIL LOGIC ---
    const emailHtml = `
        <h1>You've been invited!</h1>
        <p>${req.user.name} has invited you to join the trip "${trip.name}" on Planora.</p>
        <p>Log in to Planora to see the trip details.</p>
    `;

    await sendEmail({
        to: newMember.email,
        subject: `Invitation to join trip: ${trip.name}`,
        html: emailHtml
    });
    // --- END OF EMAIL LOGIC ---

    const updatedTrip = await Trip.findById(req.params.id).populate('members', 'name email');
    res.json(updatedTrip);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding member' });
  }
};


// --- NEW FUNCTIONS FOR UPDATE AND DELETE ---

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private (Creator only)
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Security Check: Only the creator can update the trip
    if (!trip.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to update this trip' });
    }

    // Update fields from request body
    trip.name = req.body.name || trip.name;
    trip.destination = req.body.destination || trip.destination;
    if (req.body.startDate && req.body.endDate) {
        trip.dates = { start: req.body.startDate, end: req.body.endDate };
    }

    // Add this block of code before the try...catch block
    if (req.file) {
        trip.tripImage = req.file.path;
    }

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating trip' });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private (Creator only)
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Security Check: Only the creator can delete the trip
        if (!trip.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'User not authorized to delete this trip' });
        }

        await trip.deleteOne();
        res.json({ message: 'Trip removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting trip' });
    }
};

// Remember to export the new functions
export { 
  createTrip, 
  getTripsForUser, 
  getTripById, 
  addMemberToTrip, 
  updateTrip, 
  deleteTrip 
};

