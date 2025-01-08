import Joi from "joi";
import { RequiredPassword } from "./general";

export const LoginWorkerSchema = Joi.object({
    username: Joi.string().required(),
    ...RequiredPassword
});

export const CreateAgentSchema = Joi.object({
    documentType: Joi.string().required()
});

export const UpdateAgentSchema = Joi.object({
    agentId: Joi.string().required(),
    systemPrompt: Joi.string(),
    temperature: Joi.number(),
    firstSpeaker: Joi.string(),
    voice: Joi.string()
});

// export const CreateAgentSchema = Joi.object({
//     name: Joi.string().required()
// }); 
