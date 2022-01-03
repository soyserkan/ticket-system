import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
let mongo: any;


beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    try {
        await mongoose.connect(uri);
        console.log('Test mongoose => connection successful');
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