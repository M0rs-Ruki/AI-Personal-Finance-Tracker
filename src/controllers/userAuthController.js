import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import { log } from "console";
import mongoose from "mongoose";

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
      ? rawGoals.map(goal => ({
          name: goal.name?.trim(),
          goalAmount: parseFloat(goal.goalAmount || 0),
          targetDate: new Date(goal.targetDate),
        }))
      : [];

    // Parse budget categories safely
    const rawCategories = req.body.customCategories || [];
    const parsedCategories = Array.isArray(rawCategories)
      ? rawCategories.map(cat => ({
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
    res.redirect("/user/deshboard");
    log(newStudent)

  } catch (err) {
    console.error("Error during student page:", err);
    res.status(500).send("Internal Server Error");
  }
};


const EmployerPage = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID Format in EmployerPage" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not Found in EmployerPage" });
    }

 
    const jobTitle = req.body.jobTitle;
    const employmentType = req.body.employmentType;
    const company = req.body.company;
    const workIndustry = req.body.industry;
    const workLocation = req.body.location;
    const monthlySalary = parseFloat(req.body.salary) || 0;
    const payFrequency = req.body.payFrequency;
    const hasBonuses = !!req.body.hasBonuses;
    
    // bonus details
    let bonusDetails = null;
    if (hasBonuses) {
      bonusDetails = {
        amount: parseFloat(req.body['bonusDetails[amount]']) || 0,
        frequency: req.body['bonusDetails[frequency]'],
        lastReceived: req.body['bonusDetails[lastReceived]']
      };
    }

    // convert object to array
    const additionalIncomeSources = req.body.additionalIncomeSources 
      ? Object.values(req.body.additionalIncomeSources) 
      : [];

    // Process
    const fixedExpenses = req.body.fixedExpenses
      ? Object.values(req.body.fixedExpenses).map(e => ({
          category: e.category,
          amount: parseFloat(e.amount) || 0,
          dueDate: parseInt(e.dueDate) || 1
        }))
      : [];

    // Process budget limits
    const budgetLimits = req.body.budgetLimits
      ? Object.values(req.body.budgetLimits).map(b => ({
          category: b.category,
          limit: parseFloat(b.limit) || 0
        }))
      : [];

    // Process financial goals
    const financialGoals = req.body.financialGoals
      ? Object.values(req.body.financialGoals).map(g => ({
          name: g.name,
          priority: g.priority,
          targetAmount: parseFloat(g.targetAmount) || 0,
          targetDate: g.targetDate,
          currentProgress: parseFloat(g.currentProgress) || 0
        }))
      : [];

    // Handle investment interests
    const investmentInterests = Array.isArray(req.body.investmentInterests)
      ? req.body.investmentInterests
      : [req.body.investmentInterests].filter(Boolean);

    // Create the new employer
    const newEmployer = new Employer({
      userId,
      jobTitle,
      employmentType,
      company,
      workIndustry,
      workLocation,
      monthlySalary,
      payFrequency,
      additionalIncomeSources,
      hasBonuses,
      bonusDetails,
      fixedExpenses,
      budgetLimits,
      financialGoals,
      summaryFrequency: req.body.summaryFrequency,
      investmentPreferences: {
        riskTolerance: req.body.riskTolerance || 'medium',
        interests: investmentInterests,
        experienceLevel: req.body.experienceLevel || 'beginner'
      }
    });

    await newEmployer.save();
    res.redirect("/user/dashboard");

  } catch (err) {
    console.error("Error saving employer data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { StudentPage, EmployerPage };
