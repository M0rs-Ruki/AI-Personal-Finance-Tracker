
import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import { log } from "console";
import mongoose from "mongoose";
import getAIAdvice from "../utils/cohere.js";


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
    res.redirect("/dashboard/student");
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

const StudentDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).send("Invalid request: Missing user ID");
    }

    const [user, student] = await Promise.all([
      User.findById(userId),
      Student.findOne({ userId })
    ]);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!student) {
      return res.render("userType/student", { userId });
    }

    const now = new Date();
    const adviceIsStale =
      !student.aiAdviceGeneratedAt ||
      (now - student.aiAdviceGeneratedAt) / (1000 * 60 * 60 * 24) > 7;

      
    let advice = student.aiAdvice;

    if (!advice || adviceIsStale) {
      advice = await getAIAdvice(user);
      student.aiAdvice = advice;
      student.aiAdviceGeneratedAt = now;
      await student.save();
    }

    res.render("dashboards/student", {
      user,
      student,
      advice
    });

  } catch (err) {
    console.error("Error in StudentDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

export { StudentPage, UpdateStudentPage, StudentDashboard };