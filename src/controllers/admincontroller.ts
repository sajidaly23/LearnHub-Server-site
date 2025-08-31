import { Request, Response } from "express";
import { UserModel } from "../models/usermodel";
import { CourseModel } from "../models/coursemodel";

export const adminDashboard = async (_req: Request, res: Response) => {
  try {
    const totalStudents = await UserModel.countDocuments({ role: "student" });
    const totalInstructors = await UserModel.countDocuments({ role: "instructor" });
    const totalCourses = await CourseModel.countDocuments();

    return res.json({
      message: "Admin Dashboard Data",
      stats: {
        totalUsers: totalStudents + totalInstructors,
        totalStudents,
        totalInstructors,
        totalCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin dashboard", error });
  }
};
