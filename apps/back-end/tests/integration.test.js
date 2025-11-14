import request from 'supertest';
import { app } from '../server.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

describe('Integration Tests', () => {
  it('should complete full user flow', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration User',
        email: 'integration@example.com',
        password: 'password123',
        role: 'agent',
      });

    expect(registerRes.statusCode).toBe(201);
    const { accessToken } = registerRes.body.data;

    const propertyRes = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Integration Property',
        description: 'Integration Test',
        propertyType: 'house',
        listingType: 'sale',
        price: 250000,
        address: {
          street: '789 Test St',
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
          bedrooms: 4,
          bathrooms: 3,
          area: 2000,
        },
      });

    expect(propertyRes.statusCode).toBe(201);
    const propertyId = propertyRes.body.data.property._id;

    const getPropertyRes = await request(app).get(`/api/properties/${propertyId}`);

    expect(getPropertyRes.statusCode).toBe(200);
    expect(getPropertyRes.body.data.property.title).toBe('Integration Property');
  });
});
