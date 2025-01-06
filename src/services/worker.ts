import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { WorkerModel } from "../model/worker";
import { LoginWorkerSchema } from "../validation/worker";
import { generate_token, check_password_match } from "../utilities/general";
import { Schema } from "mongoose";

class WorkerService extends RootService {
    async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const body = req.body;

            const { error } = LoginWorkerSchema.validate(body, { abortEarly: false });
            if (error) return this.handle_validation_errors(error, res, next);

            const { username, password } = body;

            const check_username = await WorkerModel.findOne({ username });
            if (!check_username) return res.status(401).json({ error: "Username not found"});

            const encrypted_password = check_username.password;
            const workerId: Schema.Types.ObjectId = check_username._id as Schema.Types.ObjectId;
            const string = `${username}_${workerId.toString()}`;

            const verify_password: boolean = await check_password_match(encrypted_password, password);
            if (!verify_password) return res.status(401).json({ error: "Invalid  Password" });

            const token = generate_token(workerId, string);

            const result = {
                worker: check_username,
                token
            };

            return res.status(200).json({
                success: true,
                message: "Logged in worker successfully",
                data: result
            });

        } catch (e) {
            console.error("Error loggin in worker: " + e);
            next(e);
        };
    };
};

export const worker_service = new WorkerService();