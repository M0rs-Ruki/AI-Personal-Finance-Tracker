
import GuestModel from "../models/guestUserModels.js";
import mongoose from "mongoose";
import Guest from "../models/guestModels.js";
import generateToken from "../utils/generateTokenUtlis.js";
import { log } from "console";

const GuestUser = async (req, res) => {
  try {
    // Create a new guest user
    const randomId = Date.now();
    const newGuestUser = new Guest({
        fullName: 'Guest User',
        email: `guest${randomId}@user.com`,
        password: 'guestpassword',
        phoneNumber: '1234567890',
        currency: 'INR',
        userType: 'guest',
    })

    await newGuestUser.save();

    const token = generateToken(newGuestUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    const userId = newGuestUser._id;
    res.render('userType/guest', { userId })
    // log(userId)

  } catch (err) {
    console.error('Error creating guest user:', err);
    res.status(500).json({ message: 'Error creating guest user' });
  }
};

const parseGroupedFieldsToArray = (group) => {
  if (!group || typeof group !== 'object') return [];

  const keys = Object.keys(group);
  const length = Math.max(...keys.map(k => (Array.isArray(group[k]) ? group[k].length : 1)));

  const result = [];
  for (let i = 0; i < length; i++) {
    const item = {};
    for (const key of keys) {
      item[key] = Array.isArray(group[key]) ? group[key][i] : group[key];
    }
    result.push(item);
  }
  return result;
};

const GuestUserDashboard = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();
    const user = await Guest.findById(req.body.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    // Check if guest already exists
    const existingGuest = await GuestModel.findOne({ userId });
    if (existingGuest) {
      return res.render("dashboards/guest", { user, guest: existingGuest });
    }

    // Parse financial goals
    let financialGoals = [];
    if (Array.isArray(req.body.financialGoal)) {
      financialGoals = req.body.financialGoal;
    } else if (typeof req.body.financialGoal === 'object') {
      financialGoals = parseGroupedFieldsToArray(req.body.financialGoal);
    }

    // Create new guest
    const newGuest = new GuestModel({
      userId,
      currentStatus: req.body.currentStatus,
      monthlyIncome: parseFloat(req.body.monthlyIncome || 0),
      financialGoal: financialGoals.map(goal => ({
        name: goal.name,
        targetAmount: parseFloat(goal.targetAmount || 0),
        currentAmount: parseFloat(goal.currentAmount || 0),
        priority: ['high', 'medium', 'low'].includes(goal.priority)
          ? goal.priority
          : 'medium'
      })),
      summaryFrequency: ['weekly', 'monthly', 'never'].includes(req.body.summaryFrequency)
        ? req.body.summaryFrequency
        : 'weekly',
      helpPreferences: Array.isArray(req.body.helpPreferences)
        ? req.body.helpPreferences
        : [req.body.helpPreferences].filter(Boolean)
    });

    await newGuest.save();
    res.render("dashboards/guest", { user, guest: newGuest });


  } catch (err) {
    console.error("Error in GuestUserPage:", err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
};

export { GuestUserDashboard, GuestUser };
