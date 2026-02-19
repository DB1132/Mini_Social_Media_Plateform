const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");


router.get("/login",(req,res)=>{
    res.render("auth/login", { query: req.query });
});

router.get("/register",(req,res)=>{
    res.render("auth/register", { query: req.query });  
});

router.post("/register",registerUser);
router.post("/login",loginUser);

router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/api/auth/login?success=Logged out successfully");
});

module.exports = router;
