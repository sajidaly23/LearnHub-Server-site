import { Request, Response } from "express";
import { Enrollment } from "../models/enrollmentmodel";
import { Payment } from "../models/paymentmodel";
import { UserModel } from "../models/usermodel";
import { CourseModel } from "../models/coursemodel";

//  ENROLL COURSE
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId).populate("user course");
    if (!payment || payment.status !== "completed") {
      return res.status(400).json({ message: "Payment not valid" });
    }

    const existing = await Enrollment.findOne({
      student: payment.user,
      course: payment.course,
    });
 
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: payment.user,
      course: payment.course,
      payment: payment._id,
      status: "active",
    });

    await UserModel.findByIdAndUpdate(payment.user, {
      $push: { "studentData.enrolledCourses": payment.course },
    });

    await CourseModel.findByIdAndUpdate(payment.course, {
      $inc: { totalStudents: 1 },
    });

    return res.status(200).json({ message: "Enrollment successful", enrollment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  GET ALL ENROLLMENTS (Admin)
export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "title price");
    res.json({ message: "All enrollments fetched", enrollments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  GET STUDENT ENROLLMENTS (only courses student enrolled in)
export const getStudentEnrollments = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course", "title description price");
    res.json({ message: "Student enrollments fetched", enrollments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CHECK IF STUDENT IS ENROLLED IN A SPECIFIC COURSE
export const checkEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId } = req.params;
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.json({ enrolled: false });
    }
    res.json({ enrolled: true, enrollment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  DELETE ENROLLMENT (Admin or Student leave course)
export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const { enrollmentId } = req.params;
    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    } 

    // StudentData aur Course counter update bhi karna hoga
    await UserModel.findByIdAndUpdate(enrollment.student, {
      $pull: { "studentData.enrolledCourses": enrollment.course },
    });

    await CourseModel.findByIdAndUpdate(enrollment.course, {
      $inc: { totalStudents: -1 },
    });

    res.json({ message: "Enrollment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
