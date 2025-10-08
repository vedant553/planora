import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Create the HTTP server and the Socket.IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // For development. In production, restrict this to your frontend URL.
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware to make the `io` instance accessible in all controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Main Socket.IO connection handler
io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Handler for when a user joins a specific trip's "room"
    socket.on('joinTripRoom', (tripId) => {
        socket.join(tripId);
        console.log(`User ${socket.id} joined room for trip ${tripId}`);
    });

    // Handler for when a user leaves a room
    socket.on('leaveTripRoom', (tripId) => {
        socket.leave(tripId);
        console.log(`User ${socket.id} left room for trip ${tripId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket Disconnected: ${socket.id}`);
    });
});

// Standard Express Middleware
app.use(express.json());

// Simple route for checking if the server is running
app.get('/', (req, res) => {
  res.send('API with real-time features is running...');
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;

// Start the server by listening on the httpServer instance
httpServer.listen(PORT, () => {
  console.log(`Server with real-time support running on port ${PORT}`);
});

