import mongoose, { Schema, model, Date } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '../types/order-status';
import { TicketAttr } from './ticket';

const expiration = new Date();

export interface OrderAttr extends mongoose.Document {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketAttr,
    version: number
}

const orderSchema: Schema = new Schema({
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
        type: Schema.Types.Date
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
    timestamps: true
});


orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

export default model<OrderAttr>('Order', orderSchema);