import { Document, model, Schema } from "mongoose";
import argon2 from "argon2";

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

adminSchema.pre("save", async function () {
    this.password = await argon2.hash(this.password);
});

export const AdminModel = model("Admin", adminSchema);