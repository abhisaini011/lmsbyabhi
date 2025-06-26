import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.userFullName || !req.body.email || !req.body.password) {
      return res.status(400).json("Full Name, Email, and Password are required");
    }
    // Check for existing user (by email)
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json("Email already registered");
    }
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newuser = new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPassword, // Store hashed password
      isAdmin: req.body.isAdmin,
    });
    const user = await newuser.save();
    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    console.log(err);
    res.status(500).json("Registration failed");
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user = req.body.admissionId
      ? await User.findOne({
          admissionId: req.body.admissionId,
        })
      : await User.findOne({
          employeeId: req.body.employeeId,
        });

    console.log(user, "user");

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Use bcrypt to compare password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong Password");
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("Login failed");
  }
});

export default router;

