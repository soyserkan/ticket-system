import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '../types/order-status';


interface OrderAttr extends mongoose.Document {
    price: number,
    userId: string,
    version: number,
    status: OrderStatus
}
interface OrderModel extends mongoose.Model<OrderAttr> {

}

const orderSchema: Schema = new Schema({
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
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

export default model<OrderAttr, OrderModel>('Order', orderSchema);