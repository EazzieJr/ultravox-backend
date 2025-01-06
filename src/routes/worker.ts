import express, { Request, Response, NextFunction} from "express";
const router = express.Router();
import { worker_service } from "../services/worker";

router
    .post("/login", (req: Request, res: Response, next: NextFunction) => {
        worker_service.login(req, res, next);
    })

export default router;