import { Request, Response } from "express";
import { CourseModel } from "../models/coursemodel";
import { Enrollment } from "../models/enrollmentmodel";
import { Lesson } from "../models/lessonmodel";
import { AuthRequest } from "../middelwares/authmiddelware";

export const instructorDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // get all courses of instructor
    const courses = await CourseModel.find({ instructor: req.user?._id });

    // course IDs
    const courseIds = courses.map((c) => c._id);

    // total students (unique students enrolled in instructor's courses)
    const students = await Enrollment.distinct("student", {
      course: { $in: courseIds },
      status: "active",
    });

    // total lessons in instructor's courses
    const totalLessons = await Lesson.countDocuments({
      course: { $in: courseIds },
    });

    res.json({
      message: "Instructor dashboard data fetched",
      data: {
        totalCourses: courses.length,
        totalStudents: students.length,
        totalLessons,
        courses,
      }, 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard", error: err });
  }
};
