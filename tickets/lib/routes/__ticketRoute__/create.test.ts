import { HttpStatus } from '@serkans/status-codes';
import request from 'supertest';
import { App } from '../../app';

const node = new App(process.env.PORT || 3000);


it('returns an unauthorized if the user is not signed in', async function () {
    const response = await request(node.app)
        .post('/api/tickets')
        .send({
            title: 'test',
            price: 20
        })
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
});

it('successfull create ticket', async function () {
    const cookie = await global.getCookie();
    const response = await request(node.app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 20
        })
    expect(response.status).toEqual(HttpStatus.CREATED);
});

it('returns an error when price less than zero', async function () {
    const cookie = global.getCookie();
    const response = await request(node.app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: -5
        })
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
});
