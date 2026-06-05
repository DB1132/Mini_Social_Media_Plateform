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

    if (!posts || posts.length === 0) {
      return res.json({ success: true, posts: [] });
    }

    const postIds = posts.map((p) => p._id);

    // 1. Fetch all like counts in a single bulk query
    const likeCounts = await Like.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const likeCountsMap = {};
    likeCounts.forEach((item) => {
      likeCountsMap[item._id.toString()] = item.count;
    });

    // 2. Fetch all comment counts in a single bulk query
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const commentCountsMap = {};
    commentCounts.forEach((item) => {
      commentCountsMap[item._id.toString()] = item.count;
    });

    // 3. Find which posts are liked by the current user in a single bulk query
    const myLikes = await Like.find({
      user: req.user._id,
      post: { $in: postIds },
    }).select("post");
    const myLikedPostIdsSet = new Set(myLikes.map((l) => l.post.toString()));

    // 4. Map the bulk data to the posts array
    const postWithCounts = posts.map((post) => {
      const postIdStr = post._id.toString();
      return {
        ...post.toObject(),
        LikeCount: likeCountsMap[postIdStr] || 0,
        CommentCount: commentCountsMap[postIdStr] || 0,
        likedByMe: myLikedPostIdsSet.has(postIdStr),
        comments: [], // Frontend loads comments dynamically on demand
      };
    });

    res.json({ success: true, posts: postWithCounts });
  } catch (error) {
    console.error("Failed to load feed:", error);
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
    res.status(500).json({ success: false, message: error.message || "Failed to create post" });
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

    if (!posts || posts.length === 0) {
      return res.json({ success: true, posts: [] });
    }

    const postIds = posts.map((p) => p._id);

    // 1. Fetch all like counts in a single bulk query
    const likeCounts = await Like.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const likeCountsMap = {};
    likeCounts.forEach((item) => {
      likeCountsMap[item._id.toString()] = item.count;
    });

    // 2. Fetch all comment counts in a single bulk query
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const commentCountsMap = {};
    commentCounts.forEach((item) => {
      commentCountsMap[item._id.toString()] = item.count;
    });

    // 3. Find which posts are liked by the current user in a single bulk query
    const myLikes = await Like.find({
      user: userId,
      post: { $in: postIds },
    }).select("post");
    const myLikedPostIdsSet = new Set(myLikes.map((l) => l.post.toString()));

    // 4. Map the bulk data to the posts array
    const postsWithExtras = posts.map((post) => {
      const postIdStr = post._id.toString();
      return {
        ...post.toObject(),
        LikeCount: likeCountsMap[postIdStr] || 0,
        CommentCount: commentCountsMap[postIdStr] || 0,
        likedByMe: myLikedPostIdsSet.has(postIdStr),
      };
    });

    res.json({ success: true, posts: postsWithExtras });
  } catch (error) {
    console.error("Failed to load following feed:", error);
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
