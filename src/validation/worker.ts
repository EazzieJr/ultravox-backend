import Joi from "joi";
import { RequiredPassword } from "./general";

export const LoginWorkerSchema = Joi.object({
    username: Joi.string().required(),
    ...RequiredPassword
});

export const CreateAgentSchema = Joi.object({
    name: Joi.string().required()
});