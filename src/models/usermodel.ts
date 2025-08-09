import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document{
 name: string;
 email: string;
 password: string;
 role: "student" | "instructor" | "admin";
}

const userSchema = new Schema<IUser>(
    {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role:{
        type: String,
        enum: ["student", "instructor","admin"],
        default: "student",
    },
    
    },
);
export const UserModel = mongoose.model<IUser>("User", userSchema)