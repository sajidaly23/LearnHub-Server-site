import { Request, Response } from "express";
import { CourseModel } from "../models/coursemodel";
import { formatResponse } from "../utils/formatResponse";
import { AuthRequest } from "../middelwares/authmiddelware";

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    console.log("User from req:", req.user);
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Title, description, and price are required" });
    }

    // Uploaded files paths
    const thumbnailPath = req.files && (req.files as any).thumbnail ? (req.files as any).thumbnail[0].path : null;
    const documentPath = req.files && (req.files as any).document ? (req.files as any).document[0].path : null;
    const videoPath = req.files && (req.files as any).video ? (req.files as any).video[0].path : null;

    const course = await CourseModel.create({
      title,
      description,
      price,
      instructor: req.user?._id,
      thumbnail: thumbnailPath,
      document: documentPath,
      video: videoPath
    });

    return res.status(201).json(formatResponse(course, "Course created successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
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