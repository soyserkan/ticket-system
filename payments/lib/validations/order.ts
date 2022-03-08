import Joi, { ValidationResult } from "joi";

export function orderValidation(ticket) {
    try {
        const schema = Joi.object({
            token: Joi.string().required(),
            orderId: Joi.string().required()
        });
        return schema.validate(ticket, { abortEarly: false }) as ValidationResult;
    } catch (error) {
        return error as ValidationResult;
    }
}