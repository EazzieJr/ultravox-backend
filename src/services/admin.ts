import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { NewAdminSchema, LoginAdminSchema } from "../validation/admin";
import { AdminModel } from "../model/admin";
import { generate_token, check_password_match } from "../utilities/general";
import { Schema } from "mongoose";
import argon2 from "argon2";

class AdminService extends RootService {
    async signup(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const body = req.body;

            const { error } = NewAdminSchema.validate(body, { abortEarly: false });
            if (error) return this.handle_validation_errors(error, res, next);

            const { email, password, username } = body;
            email.toLowerCase();
            const check_email = await AdminModel.findOne({ email: email });

            if(check_email) return res.status(400).json({ error: "Admin with that email already exists" });

            const hashed_password = await argon2.hash(password);

            const new_admin = await AdminModel.create({
                email,
                password: hashed_password,
                username
            });

            const _id: Schema.Types.ObjectId = new_admin._id as Schema.Types.ObjectId;

            const token = generate_token(_id, email);

            const result = {
                new_admin,
                token
            };

            return res.status(201).json({
                success: true,
                message: "New Admin signed up",
                data: result
            });

        } catch (error) {
            console.error("Error signing up admin: " + error);
            next(error);
        };
    };

    async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const body = req.body;

            const { error } = LoginAdminSchema.validate(body, { abortEarly: false });
            if (error) return this.handle_validation_errors(error, res, next);

            const { email, password } = body;
            email.toLowerCase();

            const check_admin = await AdminModel.findOne({ email: email });
            if(!check_admin) return res.status(400).json({ error: "Admin not found" });

            const encrypted_password = check_admin.password;
            console.log("pass: ", encrypted_password);
            const adminId: Schema.Types.ObjectId = check_admin._id as Schema.Types.ObjectId;

            const verify_password: boolean = await check_password_match(encrypted_password, password);

            if (!verify_password) return res.status(401).json({ error: "Incorrect Password" });

            const token = generate_token(adminId, email);

            const result = {
                check_admin,
                token
            };

            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                data: result
            });

        } catch (error) {
            console.error("Error loggin in admin: " + error);
            next(error);
        };
    };
};

export const admin_controller = new AdminService();