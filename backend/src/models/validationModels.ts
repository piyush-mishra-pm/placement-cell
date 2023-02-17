import { Joi } from "express-validation";

// Express-validation models for different routes.
// Validates inputs to different api routes.
// Used in api/v1/routes.ts file.

export const registerValidation = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    password_confirm: Joi.string().required(),
}).options({ allowUnknown: true });

export const forgotValidation = Joi.object({
    email: Joi.string().email().required(),
});

export const resetValidation = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
    password_confirm: Joi.string().required()
});

export const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
}).options({ allowUnknown: true });