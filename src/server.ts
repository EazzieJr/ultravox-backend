import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server as HTTPServer, createServer } from "http";
import expressWs from "express-ws";
import { connectDb } from "./config/database";
import HTTP from "./middleware/handler";
import routeHandlers from "./routes";
import admin_route from "./routes/admin";
import { admin_service } from "./services/admin";

connectDb();

export class Server {
    private httpServer: HTTPServer;
    public app: express.Application;

    constructor() {
        // this.app = expressWs(express()).app;
        this.app = express();

        this.httpServer = createServer(this.app);
        this.app.use(express.json());
        this.app.use(
            cors({
                origin: "*"
            }),
        );
        this.app.use(express.urlencoded({ extended: true }));

        this.app.get("/", (req: Request, res: Response) => {
            console.log("getting here");
            res.send("Hello World");
        });
        this.app.post("/admin/signup", (req: Request, res: Response, next: NextFunction) => {
            console.log("admin");
            admin_service.signup(req, res, next);
        });

        this.app.use("/api", routeHandlers);
        this.app.use(HTTP.setupRequest);
        this.app.use(HTTP.processResponse);
        this.app.use(HTTP.handle404);
        this.app.use(HTTP.handleError);
    
    };

    listen(port: number): void {
        this.httpServer.listen(port);
        console.log("Listening on " + port);
    };
};
