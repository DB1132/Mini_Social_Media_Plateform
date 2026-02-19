const express = require('express');
const router = express.Router();
const {addComments, getComments} = require('../controllers/commentController');
const protect = require("../middleware/authmiddleware");

router.get("/:postId/comments",protect,getComments);
router.post("/:postId/comments",protect,addComments);

module.exports = router; 