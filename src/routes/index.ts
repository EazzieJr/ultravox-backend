import app from "express";
const router = app.Router();

import admin_route from "./admin";

router.use("/admin", admin_route);

export default router;