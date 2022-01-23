import { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'


interface Ticket {
    title: string,
    price: string,
    userId: string,
    version: number
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
        }
    },
    timestamps: true
});

ticket.set('versionKey', 'version');
ticket.plugin(updateIfCurrentPlugin);

export default model<Ticket>('Ticket', ticket);