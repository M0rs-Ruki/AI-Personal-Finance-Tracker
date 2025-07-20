import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import { log } from "console";

const StudentPage = async (req, res) => {
  try {
    const rawGoals = req.body.financialGoals || [];
    const financialGoals = rawGoals.map((goal) => ({
      name: goal.name?.trim(),
      goalAmount: parseFloat(goal.goalAmount || 0),
      targetDate: new Date(goal.targetDate),
    }));

    const {
      userId,
      educationLevel,
      institutionName,
      livingSituation,
      monthlyAllowance,
      isParentFunded,
      customCategories,
      summaryFrequency,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedCategories = (customCategories || []).map((cat) => ({
      name: cat.name.trim(),
      budgetLimit: parseFloat(cat.budgetLimit || 0),
    }));

    const newStudent = new Student({
      userId,
      educationLevel,
      institutionName,
      livingSituation,
      monthlyAllowance,
      isParentFunded,
      customCategories: formattedCategories,
      financialGoals: frequency ,
      summaryFrequency,
    });

    await newStudent.save();
    res.redirect("/user/deshboard");
  } catch (err) {
    console.error("Error during student page:", err);
    res.status(500).send("Internal Server Error");
  }
};


export { StudentPage };
