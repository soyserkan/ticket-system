import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '../types/order-status';


interface PaymentAttr extends mongoose.Document {
    orderId: string,
    stripeId: string,
}
interface PaymentModel extends mongoose.Model<PaymentAttr> {

}

const paymentSchema: Schema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

export default model<PaymentAttr, PaymentModel>('Payment', paymentSchema);