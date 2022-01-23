import { Schema, model } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';



interface User {
    name: string,
    surname: string,
    email: string,
    password: string
}

const user: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    surname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    isAdmin: Boolean,
    imageLink: String
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    },
    timestamps: true, versionKey: false
}
);

user.methods.generateAuthToken = function () {
    const token = jwt.sign({ email: this.email, id: this._id }, process.env.JWT_KEY);
    return token;
}

user.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash((this as any).password, 10);
    (this as any).password = hash;
    if (this.id) {
        this._id = this.id;
        delete this.id
    }
    next();
});


export default model<User>('User', user);