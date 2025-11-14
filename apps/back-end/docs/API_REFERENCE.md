# Foresite API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens.

Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "user"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Users

#### Get All Users (Admin)
```http
GET /users?page=1&limit=10&role=user&search=john
Authorization: Bearer <admin_token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Create User (Admin)
```http
POST /users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "agent"
}
```

#### Update User (Admin)
```http
PUT /users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "isActive": true
}
```

#### Delete User (Admin)
```http
DELETE /users/:id
Authorization: Bearer <admin_token>
```

### Properties

#### Get All Properties
```http
GET /properties?page=1&limit=12&status=available&minPrice=100000&maxPrice=500000
```

#### Get Property by ID
```http
GET /properties/:id
```

#### Create Property (Agent/Admin)
```http
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Beautiful House",
  "description": "A beautiful house in great location",
  "propertyType": "house",
  "listingType": "sale",
  "price": 350000,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "features": {
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 2000
  }
}
```

#### Upload Property Images
```http
POST /properties/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [image files]
```

### Inquiries

#### Get All Inquiries (Agent/Admin)
```http
GET /inquiries?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

#### Get My Inquiries
```http
GET /inquiries/my-inquiries
Authorization: Bearer <token>
```

#### Create Inquiry
```http
POST /inquiries
Authorization: Bearer <token>
Content-Type: application/json

{
  "property": "property_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "message": "I'm interested in this property",
  "inquiryType": "viewing"
}
```

### Notifications

#### Get Notifications
```http
GET /notifications?page=1&limit=20&isRead=false
Authorization: Bearer <token>
```

#### Mark as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All as Read
```http
PATCH /notifications/mark-all-read
Authorization: Bearer <token>
```

### Admin

#### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get Analytics
```http
GET /admin/analytics?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

#### System Health
```http
GET /admin/system-health
Authorization: Bearer <admin_token>
```

### Analytics

#### Track Event
```http
POST /analytics/track
Content-Type: application/json

{
  "eventType": "property_view",
  "eventName": "Property Viewed",
  "sessionId": "session_id",
  "relatedModel": "Property",
  "relatedId": "property_id"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalPages": 10,
    "currentPage": 1,
    "total": 100
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
