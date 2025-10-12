import { createContext, useContext, useState } from 'react';
import { mockCurrentTrip, mockActivities, mockExpenses, mockPolls, mockExpenseSummary } from '../utils/mockData';

const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState({
    ...mockCurrentTrip,
    settlements: [] // Initialize settlements array
  });
  const [activities, setActivities] = useState(mockActivities);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [polls, setPolls] = useState(mockPolls);
  const [expenseSummary, setExpenseSummary] = useState(mockExpenseSummary);

  const addActivity = (activity) => {
    setActivities([...activities, { ...activity, id: Date.now().toString() }]);
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
  };

  const addPoll = (poll) => {
    setPolls([...polls, { ...poll, id: Date.now().toString() }]);
  };

  const votePoll = (pollId, vote) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const newUpvotes = vote === 'up' ? poll.upvotes + 1 : poll.upvotes;
        const newDownvotes = vote === 'down' ? poll.downvotes + 1 : poll.downvotes;
        return { ...poll, upvotes: newUpvotes, downvotes: newDownvotes, userVote: vote };
      }
      return poll;
    }));
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

  const value = {
    currentTrip,
    setCurrentTrip,
    activities,
    addActivity,
    expenses,
    addExpense,
    expenseSummary,
    polls,
    addPoll,
    votePoll,
    initiateSettlement,
    confirmSettlement
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};