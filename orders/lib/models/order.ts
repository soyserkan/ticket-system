import { Schema, model, Date } from 'mongoose';
import Joi, { ValidationResult } from "joi";
import { OrderStatus } from '../types/order-status';
import { Ticket } from './ticket';

const expiration = new Date();

interface Order {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: Ticket
}

const order: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date,
        default: expiration.setSeconds(expiration.getSeconds() + 15 * 60)
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: true,versionKey: false
}
);
order.pre("save", async function (next) {
    if (this.id) {
        this._id = this.id;
        delete this.id
    }
    next();
});

export default model<Order>('Order', order);