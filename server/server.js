import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// --- Import All Route Files ---
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// --- API Test Route ---
// A simple route to check if the API is running
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// --- Mount All API Routes ---
// Use the imported routers for specific base URL paths
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);


// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

