import { Document, model, Schema } from "mongoose";

interface WorkerDocument extends Document {
    username: string,
    password: string,
    isActive: boolean,
    isDeleted: boolean
};

const workerSchema = new Schema<WorkerDocument>({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

export const WorkerModel = model("Worker", workerSchema);
