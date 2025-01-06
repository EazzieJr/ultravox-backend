import { Request } from "express";
import { Document } from 'mongoose';
import { AdminModel } from "../model/admin";
import { WorkerModel } from "../model/worker";

type AdminDocument = Document<unknown, {}, typeof AdminModel.schema.obj>;
type WorkerDocument = Document<unknown, {}, typeof WorkerModel.schema.obj>;

export interface AuthRequest extends Request {
    admin?: AdminDocument,
    worker?: WorkerDocument
};
