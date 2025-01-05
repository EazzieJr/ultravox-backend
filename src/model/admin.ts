import { Document, model, Schema } from "mongoose";

interface AdminDocument extends Document {
    email: string,
    password: string,
    username: string,
    isActive: boolean
};

const adminSchema = new Schema<AdminDocument>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

export const AdminModel = model("Admin", adminSchema);