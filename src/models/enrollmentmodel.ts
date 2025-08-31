import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId;
  status: "active" | "cancelled" | "pending";
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model<IEnrollment>(
  "Enrollment",
  enrollmentSchema
);
