import request from 'supertest';
import { App } from '../../app';
import { HttpStatus } from '../../enums/status';

const node = new App(process.env.PORT || 3000);

it('returns a 201 on successful signup', async function () {
    return request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED)
});

it('returns a 400 with an invalid email', async function () {
    return request(node.app).post('/api/users/signup').send({
        email: 'test',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.BAD_REQUEST)
});

it('returns a 400 with an invalid password', async function () {
    return request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.BAD_REQUEST)
});


it('returns a 400 with missing parameters', async function () {
    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
    }).expect(HttpStatus.BAD_REQUEST);

    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
    }).expect(HttpStatus.BAD_REQUEST);

    await request(node.app).post('/api/users/signup').send({
    }).expect(HttpStatus.BAD_REQUEST);

    await request(node.app).post('/api/users/signup').send({
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.BAD_REQUEST);
});

it('block duplicate email', async function () {
    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED)

    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456abc',
        name: 'Serkan2',
        surname: 'Soy2'
    }).expect(HttpStatus.BAD_REQUEST)
});


it('sets a cookie after successfull signup', async function () {
    const response = await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED)

    expect(response.get("Set-Cookie")).toBeDefined();
});
