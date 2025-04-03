/* eslint-disable no-undef */

const request = require('supertest');
const { app, server } = require('../app');
const { stopAllTasks } = require('../src/utils/logBufferUtils');


describe('API Server Tests', () => {

  afterAll((done) => {
    server.close(done); 
    stopAllTasks(); 
  });


  describe('GET /api-docs', () => {
    it('should return the Swagger documentation page', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.statusCode).toBe(301);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Not found'); 
    });
  });

  describe('POST /api/auth/signIn', () => {

    it('should authenticate user with valid credentials', async () => {
      const payload = {
        email: 'Winona.Moore@hotmail.com',
        password: 'Qwerty123@',
      };

      const response = await request(app)
        .post('/api/auth/signIn')
        .send(payload);

      expect(response.body.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Вы успешно вошли.');
      expect(response.body.data.user).toHaveProperty('id');
    });

    it('should reject user with invalid credentials', async () => {
      const payload = {
        email: 'wrong-user@example.com',
        password: 'WrongPassword456',
      };

      const response = await request(app)
        .post('/api/auth/signIn')
        .send(payload);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'Пользователь с таким email не найден.'
      );
    });
  });
});
