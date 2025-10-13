import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- THIS IS THE FUNCTION WE ARE DEBUGGING ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('--- LOGIN ATTEMPT ---');
  console.log(`1. Received login request for email: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (user) {
      console.log('2. User found in database. User ID:', user._id);
      console.log('3. Hashed password from DB:', user.password);
      
      const isMatch = await user.matchPassword(password);
      console.log('4. Password match result:', isMatch); // This is the most important log!

      if (isMatch) {
        console.log('5. SUCCESS: Passwords match. Sending token.');
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          token: generateToken(user._id),
        });
      } else {
        console.log('5. FAILURE: Passwords do NOT match. Sending 401 Unauthorized.');
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('2. FAILURE: User with that email not found in database. Sending 401 Unauthorized.');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('SERVER ERROR during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser };