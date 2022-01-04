import request from 'supertest';
import { App } from '../../app';
import { HttpStatus } from '../../enums/status';

const node = new App(process.env.PORT || 3000);

it('destroy cookie when successful signout', async function () {
    await request(node.app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '123456',
        name: 'Serkan',
        surname: 'Soy'
    }).expect(HttpStatus.CREATED);

    const response = await request(node.app).post('/api/users/signout')
    .send({}).expect(HttpStatus.OK)

    expect(response.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});