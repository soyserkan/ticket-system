import { HttpStatus } from '@serkans/status-codes';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../app';
import Ticket from '../../models/ticket'
import { OrderStatus } from '../../types/order-status';

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
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
    .patch(`/api/orders/${object_id}`)
        .send({})
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
});

it('returns an error when order not found', async function () {
    const cookie = await global.getCookie();
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
        .patch(`/api/orders/${object_id}`)
        .set('Cookie', cookie)
        .send()
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('returns deleted order', async function () {
    const cookie = await global.getCookie();
    const ticket1 = await createTicket('cinema', 50);
    const order = await createOrder(cookie, ticket1.id);
    const response = await request(node.app)
        .patch(`/api/orders/${order.body.id}`)
        .set('Cookie', cookie)
        .send()
    expect(response.body.status).toEqual(OrderStatus.Cancelled.toString());
});
