import Trip from '../models/Trip.js';

const addActivity = async (req, res) => {
    const { title, description, location, dateTime, day } = req.body;
    const { trip, io } = req;
    if (!title || !dateTime) return res.status(400).json({ message: 'Title and dateTime are required' });
    
    // Create activity object with all fields from request
    const activity = { 
        title, 
        description, 
        location, 
        dateTime, 
        day: day || 1, // Default to day 1 if not provided
        createdBy: req.user._id 
    };
    
    trip.activities.push(activity);
    
    try {
        await trip.save();
        console.log('Activity saved successfully:', activity);
        io.to(trip._id.toString()).emit('activity_updated', trip.activities);
        res.status(201).json(trip.activities);
    } catch (error) {
        console.error('Error saving activity:', error);
        res.status(500).json({ message: 'Server error while adding activity' });
    }
};

const getActivities = (req, res) => {
    res.json(req.trip.activities);
};

const createPoll = async (req, res) => {
    const { question, description } = req.body;
    const { trip, io } = req;
    if (!question) return res.status(400).json({ message: 'A question is required for the poll' });
    const poll = { question, description, createdBy: req.user._id, votes: [] };
    trip.polls.push(poll);
    try {
        await trip.save();
        io.to(trip._id.toString()).emit('poll_updated', trip.polls);
        res.status(201).json(trip.polls);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating poll' });
    }
};

const castVote = async (req, res) => {
    const { voteType } = req.body;
    const { trip, io } = req;
    const { pollId } = req.params;
    if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type. Must be "upvote" or "downvote".' });
    }
    const poll = trip.polls.id(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    const existingVoteIndex = poll.votes.findIndex(vote => vote.user.equals(req.user._id));
    if (existingVoteIndex > -1) {
        poll.votes[existingVoteIndex].voteType = voteType;
    } else {
        poll.votes.push({ user: req.user._id, voteType });
    }
    try {
        await trip.save();
        io.to(trip._id.toString()).emit('poll_updated', trip.polls);
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error while casting vote' });
    }
};

const getPolls = (req, res) => {
    res.json(req.trip.polls);
};

export { addActivity, getActivities, createPoll, castVote, getPolls };

    