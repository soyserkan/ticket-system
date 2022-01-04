import request from 'supertest';
import { App } from '../../app';
import { HttpStatus } from '../../enums/status';

const node = new App(process.env.PORT || 3000);

it('fails when a email that does not exist is supllied', async function () {
    return request(node.app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: '123456',
    }).expect(HttpStatus.BAD_REQUEST)
});

it('fails when an incorrect password is supplied', async function () {
    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED)

    await request(node.app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: '123456abc',
    }).expect(HttpStatus.BAD_REQUEST)
});

it('responds with a cookie when given valid creditentials', async function () {
    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED)

    var response = await request(node.app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: '123456',
    }).expect(HttpStatus.OK)

    expect(response.get('Set-Cookie')).toBeDefined();
});
