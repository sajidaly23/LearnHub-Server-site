// import { Request, Response } from 'express';
// import { CourseModel } from "../models/coursemodel";
// import { formatResponse } from '../utils/formatResponse';

// export const createCourse = async (req: any, res: Response) => {
//   const { title, description, price } = req.body;
//   const course = await CourseModel.create({ title, description, price, instructor: req.user._id });
//   res.json(formatResponse(course, 'Course created'));
// };

// export const listCourses = async (req: Request, res: Response) => {
//   const courses = await CourseModel.find().populate('instructor', 'name email');
//   res.json(formatResponse(courses, 'Courses'));
// };

// export const getCourse = async (req: Request, res: Response) => {
//   const course = await CourseModel.findById(req.params.id).populate('lessons').populate('instructor', 'name email');
//   res.json(formatResponse(course, 'Course'));
// };

// export const updateCourse = async (req: any, res: Response) => {
//   const course = await CourseModel.findById(req.params.id);
//   if (!course) return res.status(404).json({ message: 'Course not found' });
//   if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
//   Object.assign(course, req.body);
//   await course.save();
//   res.json(formatResponse(course, 'Updated'));
// };

// export const deleteCourse = async (req: any, res: Response) => {
//   const course = await CourseModel.findById(req.params.id);
//   if (!course) return res.status(404).json({ message: 'Course not found' });
//   if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
//   await course.remove();
//   res.json(formatResponse(null, 'Deleted'));
// };
