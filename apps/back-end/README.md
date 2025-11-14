# Foresite Backend API

Production-ready backend for Foresite real estate management platform.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Cache:** Redis
- **Storage:** Cloudinary
- **Auth:** JWT + Firebase Admin SDK
- **Real-time:** Socket.io
- **Notifications:** Firebase Cloud Messaging
- **Testing:** Jest + Supertest
- **Security:** Helmet, CSRF, Rate Limiting, XSS Protection

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account
- Redis instance
- Cloudinary account
- Firebase project with Admin SDK

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Fill in all required environment variables
3. Add Firebase service account JSON

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Testing

```bash
npm test
npm run test:coverage
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/users` - List users
- `POST /api/inquiries` - Submit inquiry

See `/docs/API_REFERENCE.md` for complete documentation.

## Project Structure

```
backend/
├── config/          # Configuration files
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API routes
├── middlewares/     # Express middlewares
├── utils/           # Helper functions
├── tests/           # Test suites
├── scripts/         # Automation scripts
├── jobs/            # Background jobs
├── logs/            # Log files
└── docs/            # Documentation
```

## Security Features

- HTTPS enforcement
- JWT authentication
- CSRF protection
- Rate limiting
- XSS sanitization
- MongoDB injection prevention
- Helmet security headers

## License

MIT
