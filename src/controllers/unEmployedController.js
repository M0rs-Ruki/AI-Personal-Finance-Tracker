
import User from "../models/userModels.js";
import UnEmployed from "../models/unemployedModels.js";
import mongoose from "mongoose";
import { log } from "console";

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

export { UnEmployedPage, UnEmployedDashboard };