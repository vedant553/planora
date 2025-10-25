import { io } from 'socket.io-client';

// Create Socket.IO instance
const socket = io(import.meta.env.PROD
  ? window.location.origin
  : 'http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connect socket with authentication token
export const connectSocket = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    socket.auth = { token: user.token };
    socket.connect();
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  socket.disconnect();
};

// Join trip room
export const joinTripRoom = (tripId) => {
  socket.emit('joinTripRoom', tripId);
};

// Leave trip room
export const leaveTripRoom = (tripId) => {
  socket.emit('leaveTripRoom', tripId);
};

export default socket;
