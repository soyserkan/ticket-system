import { Schema, model } from 'mongoose';


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
        }
    },
    timestamps: true, versionKey: false
}
);

ticket.pre("save", async function (next) {
    if (this.id) {
        this._id = this.id;
        delete this.id
    }
    next();
});

export default model<Ticket>('Ticket', ticket);