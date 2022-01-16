import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
let mongo: any;


export const rabbitmq = {
    channel: {
        publish: jest
            .fn()
            .mockImplementation(
                (queueName: string, data: string, callback: () => void) => {
                    callback();
                }
            ),
        assertQueue: jest
            .fn()
            .mockImplementation(
                () => { }
            ),
        sendToQueue: jest
            .fn()
            .mockImplementation(
                () => { }
            )
    },
};


jest.mock('@serkans/rabbitmq-service', () => ({
    ...jest.requireActual('@serkans/rabbitmq-service'),
    rabbitmq: rabbitmq
}));


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