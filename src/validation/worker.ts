import Joi from "joi";
import { RequiredPassword } from "./general";

export const LoginWorkerSchema = Joi.object({
    username: Joi.string().required(),
    ...RequiredPassword
});