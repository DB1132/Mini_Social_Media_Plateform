const express = require('express');
const { toggleLike } = require('../controllers/likeController');
const protect = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/:postId/like", protect, toggleLike);

module.exports = router;