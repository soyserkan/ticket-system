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
    return [`session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW5ObGNtdGhia0J6YjNrdVkyOXRJaXdpYVdRaU9pSTJNV1JqT1RZeE16a3dZV1l4TVRCak5UaGhZMlZqT1RRaUxDSnBZWFFpT2pFMk5ERTRORFl5T1RKOS5sZ2tpY2dOTkJfRS1CRjRnNjBUMDNFVnk2N3ZBWGdpbXY1ZmllV21uUVk4In0=`];
}
//["session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW5SbGMzUkFkR1Z6ZEM1amIyMG
//lMQ0pwWkNJNklqWXhaR000TkdFM05XVmlabVZrTW1VM1lUVmxOamN3WlNJc0ltbGhkQ0k2TVRZME1UZzBNVGd6TVgwLjJ3anlKbE9VUVRYY2pSQmFJeDg1
//SlVmLXJ0dWQ2MFZaUVpnRkRMM1U3dVUifQ==; path=/; httponly"]