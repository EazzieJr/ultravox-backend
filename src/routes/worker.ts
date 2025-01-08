import express, { Request, Response, NextFunction} from "express";
const router = express.Router();
import { worker_service } from "../services/worker";
import workerAuth from "../middleware/workerAuth";
import { AuthRequest } from "../middleware/authRequest";

const authenticate = workerAuth.authenticate;

router
    .post("/login", (req: Request, res: Response, next: NextFunction) => {
        worker_service.login(req, res, next);
    })

    .get("/new-agent", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
        worker_service.create_agent(req, res, next);
    })

    .get("/all-agents", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
        worker_service.fetch_agents(req, res, next);
    })

    .get("/list-voices", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
        worker_service.list_voices(req, res, next);
    })

    .put("/update-agent", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
        worker_service.update_agent(req, res, next);
    })

    // .get("/list-numbers", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
    //     worker_service.list_numbers(req, res, next);
    // })

    // .post("/start-call/:agentId", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
    //     worker_service.start_call(req, res, next);
    // })

export default router;