import User from "../models/userModels.js";
import { count, log } from "console";
import generateToken from "../utils/generateTokenUtlis.js";
import { hashPassword, comparePassword } from "../utils/bcryptPasswordUtlis.js";
import Guest from "../models/guestModels.js";

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      currency,
      monthlyIncome,
      userType,
      notificationPreferences,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: passwordHash,
      phoneNumber,
      currency,
      monthlyIncome,
      userType,
      notificationPreferences,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirect/render based on user type
    const userTypePage = `userType/${userType || "other"}`;
    return res.render(userTypePage, { userId: newUser._id });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({
      message: "An error occurred while registering the user.",
    });
  }
};

const GuestUser = async (req, res) => {
  try {
    // Create a new guest user
    const newGuestUser = new Guest({
        fullName: 'Guest User',
        email: 'guest@user.com',
        password: 'guestpassword',
        phoneNumber: '1234567890',
        currency: 'INR',
        userType: 'guest',
    })

    await newGuestUser.save();
    res.redirect('/dashboard'); 

  } catch (err) {
    console.error('Error creating guest user:', err);
    res.status(500).json({ message: 'Error creating guest user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({
          message: "Email and Password are required fields are missing",
        });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      res.redirect("/login");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.cookie("token", token);
    // res.redirect('/user/deshboard'); for now

    // Redirect/render based on user type
    const userType = user.userType;
    const userTypePage = `userType/${userType || "other"}`;
    return res.render(userTypePage, { userId: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " Error operating during login user " });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: " Error operating during logout user " });
  }
};

export { registerUser, loginUser, logoutUser, GuestUser };