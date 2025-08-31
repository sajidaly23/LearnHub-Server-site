import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { Payment } from "../models/paymentmodel";
import { Enrollment } from "../models/enrollmentmodel";
import { UserModel } from "../models/usermodel";
import { CourseModel } from "../models/coursemodel";
import { AuthRequest } from "../middelwares/authmiddelware";

// Create Checkout Session

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Course Enrollment" },
            unit_amount: 1000, // $10 example
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Save payment in DB
    const payment = await Payment.create({
      user: req.user?._id,
      course: courseId,
      amount: 10,
      currency: "usd",
      stripeIntentId: session.id,
      status: "pending",
    });

    // Return both payment info and Stripe session URL
    return res.json({
      payment,
      url: session.url, // <--- added for browser redirect
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating checkout session" });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId, status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    ).populate("user").populate("course");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    //  FIX ADDED: null check before accessing _id
    if (!payment.user || !payment.course) {
      return res.status(400).json({ message: "Invalid payment: user or course missing" });
    }

    if (status === "completed") {
      const existing = await Enrollment.findOne({
        student: (payment.user as any)._id || payment.user,
        course: (payment.course as any)._id || payment.course,
      });

      if (!existing) {
        const enrollment = await Enrollment.create({
          student: (payment.user as any)._id || payment.user,
          course: (payment.course as any)._id || payment.course,
          payment: payment._id,
          status: "active",
        });

        await UserModel.findByIdAndUpdate(
          (payment.user as any)._id || payment.user,
          { $push: { "studentData.enrolledCourses": (payment.course as any)._id || payment.course } }
        );

        await CourseModel.findByIdAndUpdate(
          (payment.course as any)._id || payment.course,
          { $inc: { totalStudents: 1 } }
        );

        return res.json({
          message: "Payment completed & Enrollment successful",
          payment,
          enrollment,
        });
      }
    }

    return res.json({ message: "Payment status updated", payment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating payment status" });
  }
};


// Confirm Payment

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const payment = await Payment.findOneAndUpdate(
      { stripeIntentId: sessionId },
      { status: session.payment_status === "paid" ? "completed" : "failed" },
      { new: true }
    ).populate("user").populate("course");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // FIX ADDED: check before accessing _id
    if (!payment.user || !payment.course) {
      return res.status(400).json({ message: "Invalid payment: user or course missing" });
    }

    if (session.payment_status === "paid") {
      const existing = await Enrollment.findOne({
        student: (payment.user as any)._id || payment.user,
        course: (payment.course as any)._id || payment.course,
      });

      if (!existing) {
        const enrollment = await Enrollment.create({
          student: (payment.user as any)._id || payment.user,
          course: (payment.course as any)._id || payment.course,
          payment: payment._id,
          status: "active",
        });

        await UserModel.findByIdAndUpdate(
          (payment.user as any)._id || payment.user,
          { $push: { "studentData.enrolledCourses": (payment.course as any)._id || payment.course } }
        );

        await CourseModel.findByIdAndUpdate(
          (payment.course as any)._id || payment.course,
          { $inc: { totalStudents: 1 } }
        );

        return res.json({
          message: "Payment confirmed & Enrollment successful",
          payment,
          enrollment,
        });
      }
    }

    return res.json({ message: "Payment confirmation processed", payment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error confirming payment" });
  }
};