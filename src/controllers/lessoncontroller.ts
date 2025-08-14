// controllers/lessoncontroller.ts
import { Request, Response } from "express";
import { Lesson } from "../models/lessonmodel";
import { success, fail } from "../utils/formatResponse";

// Create a lesson
export const createLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.create(req.body);
    return res.status(201).json(success(lesson, "Lesson created"));
  } catch (err: any) {
    return res.status(500).json(fail("Server error", err));
  }
};

// Get lessons by course ID
export const getLessonsByCourse = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    return res.status(200).json(success(lessons, "Lessons fetched"));
  } catch (err: any) {
    return res.status(500).json(fail("Server error", err));
  }
};

// Update a lesson
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(success(lesson, "Lesson updated"));
  } catch (err: any) {
    return res.status(500).json(fail("Server error", err));
  }
};

// Delete a lesson
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    return res.json(success(null, "Lesson deleted"));
  } catch (err: any) {
    return res.status(500).json(fail("Server error", err));
  }
};
