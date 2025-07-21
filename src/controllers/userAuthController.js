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
      return res.status(400).json({ message: "Invalid user ID format in EmployerPage" });
    }

    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).json({ message: "User not found in EmployerPage" });
    }

    // log(req.body.jobTitle)
    const hasBonuses = req.body.hasBonuses === 'on';

    const newEmployer = new Employer({
      userId: req.body.userId,
      jobTitle: req.body.job-title,
      employmentType: req.body.employment-type,
      company: req.body.company,
      workIndustry: req.body.industry,
      workLocation: req.body.location,
      monthlySalary: req.body.salary,
      payFrequency: req.body.pay-frequency, 
      additionalIncomeSources: req.body.additionalIncomeSources,
      hasBonuses: req.body.hasBonuses,
      bonusDetails: hasBonuses ? {
        amount: req.body.bonusDetails?.amount,
        frequency: req.body.bonusDetails?.frequency,
        lastReceived: req.body.bonusDetails?.lastReceived,
      } : undefined,
      fixedExpenses,
      budgetLimits,
      financialGoals,
      summaryFrequency,
      investmentPreferences,
    })
    await newEmployer.save();
    res.redirect("/user/deshboard");
    // log(newEmployer)
    log(newEmployer.jobTitle)

  } catch (err) {
    console.error("Error during employer page:", err);
    res.status(500).send("Internal Server Error IN EmployerPage");
  }
}


export { StudentPage, EmployerPage };
