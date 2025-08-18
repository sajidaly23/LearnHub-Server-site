import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
  otp?: string;
  otpExpiresAt?: Date;
  studentData?: {
    enrolledCourses: string[];
    progress: Record<string, number>;
  };
  instructorData?: {
    coursesCreated: string[];
    totalStudents: number;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
   password: { type: String, required: false },
    role: {
      type: String,
      enum: ["student", "instructor"],
      required: true,
    },

    // OTP fields
    otp: { type: String },
    otpExpiresAt: { type: Date },

    studentData: {
      enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      progress: {
        type: Map,
        of: Number,
      },
    },

    instructorData: {
      coursesCreated: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      totalStudents: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
