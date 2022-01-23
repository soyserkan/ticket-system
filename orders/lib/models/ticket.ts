import { Schema, model } from 'mongoose';
import { OrderStatus } from '../types/order-status';
import Order from './order';


export interface Ticket {
    _id: string,
    title: string,
    price: string,
    isReserved(): Promise<boolean>;
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
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: true
});

ticket.methods.isReserved = async function () {
    const order = await Order.findOne({
        ticket: this,
        status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] }
    });
    return !!order;
}

export default model<Ticket>('Ticket', ticket);