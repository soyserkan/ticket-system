import { HttpStatus } from '@serkans/status-codes';
import request from 'supertest';
import { App } from '../../app';
import mongoose from 'mongoose';

const node = new App(process.env.PORT || 3000);

function createTicket(cookie: string, title: string, price: number) {
    return request(node.app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title, price })
}

it('returns an updated tickets', async function () {
    const cookie = global.getCookie();
    const title = 'test', price = 20;
    const response = await createTicket(cookie, title, price);
    expect(response.status).toEqual(HttpStatus.CREATED);

    const ticket = await request(node.app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'test2', price: 11 })
        .expect(HttpStatus.OK);

    expect(ticket.body.title).toEqual('test2');
    expect(ticket.body.price).toEqual(11);
});

it('returns an error when ticket is not found', async function () {
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
        .put(`/api/tickets/${object_id}`)
        .send()

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('returns an error when not authorized', async function () {
    const cookie = global.getCookie();
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
        .put(`/api/tickets/${object_id}`)
        .set('Cookie', cookie)
        .send()

    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
});

it('returns an error when setting negative price value', async function () {
    const cookie = global.getCookie();
    await createTicket(cookie, "test", 10);

    return request(node.app)
        .put(`/api/tickets`)
        .set('Cookie', cookie)
        .send({ title: 'test2', price: -24 })
        .expect(HttpStatus.BAD_REQUEST);
});