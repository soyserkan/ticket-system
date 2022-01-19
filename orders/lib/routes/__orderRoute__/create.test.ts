import { HttpStatus } from '@serkans/status-codes';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../app';
import Ticket from '../../models/ticket'

const node = new App(process.env.PORT || 3000);

it('returns an unauthorized if the user is not signed in', async function () {
    const response = await request(node.app)
        .post('/api/orders')
        .send({
            userId: 'test',
            ticketId: 'test'
        })
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
});

it('returns an error when create order without ticket', async function () {
    const cookie = await global.getCookie();
    const object_id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(node.app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: object_id })
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('returns an error when buying an reserved ticket', async function () {
    const cookie = await global.getCookie();

    var ticket = await Ticket.create({
        title: 'Cinema',
        price: 50
    })

    const response = await request(node.app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            userId: "test",
            ticketId: ticket.id
        })
    expect(response.status).toEqual(HttpStatus.CREATED);

    const response2 = await request(node.app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            userId: "test2",
            ticketId: ticket.id
        })
    expect(response2.status).toEqual(HttpStatus.BAD_REQUEST);


});

it('successfull create order', async function () {
    const cookie = await global.getCookie();

    var ticket = await Ticket.create({
        title: 'Cinema',
        price: 50
    })

    const response = await request(node.app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            userId: "test",
            ticketId: ticket.id
        })
    expect(response.status).toEqual(HttpStatus.CREATED);
});