const Comment = require("../models/Comment");

const addComments = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const newComment = await Comment.create({
      post: postId,
      user: req.user._id,
      text,
    });

    res.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment
      .find({ post: postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });


    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get comments" });
  }
};

module.exports = {addComments, getComments};
