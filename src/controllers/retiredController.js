import User from "../models/userModels.js";
import Retired from "../models/retiredModels.js";
import getAIAdvice from "../utils/cohere.js";
import { log } from "console";
import mongoose from "mongoose";



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

    // log(req.body.savingsGoals);

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
};



const RetiredDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    const retired = await Retired.findOne({ userId: user._id });
    if (!retired) return res.status(404).send("Retired profile not found");

    const now = new Date();
    const adviceIsStale =
      !retired.aiAdviceGeneratedAt ||
      (now - retired.aiAdviceGeneratedAt) / (1000 * 60 * 60 * 24) > 7;

    let advice = retired.aiAdvice;
    if (!advice || adviceIsStale) {
      advice = await getAIAdvice(user);
      retired.aiAdvice = advice;
      retired.aiAdviceGeneratedAt = now;
      await retired.save();
    }
  
    res.render("dashboards/retired", { user, retired });

  } catch (err) {
    console.error("Error in RetiredDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};


export { RetiredPage, RetiredDashboard };
