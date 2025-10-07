import Trip from '../models/Trip.js';

// @desc    Add an activity to the itinerary
// @route   POST /api/trips/:tripId/activities
// @access  Private
const addActivity = async (req, res) => {
    const { title, description, location, dateTime } = req.body;
    const { trip } = req; // Attached by middleware

    if (!title || !dateTime) {
        return res.status(400).json({ message: 'Title and dateTime are required' });
    }

    const activity = {
        title,
        description,
        location,
        dateTime,
        createdBy: req.user._id
    };

    trip.activities.push(activity);
    
    try {
        await trip.save();
        res.status(201).json(trip.activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding activity' });
    }
};

// @desc    Get all activities for a trip
// @route   GET /api/trips/:tripId/activities
// @access  Private
const getActivities = (req, res) => {
    res.json(req.trip.activities);
};


// @desc    Propose a new poll/option for voting
// @route   POST /api/trips/:tripId/polls
// @access  Private
const createPoll = async (req, res) => {
    const { question, description } = req.body;
    const { trip } = req;

    if (!question) {
        return res.status(400).json({ message: 'A question is required for the poll' });
    }

    const poll = {
        question,
        description,
        createdBy: req.user._id,
        votes: [] // Initialize with empty votes
    };

    trip.polls.push(poll);

    try {
        await trip.save();
        res.status(201).json(trip.polls);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating poll' });
    }
};

// @desc    Cast a vote on a poll
// @route   PUT /api/trips/:tripId/polls/:pollId/vote
// @access  Private
const castVote = async (req, res) => {
    const { voteType } = req.body; // "upvote" or "downvote"
    const { trip } = req;
    const { pollId } = req.params;

    if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type. Must be "upvote" or "downvote".' });
    }

    const poll = trip.polls.id(pollId);
    if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user has already voted
    const existingVoteIndex = poll.votes.findIndex(vote => vote.user.equals(req.user._id));

    if (existingVoteIndex > -1) {
        // User is changing their vote
        poll.votes[existingVoteIndex].voteType = voteType;
    } else {
        // User is casting a new vote
        poll.votes.push({ user: req.user._id, voteType });
    }

    try {
        await trip.save();
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error while casting vote' });
    }
};

// @desc    Get all polls for a trip
// @route   GET /api/trips/:tripId/polls
// @access  Private
const getPolls = (req, res) => {
    res.json(req.trip.polls);
};


export { addActivity, getActivities, createPoll, castVote, getPolls };
