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
    const parsedHasBonuses = hasBonuses === 'true' || false;

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

    res.redirect("/user/dashboard");

  } catch (err) {
    console.error("Error saving employer data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { StudentPage, EmployerPage };
