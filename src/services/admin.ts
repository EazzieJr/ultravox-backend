import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { NewAdminSchema } from "../validation/admin";
import { AdminModel } from "../model/admin";
import { generate_token } from "../utilities/general";
import { Schema } from "mongoose";

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

            const new_admin = await AdminModel.create({
                email, password, username
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
};

export const admin_controller = new AdminService();