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

it('returns a selected ticket', async function () {
    const cookie = global.getCookie();
    const title = 'test', price = 20;
    const response = await createTicket(cookie, title, price);
    expect(response.status).toEqual(HttpStatus.CREATED);

    const ticket = await request(node.app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(HttpStatus.OK);

    expect(ticket.body.title).toEqual(title);
});

it('returns an error when ticket is not found', async function () {
    const cookie = global.getCookie();
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
        .get(`/api/tickets/${object_id}`)
        .set('Cookie', cookie)
        .send()

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('returns a selected tickets', async function () {
    const cookie = global.getCookie();

    await createTicket(cookie, "test", 10);
    await createTicket(cookie, "test2", 20);
    await createTicket(cookie, "test3", 30);

    const ticket = await request(node.app)
        .get(`/api/tickets`)
        .set('Cookie', cookie)
        .send()
        .expect(HttpStatus.OK);

    expect(ticket.body.length).toEqual(3);
});