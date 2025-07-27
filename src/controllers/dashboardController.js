import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import GuestModel from "../models/guestUserModels.js";
import mongoose from "mongoose";
import Guest from "../models/guestModels.js";

import { log } from "console";

const StudentDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return res.status(404).send("Student profile not found");
    }

    res.render("dashboards/student", { user, student });
  } catch (err) {
    console.error("Error in StudentDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

const EmployerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const employer = await Employer.findOne({ userId: user._id });
    if (!employer) {
      return res.status(404).send("Employer profile not found");
    }

    res.render("dashboards/employed", { user, employer });
  } catch (err) {
    console.error("Error In EmployerDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

const UnEmployedDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const unemployed = await UnEmployed.findOne({ userId: user._id });
    if (!unemployed) {
      return res.status(404).send("UnEmployed profile not found");
    }
    res.render("dashboards/unemployed", { user, unemployed });
  } catch (err) {
    console.error("Error In UnEmployerDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

const RetiredDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const retired = await Retired.findOne({ userId: user._id });
    if (!retired) {
      return res.status(404).send("Retired profile not found");
    }
    res.render("dashboards/retired", { user, retired });
  } catch (err) {
    console.error("Error in RetiredDashboard:", err);
    res.status(500).send("Something went wrong.");
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
      return res.redirect("/dashboard"); // Already registered
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

export {
  StudentDashboard,
  EmployerDashboard,
  UnEmployedDashboard,
  RetiredDashboard,
  GuestUserDashboard,
};
