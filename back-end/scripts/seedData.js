import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import { logger } from '../config/logger.js';

dotenv.config();

const seedUsers = async () => {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@foresite.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
      isVerified: true,
    },
    {
      name: 'Agent John',
      email: 'agent@foresite.com',
      password: 'agent123',
      role: 'agent',
      phone: '0987654321',
      isVerified: true,
    },
    {
      name: 'Test User',
      email: 'user@foresite.com',
      password: 'user123',
      role: 'user',
      phone: '5555555555',
      isVerified: true,
    },
  ];

  await User.insertMany(users);
  logger.info(`${users.length} users seeded`);
};

const seedProperties = async () => {
  const agent = await User.findOne({ role: 'agent' });

  const properties = [
    {
      title: 'Luxury Villa with Ocean View',
      description: 'Beautiful luxury villa with stunning ocean views and modern amenities',
      propertyType: 'villa',
      status: 'available',
      listingType: 'sale',
      price: 1500000,
      address: {
        street: '123 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        zipCode: '33139',
        country: 'USA',
      },
      location: {
        type: 'Point',
        coordinates: [-80.1300, 25.7907],
      },
      features: {
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        areaUnit: 'sqft',
        yearBuilt: 2020,
        parking: 3,
        floors: 2,
      },
      amenities: ['Pool', 'Gym', 'Garden', 'Security', 'Beach Access'],
      owner: agent._id,
      agent: agent._id,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'Modern Downtown Apartment',
      description: 'Stylish apartment in the heart of downtown',
      propertyType: 'apartment',
      status: 'available',
      listingType: 'rent',
      price: 2500,
      address: {
        street: '456 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      location: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484],
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        areaUnit: 'sqft',
        yearBuilt: 2018,
        parking: 1,
        floors: 1,
      },
      amenities: ['Elevator', 'Gym', 'Concierge', 'Rooftop'],
      owner: agent._id,
      agent: agent._id,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'Suburban Family House',
      description: 'Perfect family home in quiet neighborhood',
      propertyType: 'house',
      status: 'available',
      listingType: 'sale',
      price: 450000,
      address: {
        street: '789 Oak Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'USA',
      },
      location: {
        type: 'Point',
        coordinates: [-97.7431, 30.2672],
      },
      features: {
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        areaUnit: 'sqft',
        yearBuilt: 2015,
        parking: 2,
        floors: 2,
      },
      amenities: ['Garden', 'Garage', 'Backyard', 'Storage'],
      owner: agent._id,
      agent: agent._id,
      isPublished: true,
    },
  ];

  await Property.insertMany(properties);
  logger.info(`${properties.length} properties seeded`);
};

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Property.deleteMany({});
    logger.info('Existing data cleared');

    await seedUsers();
    await seedProperties();

    logger.info('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
