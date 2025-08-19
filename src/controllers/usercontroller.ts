import { Request, Response } from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/usermodel";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

//REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let studentData = undefined;
    let instructorData = undefined;

    if (role === "student") {
      studentData = { enrolledCourses: [], progress: {} };
    } else if (role === "instructor") {
      instructorData = { coursesCreated: [], totalStudents: 0 };
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      studentData,
      instructorData,
    });

    const userResponse = newUser.toObject();
    delete (userResponse as any).password; // password remove kar do

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User is logged in",
      token,
      user: { id: user._id, email: user.email, role:user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};



export const forgotPasswordAndSendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      message: "user fetching successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("error fetching user", error);
    return res.status(500).json({ message: "internal server error", error });
  }
};




export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const updateUser = async (req: Request, res: Response) => {
  try {
    const UserId = req.params.Id;
    const { name, email, password } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}`
      : undefined;

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (image) updateFields.image = image;

    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashPassword;
    }


    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: UserId },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "user not found " });
    }

    return res.status(200).json({
      message: "user update successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("error updating user ", error);
    return res.status(500).json({ message: "internal server error" });
  }
};



export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserModel.deleteMany({});
    res.status(200).json({
      message: "All users deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete All Users Error:", error);
    res.status(500).json({ message: "Failed to delete users" });
  }
};





export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Google token missing" });

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token" });

    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Create new user
      user = await UserModel.create({
        name,
        email,
        password: "", // empty string, no password
        role: "student", // default role
        profileImage: picture,
      });
    }

    // JWT generation
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Only send safe fields to frontend
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
     
    };

    return res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: safeUser,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};