import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import GuestModel from "../models/guestUserModels.js";
import { log } from "console";

const StudentDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return res.status(404).send("Student profile not found");
    }

    res.render("dashboards/student", { user, student });
  } catch (err) {
    console.error("Error in StudentDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

const EmployerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const employer = await Employer.findOne({ userId: user._id });
    if (!employer) {
      return res.status(404).send("Employer profile not found");
    }

    res.render("dashboards/employed", { user, employer });
  } catch (err) {
    console.error("Error In EmployerDashboard:", err);
    res.status(500).send("Something went wrong.");
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

const RetiredDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const retired = await Retired.findOne({ userId: user._id });
    if (!retired) {
      return res.status(404).send("Retired profile not found");
    }
    res.render("dashboards/retired", { user, retired });
  } catch (err) {
    console.error("Error in RetiredDashboard:", err);
    res.status(500).send("Something went wrong.");
  }
};

// const GuestDashboard = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//         return res.status(404).send("User not found");
//     }
//     const guest = await GuestModel.findOne({ userId: user._id });
//     if (!guest) {
//         return res.status(404).send("Guest profile not found");
//     }
//     res.render("dashboards/guest", { user, guest });
//   } catch (err) {
//     console.error("Error In The Guest: ", err);
//     res.status(500).send("Something went wrong.");
//   }
// };

export {
  StudentDashboard,
  EmployerDashboard,
  UnEmployedDashboard,
  RetiredDashboard,
};
