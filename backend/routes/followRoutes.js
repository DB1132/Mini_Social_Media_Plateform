const express = require("express");
const router = express.Router();
const {
  togglefollow,
  checkFollowStatus,
  followCount,
  followerList,
  followingList
} = require("../controllers/followControler");
const protect = require("../middleware/authmiddleware");

router.post("/:id/follow", protect, togglefollow);
router.get("/:id/follow-status", protect, checkFollowStatus);
router.get("/:id/follow-count", protect, followCount);
router.get("/:id/followers", protect, followerList);
router.get("/:id/following", protect, followingList);

module.exports = router;
