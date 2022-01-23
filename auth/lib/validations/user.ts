import Joi, { ValidationResult } from "joi";


export function signinValidation(user) {
    try {
        const schema = Joi.object({
            email: Joi.string().lowercase().trim().min(5).max(255).required().email(),
            password: Joi.string().min(3).max(255).required()
        });
        return schema.validate(user, { abortEarly: false }) as ValidationResult;
    } catch (error) {
        return error as ValidationResult;
    }
}

export function signupValidation(user) {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            surname: Joi.string().min(2).max(30).required(),
            email: Joi.string().lowercase().trim().min(5).max(255).required().email(),
            password: Joi.string().min(3).max(255).required()
        });
        return schema.validate(user, { abortEarly: false }) as ValidationResult;
    } catch (error) {
        return error as ValidationResult;
    }
}