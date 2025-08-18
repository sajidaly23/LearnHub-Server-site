import mongoose, {Schema, Document} from "mongoose";


export interface IPayment extends Document{
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    stripeIntentId?:string;
    status: "pending" | "completed" | "failded";

}

const PaymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  stripeIntentId: { type: String },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);