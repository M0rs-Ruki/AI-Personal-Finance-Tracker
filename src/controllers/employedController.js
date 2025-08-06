
import User from "../models/userModels.js";
import Employer from "../models/employedModels.js";
import mongoose from "mongoose";
import getAIAdvice from "../utils/cohere.js";
import { log } from "console";

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

    res.redirect("dashboards/employed");
  } catch (err) {
    console.error("Error saving employer data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



const EmployerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    const employer = await Employer.findOne({ userId: user._id });
    if (!employer) return res.status(404).send("Employer profile not found");

    const now = new Date();
    const isStale =
      !employer.aiAdviceGeneratedAt ||
      (now - employer.aiAdviceGeneratedAt) / (1000 * 60 * 60 * 24) > 7;

    if (!employer.aiAdvice || isStale) {
      const newAdvice = await getAIAdvice(user);
      employer.aiAdvice = newAdvice;
      employer.aiAdviceGeneratedAt = now;
      await employer.save();
    }

    res.render("dashboards/employed", { user, employer });
  } catch (err) {
    console.error("Error in EmployerDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

export { EmployerPage, EmployerDashboard };