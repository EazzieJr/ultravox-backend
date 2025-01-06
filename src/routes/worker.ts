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

    .post("/new-agent", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
        worker_service.create_agent(req, res, next);
    })

export default router;