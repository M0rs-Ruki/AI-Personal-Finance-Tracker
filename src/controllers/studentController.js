
import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
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
      ? rawGoals.map((goal) => ({
          name: goal.name?.trim(),
          goalAmount: parseFloat(goal.goalAmount || 0),
          savedAmount: parseFloat(goal.savedAmount || 0),
          targetDate: new Date(goal.targetDate),
        }))
      : [];

    // Parse budget categories safely
    const rawCategories = req.body.customCategories || [];
    const parsedCategories = Array.isArray(rawCategories)
      ? rawCategories.map((cat) => ({
          name: cat.name?.trim(),
          budgetLimit: parseFloat(cat.budgetLimit || 0),
          actualSpent: parseFloat(cat.actualSpent || 0),
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

const UpdateStudentPage = async (req, res) => {
  try {
    const userId = req.body.userId?.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newGoals = req.body.financialGoals || [];
    const parsedGoals = Array.isArray(newGoals)
      ? newGoals.map((goal) => ({
          name: goal.name?.trim(),
          goalAmount: parseFloat(goal.goalAmount || 0),
          savedAmount: parseFloat(goal.savedAmount || 0),
          targetDate: new Date(goal.targetDate),
        }))
      : [];

    const newCategories = req.body.customCategories || [];
    const parsedCategories = Array.isArray(newCategories)
      ? newCategories.map((cat) => ({
          name: cat.name?.trim(),
          budgetLimit: parseFloat(cat.budgetLimit || 0),
          actualSpent: parseFloat(cat.actualSpent || 0),
        }))
      : [];

    // ✅ Append new items to existing arrays instead of overwriting
    if (parsedGoals.length > 0) {
      student.financialGoals.push(...parsedGoals);
    }

    if (parsedCategories.length > 0) {
      student.customCategories.push(...parsedCategories);
    }

    await student.save();
    res.redirect("/dashboard/student");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


export { StudentPage, UpdateStudentPage };