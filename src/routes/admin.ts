import express, { Request, Response, NextFunction} from "express";
const router = express.Router();
import { admin_service } from "../services/admin";
import auth from "../middleware/auth";
import { AuthRequest } from "../middleware/authRequest";

const authenticate = auth.authenticate;

router
    .post("/signup", (req: Request, res: Response, next: NextFunction) => {
        admin_service.signup(req, res, next);
    })

    .post("/login", (req: Request, res: Response, next: NextFunction) => {
        admin_service.login(req, res, next);
    })

    .post("/new-worker", authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
        admin_service.create_worker(req, res, next);
    })

export default router;