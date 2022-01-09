import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

dotenv.config();
let mongo: any;


beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    try {
        await mongoose.connect(uri);
    } catch (error) {
        console.error('Test mongoose => connection error: ' + error);
    }
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getCookie = () => {
    const token = jwt.sign({ id: '123', email: 'test@test.com' }, "mysecretkey");
    const session = { jwt: token };
    const base64 = Buffer.from(JSON.stringify(session)).toString('base64');
    return [`session=${base64}; path=/; httponly`];
}