import { Request } from "express";
import { Document } from 'mongoose';
import { AdminModel } from "../model/admin";

type AdminDocument = Document<unknown, {}, typeof AdminModel.schema.obj>;

export interface AuthRequest extends Request {
    admin?: AdminDocument
};
