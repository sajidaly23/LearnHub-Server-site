// import { Request, Response} from "express";

import { Response } from 'express';
import { AuthRequest } from '../middelwares/authmiddelware'; // 👈 ye add kiya
import { createCheckoutSession } from '../services/stripeservice';
import { Payment } from '../models/paymentmodel';
import { formatResponse } from '../utils/formatResponse';

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const successUrl = `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.CLIENT_URL}/courses/${courseId}`;

    const session = await createCheckoutSession(courseId, successUrl, cancelUrl);

    // 👇 req.user ka type ab properly infer ho jayega
    const payment = await Payment.create({
      user: req.user?._id,
      course: courseId,
      stripeIntentId: session.id, // stripeSessionId ki jagah schema ke hisaab se
      amount: 0,
      status: 'pending'
    });

    res.json(formatResponse({ sessionId: session.id, url: session.url }, 'Session created'));
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
