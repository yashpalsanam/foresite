import request from 'supertest';
import { app } from '../server.js';
import User from '../models/User.js';
import { generateAccessToken } from '../config/jwtConfig.js';

describe('User Endpoints', () => {
  let adminToken;
  let userId;

  beforeEach(async () => {
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    adminToken = generateAccessToken({ id: admin._id, role: admin.role });

    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    userId = user._id;
  });

  describe('GET /api/users', () => {
    it('should get all users for admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.users).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('_id');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    });
  });
});
