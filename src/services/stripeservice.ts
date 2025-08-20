import { stripe } from "../utils/stripe";
import { CourseModel } from "../models/coursemodel";
import mongoose from "mongoose";

export const createCheckoutSession = async (
  courseId: string,
  successUrl: string,
  cancelUrl: string
) => {
  let course = await CourseModel.findById(courseId);

  // 🔹 Agar course exist nahi karta to ek test course create kar lo
  if (!course) {
    console.warn(" Course not found. Creating a test course...");

    course = await CourseModel.create({
      title: "Test Course",
      description: "Auto-created test course for payment testing",
      price: 100,
      instructor: new mongoose.Types.ObjectId(), // fake instructor for testing
      category: "Testing",
      published: true,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.description,
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
};
