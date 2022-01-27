import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'


interface TicketAttr extends mongoose.Document {
    title: string,
    price: string,
    userId: string,
    version: number,
    orderId: string
}
interface TicketNodel extends mongoose.Model<TicketAttr> {

}

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
    },
    userId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String
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

export default model<TicketAttr, TicketNodel>('Ticket', ticketSchema);