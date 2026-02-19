const follow = require("../models/Follow");

const togglefollow = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    if (followerId.toString() === followingId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const exist = await follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (exist) {
      await exist.deleteOne();
      return res.status(200).json({ message: "Unfollowed successfully" });
    }

    await follow.create({
      follower: followerId,
      following: followingId,
    });

    res.json({ followed: true });
  } catch (error) {
    res.status(500).json({ message: "Follow failed" });
  }
};

const checkFollowStatus = async (req, res) => {
  const followerId = req.user._id;
  const followingId = req.params.id;

  const isFollowing = await follow.exists({
    follower: followerId,
    following: followingId,
  });

  res.json({ following: !!isFollowing });
};

const followCount = async (req, res) => {
  const id = req.params.id;

  const followersCount = await follow.countDocuments({
    following: id,
  });
  const followingCount = await follow.countDocuments({
    follower: id,
  });

  res.json({
    followersCount,
    followingCount,
  });
};

const followerList = async (req, res) => {
  const user = req.params.id;

  const followers = await follow
    .find({ following: user })
    .populate("follower", "name");
  res.json({
    success: true,
    users: followers.map((f) => ({
      _id: f.follower._id,
      name: f.follower.name,
    })),
  });
};

const followingList = async (req, res) => {
  const userid = req.params.id;

  const following = await follow
    .find({ follower: userid })
    .populate("following", "name");

  res.json({
    success: true,
    users: following.map((f) => ({
      _id: f.following._id,
      name: f.following.name,
    })),
  });
};
module.exports = {
  togglefollow,
  checkFollowStatus,
  followCount,
  followerList,
  followingList,
};
