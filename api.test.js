import request from 'supertest';
import app from '../app.js';

describe('API Endpoints', () => {
  // Health check test
  test('GET /health returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  // MySQL tests
  describe('MySQL Endpoints', () => {
    test('GET /mysql/recipes returns recipes list', async () => {
      const response = await request(app).get('/mysql/recipes');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /mysql/recipes/1 returns a recipe', async () => {
      const response = await request(app).get('/mysql/recipes/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
    });
  });

  // MongoDB tests
  describe('MongoDB Endpoints', () => {
    test('GET /mongodb/recipes returns recipes list', async () => {
      const response = await request(app).get('/mongodb/recipes');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});