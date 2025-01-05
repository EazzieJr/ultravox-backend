import Joi from "joi";
import { RequiredEmail, RequiredPassword } from "./general";

export const NewAdminSchema = Joi.object({
    ...RequiredEmail,
    ...RequiredPassword,
    username: Joi.string().required()
});