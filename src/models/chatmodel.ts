import mongoose, { Schema, Document } from "mongoose";


export interface IChatMessage extends Document {
sender: mongoose.Types.ObjectId; // current user
receiver: mongoose.Types.ObjectId; // other user
course: mongoose.Types.ObjectId; // course context (for per-course DMs)
message: string;
status: "sent" | "delivered" | "seen";
createdAt: Date;
}


const ChatMessageSchema = new Schema<IChatMessage>(
{
sender: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
receiver: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
message: { type: String, required: true, trim: true },
status: { type: String, enum: ["sent", "delivered", "seen"], default: "sent", index: true },
},
{ timestamps: { createdAt: true, updatedAt: false } }
);


// Helpful indexes
ChatMessageSchema.index({ course: 1, createdAt: 1 });
ChatMessageSchema.index({ sender: 1, receiver: 1, course: 1, createdAt: -1 });


export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

