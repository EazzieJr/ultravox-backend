import RootService from "./_root";
import { Request, Response, NextFunction } from "express";
import { WorkerModel } from "../model/worker";
import { generate_token, check_password_match } from "../utilities/general";

class WorkerService extends RootService {

};

export const worker_service = new WorkerService();