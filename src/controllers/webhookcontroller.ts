import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { Payment } from "../models/paymentmodel";
import { ENV } from "../utils/env";

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(" Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;

      await Payment.findOneAndUpdate(
        { stripeIntentId: session.id }, // same id as stored during createSession
        {
          status: "completed",
          amount: session.amount_total ? session.amount_total / 100 : 0,
          updatedAt: new Date(),
        }
      );

      console.log(" Payment successful & updated in DB:", session.id);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as any;

      await Payment.findOneAndUpdate(
        { stripeIntentId: session.id },
        { status: "expired", updatedAt: new Date() }
      );

      console.log("⚠️ Payment expired:", session.id);
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
