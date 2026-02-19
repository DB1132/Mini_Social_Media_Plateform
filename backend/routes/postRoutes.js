const express = require("express");
const router = express.Router();
const {
  getPostDetails,
  createPost,
  getMyPost,
  getUserPost,
  deletePost,
  getFollowingFeed
} = require("../controllers/postController");
const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/upload")
 

router.get("/feed", protect, getPostDetails);
router.get("/feed/following", protect, getFollowingFeed);
router.get("/me", protect, getMyPost);
router.get("/user/me", protect, getMyPost);
router.get("/user/:id", protect, getUserPost);
router.get("/:id", protect, getUserPost);
router.delete("/:id", protect, deletePost);
router.post("/", protect, upload.single("image"), createPost);



module.exports = router;
