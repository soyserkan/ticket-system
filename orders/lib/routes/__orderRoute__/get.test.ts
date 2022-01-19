import { HttpStatus } from '@serkans/status-codes';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../app';
import Ticket from '../../models/ticket'

const node = new App(process.env.PORT || 3000);

async function createTicket(title: string, price: number) {
    return await Ticket.create({ title, price })
}
async function createOrder(cookie: string, ticketId: string) {
    return await request(node.app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticketId })
}

it('returns an unauthorized if the user is not signed in', async function () {
    const response = await request(node.app)
        .get('/api/orders')
        .send({})
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
});

it('returns an error when order not found', async function () {
    const cookie = await global.getCookie();
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
        .get(`/api/orders/${object_id}`)
        .set('Cookie', cookie)
        .send()
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('returns single order', async function () {
    const cookie = await global.getCookie();
    const ticket = await createTicket('cinema', 50);
    const order = await createOrder(cookie, ticket.id);
    const response = await request(node.app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', cookie)
        .send()
    expect(response.body.id).toEqual(order.body.id);
});

it('returns all order', async function () {
    const cookie = await global.getCookie();
    const ticket1 = await createTicket('cinema', 50);
    const ticket2 = await createTicket('teather', 150);
    const ticket3 = await createTicket('football', 20);
    await createOrder(cookie, ticket1.id);
    await createOrder(cookie, ticket2.id);
    await createOrder(cookie, ticket3.id);
    const response = await request(node.app)
        .get(`/api/orders`)
        .set('Cookie', cookie)
        .send()
    expect(response.body.length).toEqual(3);
});