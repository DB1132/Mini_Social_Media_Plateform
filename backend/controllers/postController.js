const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Follow = require("../models/Follow");
const { put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const getPostDetails = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const postWithCounts = await Promise.all(
      posts.map(async (post) => {
        const LikeCount = await Like.countDocuments({ post: post._id });
        const CommentCount = await Comment.countDocuments({ post: post._id });

        const likedByMe = await Like.exists({
          post: post._id,
          user: req.user._id,
        });

        const comments = await Comment.find({ post: post._id })
          .populate("user", "name")
          .sort({ createdAt: -1 });

        return {
          ...post.toObject(),
          LikeCount,
          CommentCount,
          likedByMe: !!likedByMe,
          comments,
        };
      }),
    );
    res.json({ success: true, posts: postWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load feed" });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.file && !content) {
      return res
        .status(400)
        .json({ success: false, message: "Post must have image or caption" });
    }

    let imageUrl = "";

    if (req.file) {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        // Production (Vercel): Upload directly to Vercel Blob storage
        const blob = await put(`posts/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
          access: "public",
        });
        imageUrl = blob.url;
      } else {
        // Local Development: Write buffer to local uploads/ directory
        const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        imageUrl = `/uploads/${filename}`;
      }
    }

    const newPost = await Post.create({
      content,
      image: imageUrl,
      user: req.user._id,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

const getMyPost = async (req, res) => {
  const posts = await Post.find({ user: req.user._id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, posts });
};

const getUserPost = async (req, res) => {
  const posts = await Post.find({ user: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, posts });
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!postId) {
      return res.status(404).json({ message: "Post nor found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await post.deleteOne();
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

const getFollowingFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    const following = await Follow.find({ follower: userId });

    const followingIds = following.map((f) => f.following);

    followingIds.push(userId);

    const posts = await Post.find({
      user: { $in: followingIds },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const postsWithExtras = await Promise.all(
      posts.map(async (post) => {
        const LikeCount = await Like.countDocuments({ post: post._id });
        const CommentCount = await Comment.countDocuments({ post: post._id });

        const likedByMe = await Like.exists({
          post: post._id,
          user: userId,
        });

        return {
          ...post.toObject(),
          LikeCount,
          CommentCount,
          likedByMe: !!likedByMe,
        };
      }),
    );

    res.json({ success: true, posts: postsWithExtras });
  } catch (error) {
    res.status(500).json({ message: "Failed to load following feed" });
  }
};

module.exports = {
  getPostDetails,
  createPost,
  getMyPost,
  getUserPost,
  deletePost,
  getFollowingFeed,
};
