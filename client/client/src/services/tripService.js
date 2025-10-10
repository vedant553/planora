import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const tripService = {
  getAllTrips: async () => {
    const response = await axios.get(`${API_BASE_URL}/trips`);
    return response.data;
  },

  getTripById: async (tripId) => {
    const response = await axios.get(`${API_BASE_URL}/trips/${tripId}`);
    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await axios.post(`${API_BASE_URL}/trips`, tripData);
    return response.data;
  },

  updateTrip: async (tripId, tripData) => {
    const response = await axios.put(`${API_BASE_URL}/trips/${tripId}`, tripData);
    return response.data;
  },

  deleteTrip: async (tripId) => {
    const response = await axios.delete(`${API_BASE_URL}/trips/${tripId}`);
    return response.data;
  }
};

export default tripService;