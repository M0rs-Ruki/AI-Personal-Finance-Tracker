import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import { log } from "console";
import mongoose from "mongoose";
import GuestModel from "../models/guestUserModels.js";
import Guest from "../models/guestModels.js";

const StudentPage = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse financial goals safely
    const rawGoals = req.body.financialGoals || [];
    const parsedGoals = Array.isArray(rawGoals)
      ? rawGoals.map((goal) => ({
          name: goal.name?.trim(),
          goalAmount: parseFloat(goal.goalAmount || 0),
          targetDate: new Date(goal.targetDate),
        }))
      : [];

    // Parse budget categories safely
    const rawCategories = req.body.customCategories || [];
    const parsedCategories = Array.isArray(rawCategories)
      ? rawCategories.map((cat) => ({
          name: cat.name?.trim(),
          budgetLimit: parseFloat(cat.budgetLimit || 0),
        }))
      : [];

    const newStudent = new Student({
      userId: req.body.userId,
      educationLevel: req.body.education,
      institutionName: req.body.institution,
      livingSituation: req.body.accommodation,
      monthlyAllowance: parseFloat(req.body.allowance || 0),
      isParentFunded: req.body.funding,
      customCategories: parsedCategories,
      financialGoals: parsedGoals,
      summaryFrequency: req.body.frequency,
    });

    await newStudent.save();
    res.redirect("/dashboard");
    // log(newStudent);
  } catch (err) {
    console.error("Error during student page:", err);
    res.status(500).send("Internal Server Error");
  }
};

const EmployerPage = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID Format in EmployerPage" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not Found in EmployerPage" });
    }

    const {
      jobTitle,
      employmentType,
      company,
      workIndustry,
      workLocation,
      monthlySalary,
      payFrequency,
      hasBonuses,
      bonusDetails,
      additionalIncomeSources,
      fixedExpenses,
      budgetLimits,
      financialGoals,
      summaryFrequency,
      investmentPreferences,
    } = req.body;

    // Convert hasBonuses to Boolean
    const parsedHasBonuses = hasBonuses === "true" || false;

    // Only include bonusDetails if hasBonuses is true AND bonus amount is provided
    let cleanedBonusDetails = undefined;
    if (parsedHasBonuses && bonusDetails?.amount) {
      cleanedBonusDetails = {
        amount: parseFloat(bonusDetails.amount),
        frequency: bonusDetails.frequency,
        lastReceived: bonusDetails.lastReceived,
      };
    }

    const employerData = {
      userId,
      jobTitle,
      employmentType,
      company,
      workIndustry,
      workLocation,
      monthlySalary: parseFloat(monthlySalary),
      payFrequency,
      hasBonuses: parsedHasBonuses,
      bonusDetails: cleanedBonusDetails,
      additionalIncomeSources,
      fixedExpenses,
      budgetLimits,
      financialGoals,
      summaryFrequency,
      investmentPreferences: {
        riskTolerance: investmentPreferences?.riskTolerance,
        interestedIn: investmentPreferences?.interestedIn,
        experienceLevel: investmentPreferences?.experienceLevel,
      },
    };

    const newEmployer = new Employer(employerData);
    await newEmployer.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error saving employer data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const UnEmployedPage = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate profile
    const existing = await UnEmployed.findOne({ userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Profile already exists for this user" });
    }

    const newUnEmployed = new UnEmployed({
      userId,
      employmentStatus: req.body.employmentStatus || "actively-seeking",
      lastJobDetails: req.body.lastJobDetails || {},
      currentIncome: parseFloat(req.body.currentIncome || 0),
      incomeSources: Array.isArray(req.body.incomeSources)
        ? req.body.incomeSources
        : [],
      savingsDetails: req.body.savingsDetails || {},
      regularExpenses: Array.isArray(req.body.regularExpenses)
        ? req.body.regularExpenses
        : [],
      budgetLimits: Array.isArray(req.body.budgetLimits)
        ? req.body.budgetLimits
        : [],
      financialGoals: Array.isArray(req.body.financialGoals)
        ? req.body.financialGoals
        : [],
      jobSearchDetails: req.body.jobSearchDetails || {},
      summaryFrequency: req.body.summaryFrequency || "weekly",
      supportResources: req.body.supportResources || {},

      // Add newly introduced //
      debt: req.body.debt || {},
      comfortBudget: parseFloat(req.body.comfortBudget || 0),
      runwayEstimate: parseFloat(req.body.runwayEstimate || 0),
      livingSituation: req.body.livingSituation || "with-family",
      hasDependents: req.body.hasDependents === "true",
      dependentsCount: parseInt(req.body.dependentsCount || 0),
      gigInterest: req.body.gigInterest || "somewhat",
      hasTools: req.body.hasTools === "true",
      willingToRelocate: req.body.willingToRelocate === "true",
      goalPriority: req.body.goalPriority || "build-emergency-fund",
    });

    await newUnEmployed.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error in UnEmployedPage:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const RetiredPage = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    log(req.body.savingsGoals)

    const newRetired = new Retired({
      userId,
      pension: req.body.pension || {},
      otherIncomeSources: Array.isArray(req.body.otherIncomeSources)
        ? req.body.otherIncomeSources
        : [],
      retirementAccountWithdrawals: Array.isArray(
        req.body.retirementAccountWithdrawals
      )
        ? req.body.retirementAccountWithdrawals
        : [],
      housing: req.body.housing || {},
      healthcare: req.body.healthcare || {},
      otherExpenses: Array.isArray(req.body.otherExpenses)
        ? req.body.otherExpenses
        : [],
      otherAssets: Array.isArray(req.body.otherAssets)
        ? req.body.otherAssets
        : [],
      retirementAccounts: Array.isArray(req.body.retirementAccounts)
        ? req.body.retirementAccounts
        : [],
      savingsGoals: Array.isArray(req.body.savingsGoals)
        ? req.body.savingsGoals
        : [],
      legacyPlanning: req.body.legacyPlanning || {},
    });

    await newRetired.save();
    // log(newRetired.savingsGoals)
    res.redirect("/dashboard");

  } catch (err) {
    console.error("Error in RetiredPage:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


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

const GuestUserPage = async (req, res) => {
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

export { StudentPage, EmployerPage, UnEmployedPage, RetiredPage, GuestUserPage };
