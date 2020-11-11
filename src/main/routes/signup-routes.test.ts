import app from '../config/app'
import request from 'supertest'

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .get('/api/signup')
      .send({
        name: 'User_test',
        email: 'user@email.com',
        password: 'passwordtest',
        passwordConfirmation: 'passwordtest'
      })
      .expect(200)
  })
})
