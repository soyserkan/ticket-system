import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import request from 'supertest';
import { App } from '../app';
import { HttpStatus } from '@serkans/ticketsystem-common';

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

global.signin = async () => {
    const node = new App(process.env.PORT || 3000);
    const signup_res = await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED)

    const cookie = signup_res.get('Set-Cookie');
    return cookie;
}