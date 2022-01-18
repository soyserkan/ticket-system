import { Schema, model } from 'mongoose';
import Joi, { ValidationResult } from "joi";


interface Ticket {
    title: string,
    price: string,
    userId: string
}

const ticket: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        trim: true,
        min: 0
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
}
);

export default model<Ticket>('Ticket', ticket);

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