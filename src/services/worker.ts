import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { WorkerModel } from "../model/worker";
import { LoginWorkerSchema, CreateAgentSchema, UpdateAgentSchema } from "../validation/worker";
import { generate_token, check_password_match } from "../utilities/general";
import { Schema } from "mongoose";
import { AuthRequest } from "../middleware/authRequest";
import { v4 as uuidv4 } from "uuid";
import { AgentModel } from "../model/agent";
import axios, { Axios } from "axios";
import { Environment } from "../config/env";

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

            const { documentType } = body;

            if (documentType !== "blank" && documentType !== "template") return res.status(400).json({ error: "Invalid document type" });
            
            // const check_agent = await AgentModel.findOne({ name });
            // if (check_agent) return res.status(400).json({ error: "Agent with that name already exists, please choose another"});

            const key = uuidv4();
            const agentId = `agent_${key}`;

            const new_agent = await AgentModel.create({
                agentId
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

    async list_voices(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
        try {
            const workerId = req.worker._id;

            const check_worker = await WorkerModel.findOne({
                _id: workerId,
                isActive: true
            });
            if (!check_worker) return res.status(401).json({ error: "WorkerId not found or is not active" });

            const options = {
                method: "GET",
                url: 'https://api.ultravox.ai/api/voices',
                headers: {
                    'X-API-Key': Environment.ULTRAVOX_KEY
                }
            };

            const result = await axios(options);

            const data = result.data;

            return res.status(200).json({
                success: true,
                data
            });

        } catch(e) {
            console.error("Error fetching list of voices: " + e);
            next(e);
        };
    };

    async single_agent(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
        try {
            const workerId = req.worker._id;
            const agentId = req.params.agentId;

            const check_worker = await WorkerModel.findOne({
                _id: workerId,
                isActive: true
            });
            if (!check_worker) return res.status(401).json({ error: "WorkerId not found or is not active" });

            const check_agent = await AgentModel.findOne({ agentId });
            if (!check_agent) return res.status(401).json({ error: "AgentId not found" });

            return res.status(200).json({
                success: true,
                data: check_agent
            });

        } catch(e) {
            console.error("Error fetching single agent: " + e);
            next(e);
        };
    };
 

    // async list_numbers(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
    //     try {
    //         const workerId = req.worker._id;

    //         const check_worker = await WorkerModel.findOne({
    //             _id: workerId,
    //             isActive: true
    //         });
    //         if (!check_worker) return res.status(401).json({ error: "WorkerId not found or is not active" });

    //         const acctID = Environment.TWILIO_ACCOUNT_ID;
    //         const auth = Environment.TWILIO_AUTH_TOKEN;

    //         const options = {
    //             method: "GET",
    //             url: 'https://lookups.twilio.com/v2/PhoneNumbers',
    //             auth: {
    //                 username: acctID,
    //                 password: auth
    //             }
    //         };

    //         console.log("fine here");
    //         const result = await axios(options);

    //         const data = result.data;
    //         console.log("dat:", data);

    //         return res.status(200).json({
    //             success: true,
    //             data
    //         });

    //     } catch(e) {
    //         console.error("Error fetching list of numbers: " + e);
    //         next(e);
    //     };
    // };



    async update_agent(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
        try {
            const workerId = req.worker._id;
            const body = req.body;

            const { error } = UpdateAgentSchema.validate(body, { abortEarly: false });
            if (error) return this.handle_validation_errors(error, res, next);

            const check_worker = await WorkerModel.findOne({
                _id: workerId,
                isActive: true
            });
            if (!check_worker) return res.status(401).json({ error: "WorkerId not found or is not active" });

            const { agentId, systemPrompt, temperature, firstSpeaker, voice } = body

            const check_agent = await AgentModel.findOne({ agentId });
            if (!check_agent) return res.status(401).json({ error: "AgentId not found" });

            const result = await AgentModel.findOneAndUpdate(
                { agentId },
                { $set: body },
                { returnOriginal: false }
            );

            return res.status(200).json({
                success: true,
                message: "Updated agent successfully",
                data: result
            });

        } catch (e) {
            console.error("Error updating agent: ", e);
            next(e);
        };
    };

    // async function createUltravoxCall() {
    //     const request = https.request(ULTRAVOX_API_URL, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-API-Key': ULTRAVOX_API_KEY
    //         }
    //     });
    
    //     return new Promise((resolve, reject) => {
    //         let data = '';
    
    //         request.on('response', (response) => {
    //             response.on('data', chunk => data += chunk);
    //             response.on('end', () => resolve(JSON.parse(data)));
    //         });
    
    //         request.on('error', reject);
    //         request.write(JSON.stringify(ULTRAVOX_CALL_CONFIG));
    //         request.end();
    //     });
    // }
    

    // async start_call(req: AuthRequest, res: Response, next: NextFunction): Promise<Response> {
    //     try {
    //         const agentId = req.params.agentId;

            // const check_agent = await AgentModel.findOne({ agentId });
            // if (!check_agent) return res.status(401).json({ error: "AgentId not found" });

    //         const { systemPrompt, model_name, voice, temperature, firstSpeaker } = check_agent;

    //         const ULTRAVOX_CONFIG = {
    //             systemPrompt,
    //             model: model_name,
    //             voice,
    //             temperature,
    //             firstSpeaker,
    //             medium: { "twilio": {} }
    //         };

    //         const options = {
    //             method: "POST",
    //             url: 'https://api.ultravox.ai/api/calls',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-API-Key': Environment.ULTRAVOX_KEY
    //             },
    //             data: ULTRAVOX_CONFIG
    //         };

    //         const ultra_response = await axios(options);

    //         console.log("ultra_con: ", ULTRAVOX_CONFIG);

    //         // const ULTRAVOX_CONFIG = {
    //         //     systemPrompt: "",
    //         //     model: 'fixie-ai/ultravox',
    //         //     voice: 'Mark',
    //         //     temperature: 0.3,
    //         //     firstSpeaker: 'FIRST_SPEAKER_USER',
    //         //     medium: { "twilio": {} }
    //         // }
    //         return res;
    //     } catch (e) {
    //         console.error("Error starting a call: " + e);
    //         next(e);
    //     };
    // };

};

export const worker_service = new WorkerService();