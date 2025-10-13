import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const tripService = {
  addMember: async (tripId, email) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/members`, { email }, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to add member');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  getAllTrips: async () => {
    try {
      // Retrieve user data from localStorage
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      // Create axios config with Authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(`${API_BASE_URL}/trips`, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to fetch trips');
      } else if (error.request) {
        // Request made but no response
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        throw error;
      }
    }
  },

  getTripById: async (tripId) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(`${API_BASE_URL}/trips/${tripId}`, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to fetch trip');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  createTrip: async (tripData) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(`${API_BASE_URL}/trips`, tripData, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to create trip');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  updateTrip: async (tripId, tripData) => {
    const userJSON = localStorage.getItem('user');
    
    if (!userJSON) {
      throw new Error('No user found. Please login again.');
    }
    
    const user = JSON.parse(userJSON);
    
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    
    const response = await axios.put(`${API_BASE_URL}/trips/${tripId}`, tripData, config);
    return response.data;
  },

  deleteTrip: async (tripId) => {
    const userJSON = localStorage.getItem('user');
    
    if (!userJSON) {
      throw new Error('No user found. Please login again.');
    }
    
    const user = JSON.parse(userJSON);
    
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    
    const response = await axios.delete(`${API_BASE_URL}/trips/${tripId}`, config);
    return response.data;
  },

  getTripBalances: async (tripId) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/balances`, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to fetch trip balances');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  addExpense: async (tripId, expenseData) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/expenses`, expenseData, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to add expense');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  addActivity: async (tripId, activityData) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/activities`, activityData, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to add activity');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  proposePoll: async (tripId, pollData) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/polls`, pollData, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to create poll');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  },

  castVote: async (tripId, pollId, voteData) => {
    try {
      const userJSON = localStorage.getItem('user');
      
      if (!userJSON) {
        throw new Error('No user found. Please login again.');
      }
      
      const user = JSON.parse(userJSON);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.put(`${API_BASE_URL}/trips/${tripId}/polls/${pollId}/vote`, voteData, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Failed to cast vote');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        throw error;
      }
    }
  }
};


export default tripService;