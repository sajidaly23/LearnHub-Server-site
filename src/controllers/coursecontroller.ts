import { Request, Response } from "express";
import { CourseModel } from "../models/coursemodel";
import { formatResponse } from "../utils/formatResponse";
import { AuthRequest } from "../middelwares/authmiddelware";

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "instructor" && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Only instructor or admin can create courses" });
    }

    const { title, description, price, category } = req.body;

    const newCourse = await CourseModel.create({
      title,
      description,
      price,
      category,
      instructor: req.user._id,   // yaha token wala user add ho raha hai
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating course", error: err });
  }
};

  export const listCourses = async (req: Request, res: Response) => {
  try {
    const courses = await CourseModel.find().populate("instructor", "name email");
    return res.status(200).json(formatResponse(courses, "Courses fetched successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const course = await CourseModel.findById(req.params.id)
      .populate("lessons")
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(formatResponse(course, "Course fetched successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructor.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({ message: "You are not allowed to update this course" });
    }

    Object.assign(course, req.body);
    await course.save();

    return res.status(200).json(formatResponse(course, "Course updated successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}; 