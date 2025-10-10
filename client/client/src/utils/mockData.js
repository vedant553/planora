// Mock data for the application

// Mock users
export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', avatar: 'https://i.pravatar.cc/150?img=5' }
];

// Mock trips for dashboard
export const mockTrips = [
  {
    id: '1',
    name: 'Summer Beach Vacation',
    destination: 'Maldives',
    startDate: '2024-07-15',
    endDate: '2024-07-22',
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    status: 'planning'
  },
  {
    id: '2',
    name: 'European Adventure',
    destination: 'Paris, France',
    startDate: '2024-09-10',
    endDate: '2024-09-20',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    members: [mockUsers[0], mockUsers[3]],
    status: 'planning'
  },
  {
    id: '3',
    name: 'Mountain Hiking Trip',
    destination: 'Swiss Alps',
    startDate: '2024-08-05',
    endDate: '2024-08-12',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    members: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[4]],
    status: 'active'
  }
];

// Mock activities for itinerary
export const mockActivities = [
  {
    id: '1',
    tripId: '1',
    day: 1,
    title: 'Arrival at Maldives Airport',
    type: 'flight',
    time: '2024-07-15T14:30:00',
    location: 'Velana International Airport',
    description: 'Flight lands at 2:30 PM'
  },
  {
    id: '2',
    tripId: '1',
    day: 1,
    title: 'Check-in at Resort',
    type: 'accommodation',
    time: '2024-07-15T16:00:00',
    location: 'Paradise Island Resort',
    description: 'Check-in time is 4:00 PM'
  },
  {
    id: '3',
    tripId: '1',
    day: 2,
    title: 'Snorkeling Trip',
    type: 'activity',
    time: '2024-07-16T09:00:00',
    location: 'Coral Reef Bay',
    description: 'Morning snorkeling adventure'
  },
  {
    id: '4',
    tripId: '1',
    day: 2,
    title: 'Dinner at Sunset Restaurant',
    type: 'restaurant',
    time: '2024-07-16T19:00:00',
    location: 'Sunset Grill',
    description: 'Reservation for 4 people'
  }
];

// Mock expenses
export const mockExpenses = [
  {
    id: '1',
    tripId: '1',
    description: 'Flight Tickets',
    amount: 1200,
    paidBy: mockUsers[0],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    date: '2024-06-15',
    status: 'pending'
  },
  {
    id: '2',
    tripId: '1',
    description: 'Hotel Booking',
    amount: 2400,
    paidBy: mockUsers[1],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    date: '2024-06-20',
    status: 'pending'
  },
  {
    id: '3',
    tripId: '1',
    description: 'Snorkeling Tour',
    amount: 300,
    paidBy: mockUsers[2],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    date: '2024-07-16',
    status: 'settled'
  },
  {
    id: '4',
    tripId: '1',
    description: 'Dinner',
    amount: 150,
    paidBy: mockUsers[0],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    date: '2024-07-16',
    status: 'pending'
  }
];

// Mock polls
export const mockPolls = [
  {
    id: '1',
    tripId: '1',
    question: 'Should we book the sunset cruise?',
    createdBy: mockUsers[0],
    createdAt: '2024-06-25',
    upvotes: 2,
    downvotes: 1,
    userVote: 'up',
    voters: [
      { user: mockUsers[0], vote: 'up' },
      { user: mockUsers[1], vote: 'up' },
      { user: mockUsers[2], vote: 'down' }
    ]
  },
  {
    id: '2',
    tripId: '1',
    question: 'Extend trip by 2 days?',
    createdBy: mockUsers[1],
    createdAt: '2024-06-28',
    upvotes: 1,
    downvotes: 2,
    userVote: 'down',
    voters: [
      { user: mockUsers[0], vote: 'down' },
      { user: mockUsers[1], vote: 'up' },
      { user: mockUsers[2], vote: 'down' }
    ]
  },
  {
    id: '3',
    tripId: '1',
    question: 'Try the local seafood restaurant?',
    createdBy: mockUsers[2],
    createdAt: '2024-07-01',
    upvotes: 3,
    downvotes: 0,
    userVote: 'up',
    voters: [
      { user: mockUsers[0], vote: 'up' },
      { user: mockUsers[1], vote: 'up' },
      { user: mockUsers[2], vote: 'up' }
    ]
  }
];

// Current user
export const mockCurrentUser = mockUsers[0];

// Current trip (for workspace)
export const mockCurrentTrip = mockTrips[0];

// Expense summary
export const mockExpenseSummary = {
  totalGroupExpenses: 4050,
  yourBalance: -350,
  youAreOwed: 0
};