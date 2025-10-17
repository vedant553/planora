import { createContext, useContext, useState } from 'react';
import tripService from '../services/tripService';

const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default TripContext;

export const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState({
    _id: null,
    id: null,
    name: '',
    destination: '',
    dates: { start: null, end: null },
    startDate: null,
    endDate: null,
    createdBy: null,
    members: [],
    settlements: [], // Initialize settlements array
    expenses: [], // Initialize with empty array
    activities: [], // Initialize with empty array
    polls: [] // Initialize with empty array
  });
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [polls, setPolls] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addActivity = async (activity) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentTrip?._id) {
        throw new Error('No trip selected');
      }

      // Call the API service to add the activity
      const newActivity = await tripService.addActivity(currentTrip._id, activity);
      
      // Update the currentTrip state with the new activity
      setCurrentTrip(prevTrip => ({
        ...prevTrip,
        activities: [...(prevTrip.activities || []), newActivity]
      }));
      
      // Also update the activities state to keep them in sync
      setActivities(prevActivities => [...prevActivities, newActivity]);
      
      return newActivity;
    } catch (err) {
      setError(err.message || 'Failed to add activity');
      console.error('Error adding activity:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    if (!currentTrip?._id) {
      throw new Error('No trip selected');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the API service to add the expense
      const newExpensesArray = await tripService.addExpense(currentTrip._id, expenseData);
      
      // Ensure we have a valid array response
      if (!Array.isArray(newExpensesArray)) {
        throw new Error('Invalid response from server: expected expenses array');
      }
      
      // Update the currentTrip state with the new expenses array
      setCurrentTrip(prevTrip => ({
        ...prevTrip,
        expenses: newExpensesArray
      }));
      
      // Also update the expenses state to keep them in sync
      setExpenses(newExpensesArray);
      
      return newExpensesArray;
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const proposePoll = async (pollData) => {
    if (!currentTrip?._id) {
      throw new Error('No trip selected');
    }

    setLoading(true);
    setError(null);
    try {
      const updatedTrip = await tripService.proposePoll(currentTrip._id, pollData);
      console.log('proposePoll response:', updatedTrip);
      setCurrentTrip(updatedTrip);
      setPolls(updatedTrip.polls || []);
      return updatedTrip;
    } catch (err) {
      setError(err.message || 'Failed to propose poll');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (pollId, voteData) => {
    if (!currentTrip?._id) {
      throw new Error('No trip selected');
    }

    setLoading(true);
    setError(null);
    try {
      const updatedTrip = await tripService.castVote(currentTrip._id, pollId, voteData);
      setCurrentTrip(updatedTrip);
      setPolls(updatedTrip.polls || []);
      return updatedTrip;
    } catch (err) {
      setError(err.message || 'Failed to cast vote');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initiateSettlement = (debt) => {
    const newSettlement = {
      id: Date.now().toString(),
      from: debt.from,
      to: debt.to,
      amount: debt.amount,
      status: 'pending',
      initiatedAt: new Date().toISOString()
    };

    setCurrentTrip(prev => ({
      ...prev,
      settlements: [...(prev.settlements || []), newSettlement]
    }));
  };

  const confirmSettlement = (settlement) => {
    setCurrentTrip(prev => ({
      ...prev,
      settlements: prev.settlements.map(s => 
        s.id === settlement.id 
          ? { ...s, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : s
      )
    }));
  };

  const fetchTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      if (!tripId) {
        throw new Error('No trip ID provided');
      }
      
      const data = await tripService.getTripById(tripId);
      
      if (!data) {
        throw new Error('No trip data received from server');
      }
      
      // Ensure members have avatar property
      const membersWithAvatar = (data.members || []).map(m => ({
        ...m,
        avatar: m.profilePicture || m.avatar || ''
      }));
      // Transform the backend response to match frontend expectations
      const transformedTrip = {
        ...data,
        id: data._id, // Add id field for frontend compatibility
        startDate: data.dates?.start,
        endDate: data.dates?.end,
        members: membersWithAvatar,
        settlements: data.settlements || [], // Ensure settlements array is present
        expenses: data.expenses || [], // Ensure expenses array is present
        activities: data.activities || [], // Ensure activities array is present
        polls: data.polls || [] // Ensure polls array is present
      };
      // Set the current trip state completely (don't merge with previous state)
      setCurrentTrip(transformedTrip);
      // Update individual state arrays
      setActivities(transformedTrip.activities || []);
      setExpenses(transformedTrip.expenses || []);
      setPolls(transformedTrip.polls || []);
      
    } catch (err) {
      console.error('TripContext - fetchTrip error:', err);
      setError(err.message || 'Failed to fetch trip');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (email) => {
    if (!currentTrip?._id) {
      throw new Error('No trip selected');
    }

    setLoading(true);
    setError(null);
    try {
      const updatedTrip = await tripService.addMember(currentTrip._id, email);
      setCurrentTrip(updatedTrip);
      return updatedTrip;
    } catch (err) {
      setError(err.message || 'Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentTrip,
    setCurrentTrip,
    activities,
    addActivity,
    expenses,
    addExpense,
    expenseSummary,
    polls,
    proposePoll,
    castVote,
    initiateSettlement,
    confirmSettlement,
    loading,
    error,
    fetchTrip,
    addMember
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};