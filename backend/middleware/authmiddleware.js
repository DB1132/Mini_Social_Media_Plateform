  const jwt = require("jsonwebtoken");
  const User = require("../models/Users");

  const protect = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        return res.redirect("/api/auth/login?error=Please login first");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();

    } catch (error) {
      return res.redirect("/api/auth/login?error=Invalid or expired token");
    }
  };

  module.exports = protect;
