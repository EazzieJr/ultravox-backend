import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server as HTTPServer, createServer } from "http";
import expressWs from "express-ws";
import { connectDb } from "./config/database";
import HTTP from "./middleware/handler";
import routeHandlers from "./routes";

connectDb();

export class Server {
    private httpServer: HTTPServer;
    public app: expressWs.Application;

    constructor() {
        this.app = expressWs(express()).app;

        this.httpServer = createServer(this.app);
        this.app.use(express.json());
        this.app.use(
            cors({
                origin: "*"
            }),
        );
        this.app.use(express.urlencoded({ extended: true }));

        this.app.get("/", (req: Request, res: Response) => {
            res.send("Hello World");
        });

        this.app.use(HTTP.setupRequest);
        this.app.use("/api", routeHandlers);
        this.app.use(HTTP.processResponse);
        this.app.use(HTTP.handle404);
        this.app.use(HTTP.handleError);
    
    };

    listen(port: number): void {
        this.app.listen(port);
        console.log("Listening on " + port);
    };
};
