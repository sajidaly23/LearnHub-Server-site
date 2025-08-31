import { Response } from "express";
import { Enrollment } from "../models/enrollmentmodel";
import { AuthRequest } from "../middelwares/authmiddelware";

export const studentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user?._id })
      .populate("course", "title description price instructor")
      .populate("student", "name email");

    return res.json({
      message: "Student dashboard data fetched",
      data: {
        totalEnrollments: enrollments.length,
        enrollments,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching student dashboard", error });
  }
};
