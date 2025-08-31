import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profileImage?: string;
  otp?: string;
  otpExpiresAt?: Date;
  googleId?: string;
  studentData?: {
    enrolledCourses: mongoose.Types.ObjectId[];
  };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      required: true,
      default: "student",
    },
    profileImage: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    googleId: { type: String },

    // Ye naya field add karo
    studentData: {
      enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);



