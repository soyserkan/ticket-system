import Joi, { ValidationResult } from "joi";

export function ticketValidation(ticket) {
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            price: Joi.number().positive().required()
        });
        return schema.validate(ticket, { abortEarly: false }) as ValidationResult;
    } catch (error) {
        return error as ValidationResult;
    }
}