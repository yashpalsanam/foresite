import request from 'supertest';
import { app } from '../server.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import { generateAccessToken } from '../config/jwtConfig.js';

describe('Property Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'agent',
    });

    userId = user._id;
    token = generateAccessToken({ id: user._id, role: user.role });
  });

  describe('GET /api/properties', () => {
    it('should get all properties', async () => {
      await Property.create({
        title: 'Test Property',
        description: 'Test Description',
        propertyType: 'house',
        listingType: 'sale',
        price: 100000,
        address: {
          street: '123 Main St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA',
        },
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749],
        },
        features: {
          bedrooms: 3,
          bathrooms: 2,
          area: 1500,
        },
        owner: userId,
      });

      const res = await request(app).get('/api/properties');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);
      expect(res.body.data.properties.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Property',
          description: 'New Description',
          propertyType: 'apartment',
          listingType: 'rent',
          price: 2000,
          address: {
            street: '456 Oak Ave',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA',
          },
          location: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749],
          },
          features: {
            bedrooms: 2,
            bathrooms: 1,
            area: 1000,
          },
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.property).toHaveProperty('_id');
    });

    it('should not create property without authentication', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          title: 'New Property',
          description: 'New Description',
          propertyType: 'apartment',
          listingType: 'rent',
          price: 2000,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
