import app from "express";
const router = app.Router();

import admin_route from "./admin";
import worker_route from "./worker";

router.use("/admin", admin_route);
router.use("/worker", worker_route);

export default router;