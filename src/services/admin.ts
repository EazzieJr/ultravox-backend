import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { NewAdminSchema, LoginAdminSchema, CreateWorkerSchema } from "../validation/admin";
import { AdminModel } from "../model/admin";
import { WorkerModel } from "../model/worker";
import { generate_token, check_password_match } from "../utilities/general";
import { Schema } from "mongoose";
import argon2 from "argon2";
import { AuthRequest } from "../middleware/authRequest";

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

        } catch (e) {
            console.error("Error signing up admin: " + e);
            next(e);
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
            const adminId: Schema.Types.ObjectId = check_admin._id as Schema.Types.ObjectId;

            const verify_password: boolean = await check_password_match(encrypted_password, password);

            if (!verify_password) return res.status(401).json({ error: "Incorrect Password" });

            const token = generate_token(adminId, email);

            const result = {
                admin: check_admin,
                token
            };

            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                data: result
            });

        } catch (e) {
            console.error("Error loggin in admin: " + e);
            next(e);
        };
    };

    async create_worker(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
        try {
            const body = req.body;
            const adminId = req.admin._id;

            const { error } = CreateWorkerSchema.validate(body, { abortEarly: false });
            if (error) return this.handle_validation_errors(error, res, next);

            const check_admin = await AdminModel.findById(adminId).select("-password");
            if (!check_admin) return res.status(401).json({ error: "You are not an admin" });

            const { username, password } = body;

            const check_username = await WorkerModel.findOne({ username });
            if (check_username) return res.status(400).json({ error: "Username is already taken, kindly use another" });

            const hashed_password = await argon2.hash(password);

            const new_worker = await WorkerModel.create({
                username,
                password: hashed_password
            });

            if (!new_worker._id) return res.status(400).json({ error: "Unable to create new worker" });

            return res.status(201).json({
                success: true,
                message: "Created new worker successfully",
                username
            });

        } catch (e) {
            console.error("Error creating worker: " + e);
            next(e);
        };
    };
};

export const admin_service = new AdminService();