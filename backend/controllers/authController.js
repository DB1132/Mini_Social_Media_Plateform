const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generatetoken");

// =======================
// REGISTER USER
// =======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.redirect(
        "/api/auth/register?error=User already exists"
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = generateToken(newUser._id);

    // set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // true in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // redirect to app
    return res.redirect("/app/feed");

  } catch (error) {
    console.error(error);
    return res.redirect(
      "/api/auth/register?error=Error registering user"
    );
  }
};

// =======================
// LOGIN USER
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.redirect(
        "/api/auth/login?error=Invalid email or password"
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return res.redirect(
        "/api/auth/login?error=Invalid email or password"
      );
    }

    const token = generateToken(existingUser._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/app/feed");

  } catch (error) {
    console.error(error);
    return res.redirect(
      "/api/auth/login?error=Error logging in"
    );
  }
};

module.exports = { registerUser, loginUser };
