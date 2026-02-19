const like = require("../models/Like");

const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    const existingLike = await like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ liked: false });
    }

    await like.create({
      post: postId,
      user: userId,
    });

    res.json({ liked: true });
  } catch (error) {
    res.status(500).json({ message: "Like failed" });
  }
};

module.exports = {toggleLike};