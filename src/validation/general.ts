import Joi from "joi";

export const RequiredEmail = {
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required"
    })
};

export const RequiredPassword = {
    password: Joi.string().required()
};
