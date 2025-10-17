import axios from 'axios';

const API_URL = '/api';

const authService = {
  // Register a new user
  register: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      if (response.data) {
        // Store user object (including token) in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data) {
        // Store user object (including token) in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // You would also have a logout function here, for example:
  // logout: () => {
  //   localStorage.removeItem('user');
  // }
};

export default authService;