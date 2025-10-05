import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // Check if the token is sent in the headers and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token's payload
      // and attach the user object to the request (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');
      
      // Move on to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return; // Explicitly return to stop execution
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
