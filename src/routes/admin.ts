import express, { Request, Response, NextFunction} from "express";
const router = express.Router();
import { admin_controller } from "../services/admin";

router
    .post("/signup", (req: Request, res: Response, next: NextFunction) => {
        admin_controller.signup(req, res, next);
    })

export default router;