const express = require("express");
const { getMe, getUserById, setBio } = require("../controllers/userController");
const router = express.Router();
const protect = require("../middleware/authmiddleware");

router.get("/me", protect, getMe);
router.get("/:id", protect, getUserById);
router.put("/me/bio", protect, setBio);


module.exports = router;
