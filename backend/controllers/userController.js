const User = require("../models/Users");

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// get other user

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    success: true,
    user,
  });
};

// bio

const setBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user._id);

    user.bio = bio;
    await user.save();

    res.json({
      success: true,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update bio" });
  }
};
module.exports = { getMe, getUserById, setBio };
