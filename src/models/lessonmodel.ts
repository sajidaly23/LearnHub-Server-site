import mongoose, { Document, Schema } from "mongoose";

export interface Ilesson extends Document {
    title: string;
    course: mongoose.Types.ObjectId;
    vedioUrl?: string;
    resources?: string;
    content?: string;
    order: number;
}


const lessonSchema = new Schema<Ilesson>(
    {
        title: { type: String, required: true },
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        vedioUrl: { type: String },
        resources: [{ type: String }],
        content: { type: String },
        order: { type: Number, default: 0 }

    },
    { timestamps: true }
)

export const Lesson = mongoose.model<Ilesson>("Lesson", lessonSchema)
