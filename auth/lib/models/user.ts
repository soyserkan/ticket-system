import { Schema, model } from 'mongoose';
import Joi, { ValidationResult } from "joi";
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
            delete ret.__v;
        }
    },
    timestamps: true,
}
);

user.methods.generateAuthToken = function () {
    const token = jwt.sign({ email: this.email, userId: this._id, isAdmin: this.isAdmin }, process.env.JWT_KEY);
    return token;
}

user.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash((this as any).password, 10);
    (this as any).password = hash;
    next();
});


export default model<User>('User', user);

export function validateUser(user) {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            surname: Joi.string().min(2).max(30).required(),
            email: Joi.string().lowercase().trim().min(5).max(255).required().email(),
            password: Joi.string().min(3).max(255).required()
        });
        return schema.validate(user, { abortEarly: false }) as ValidationResult;
    } catch (error) {
        return error as ValidationResult;
    }
}