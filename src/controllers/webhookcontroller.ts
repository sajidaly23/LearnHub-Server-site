// import { Request, Response } from "express";
// import { stripe } from "../utils/stripe";
// import { Payment } from "../models/paymentmodel";
// import { ENV } from "../utils/env";

// export const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string;

//   let event;
//   try {
//     // Stripe webhook verify karega
//     event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
//   } catch (err: any) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as any;

//       // Jo session aapne createSession mai banaya tha
//       // ussi stripeIntentId ko find karke update karna hai
//       await Payment.findOneAndUpdate(
//         { stripeIntentId: session.id },
//         {
//           status: "paid",
//           amount: session.amount_total ? session.amount_total / 100 : 0, // Stripe paisa cents mai deta hai
//         }
//       );

//       console.log(" Payment successful & updated in DB");
//       break;
//     }

//     case "checkout.session.expired": {
//       const session = event.data.object as any;

//       await Payment.findOneAndUpdate(
//         { stripeIntentId: session.id },
//         { status: "expired" }
//       );

//       console.log(" Payment expired");
//       break;
//     }

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// };
