import User from "../models/userModels.js";
import { log } from "console";
import generateToken from "../utils/generateTokenUtlis.js";
import { hashPassword, comparePassword } from "../utils/bcryptPasswordUtlis.js";

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      currency,
      userType,
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
      userType,
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
    const userTypePage = `userType/${userType || "guest"}`;
    return res.render(userTypePage, { userId: newUser._id });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({
      message: "An error occurred while registering the user.",
    });
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

    // Redirect based on user type
    const userType = user.userType;
    return res.redirect(`/dashboard/${userType}`);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " Error operating during login user " });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Redirect to homepage or login
    res.redirect("/");
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).send("Error occurred during logout");
  }
};


export { registerUser, loginUser, logoutUser };