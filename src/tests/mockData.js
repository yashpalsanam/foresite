export const mockUser = {
  _id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  isActive: true,
};

export const mockProperty = {
  _id: '456',
  title: 'Modern Apartment',
  description: 'Beautiful modern apartment in city center',
  propertyType: 'apartment',
  status: 'available',
  listingType: 'sale',
  price: 250000,
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  features: {
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    areaUnit: 'sqft',
  },
  images: [],
};

export const mockInquiry = {
  _id: '789',
  property: mockProperty,
  user: mockUser,
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '1234567890',
  message: 'Interested in viewing this property',
  inquiryType: 'viewing',
  status: 'pending',
};

export const mockNotification = {
  _id: '101',
  recipient: mockUser._id,
  title: 'New Inquiry',
  message: 'You have a new inquiry',
  type: 'info',
  isRead: false,
  createdAt: new Date(),
};
