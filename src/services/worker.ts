import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { WorkerModel } from "../model/worker";
import { LoginWorkerSchema, CreateAgentSchema } from "../validation/worker";
import { generate_token, check_password_match } from "../utilities/general";
import { Schema } from "mongoose";
import { AuthRequest } from "../middleware/authRequest";
import { v4 as uuidv4 } from "uuid";
import { AgentModel } from "../model/agent";

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

    async create_agent(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
        try {
            const body = req.body;
            const workerId = req.worker._id;

            const { error } = CreateAgentSchema.validate(body, { abortEarly: false });
            if (error) return this.handle_validation_errors(error, res, next);

            const check_worker = await WorkerModel.findOne({
                _id: workerId,
                isActive: true
            });
            if (!check_worker) return res.status(401).json({ error: "WorkerId not found or is not active" });

            const { name } = body;
            
            const check_agent = await AgentModel.findOne({ name });
            if (check_agent) return res.status(400).json({ error: "Agent with that name already exists, please choose another"});

            const key = uuidv4();
            const agentId = `agent_${key}`;

            const new_agent = await AgentModel.create({
                agentId,
                name
            });

            if (!new_agent._id) return res.status(500).json("Error creating new agent");

            return res.status(201).json({
                success: true,
                message: "Created New Agent successfully",
                new_agent
            });
            
        } catch (e) {
            console.error("Error creating agent: " + e);
            next(e);
        };
    };

    async fetch_agents(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
        try {
            const workerId = req.worker._id;

            const check_worker = await WorkerModel.findOne({
                _id: workerId,
                isActive: true
            });
            if (!check_worker) return res.status(401).json({ error: "WorkerId not found or is not active" });

            const all_agents = await AgentModel.find({ isActive: true });

            return res.status(200).json({
                success: true,
                all_agents
            });
            
        } catch (e) {
            console.error("Error fetching list of agents: " + e);
            next(e);
        };
    };
};

export const worker_service = new WorkerService();