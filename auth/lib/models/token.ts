import { Schema, model } from 'mongoose';



interface Token {
  userId: string,
  token: string,
  createdAt: Date
}

const token: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
}, { timestamps: true });


export default model<Token>('Token', token);