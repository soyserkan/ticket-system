import { HttpStatus } from '@serkans/status-codes';
import request from 'supertest';
import { App } from '../../app';

const node = new App(process.env.PORT || 3000);

it('responds with details about current user', async function () {
    const cookie = await global.signin()
    const response = await request(node.app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(HttpStatus.OK)
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async function () {
    const response = await request(node.app)
        .get('/api/users/currentuser')
        .send()
        .expect(HttpStatus.UNAUTHORIZED)

    expect(response.body.currentUser).toEqual(undefined);
});