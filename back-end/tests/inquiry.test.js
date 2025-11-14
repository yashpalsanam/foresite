import request from 'supertest';
import { app } from '../server.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import { generateAccessToken } from '../config/jwtConfig.js';

describe('Inquiry Endpoints', () => {
  let token;
  let userId;
  let propertyId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });

    userId = user._id;
    token = generateAccessToken({ id: user._id, role: user.role });

    const property = await Property.create({
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

    propertyId = property._id;
  });

  describe('POST /api/inquiries', () => {
    it('should create a new inquiry', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .set('Authorization', `Bearer ${token}`)
        .send({
          property: propertyId,
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          message: 'I am interested in this property',
          inquiryType: 'viewing',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.inquiry).toHaveProperty('_id');
    });
  });

  describe('GET /api/inquiries/my-inquiries', () => {
    beforeEach(async () => {
      await Inquiry.create({
        property: propertyId,
        user: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'Test inquiry',
        inquiryType: 'information',
      });
    });

    it('should get user inquiries', async () => {
      const res = await request(app)
        .get('/api/inquiries/my-inquiries')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.inquiries).toBeInstanceOf(Array);
      expect(res.body.data.inquiries.length).toBeGreaterThan(0);
    });
  });
});
