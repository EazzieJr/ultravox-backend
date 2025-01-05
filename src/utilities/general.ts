import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import argon2 from "argon2";
import { Environment } from "../config/env";

export const generate_token = (_id: Schema.Types.ObjectId, email: string): string => {
    const JWT_SECRET = Environment.JWT_SECRET;

    const token = jwt.sign({_id, email}, JWT_SECRET, { expiresIn: "6h" });

    return token;
};

export const check_password_match = async (plain_password: string, encrypted_password: string): Promise<boolean> => {
    return await argon2.verify(encrypted_password, plain_password);
};