import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  // The user object is attached to the request in the 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile picture
// @route   PUT /api/users/me/picture
// @access  Private
const updateUserProfilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file.' });
    }
    try {
        const user = await User.findById(req.user._id);
        user.profilePicture = req.file.path; // URL from Cloudinary
        await user.save();
        res.json({
            message: 'Profile picture updated.',
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating profile picture.' });
    }
};

export { getUserProfile, updateUserProfilePicture };
