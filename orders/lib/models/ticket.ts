import mongoose, { Schema, model } from 'mongoose';
import { OrderStatus } from '../types/order-status';
import Order from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


export interface TicketAttr extends mongoose.Document {
    _id: string,
    version: number,
    title: string,
    price: string,
    isReserved(): Promise<boolean>;
}
// export interface TicketModel extends mongoose.Model<TicketAttr> {
//     findByEvent(parameters: { id: string, version: number }): Promise<TicketAttr | null>;
// }

const ticketSchema: Schema = new Schema({
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre('save', function (done) {
//     this.$where = {
//         version:this.get('version') - 1
//     };
//     done();
// })

ticketSchema.methods.isReserved = async function () {
    const order = await Order.findOne({
        ticket: this,
        status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] }
    });
    return !!order;
}

// ticketSchema.statics.findByEvent = function (parameters: { id: string, version: number }) {
//     return Ticket.findOne({
//         _id: parameters.id,
//         version: parameters.version - 1
//     });
// }



// const Ticket = model<TicketAttr, TicketModel>('Ticket', ticketSchema);
//export default Ticket;

export default model<TicketAttr>('Ticket', ticketSchema);