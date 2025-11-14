# Foresite Real Estate Platform

> A modern, full-stack real estate management platform built with a monorepo architecture.

## 🏗️ Architecture

This is a monorepo managed with **pnpm** and **Turborepo**, containing three main applications:

```
foresite/
├── apps/
│   ├── admin-panel/     # Admin dashboard (Vite + React)
│   ├── front-end/       # Public website (Next.js)
│   └── back-end/        # REST API (Express + MongoDB)
├── packages/            # Shared packages (future)
└── scripts/            # Build and deployment scripts
```

## 📦 Apps Overview

### Admin Panel (`@foresite/admin-panel`)
- **Framework**: React + Vite
- **Port**: `3000`
- **Features**: Property management, user management, analytics dashboard
- **Tech Stack**: React, React Router, Chart.js, Socket.io, Tailwind CSS

### Front-end (`@foresite/front-end`)
- **Framework**: Next.js 14
- **Port**: `5000`
- **Features**: Property listings, search, favorites, contact forms
- **Tech Stack**: Next.js, React, Tailwind CSS, Framer Motion, Swiper

### Back-end (`@foresite/back-end`)
- **Framework**: Express.js
- **Port**: `3001`
- **Features**: RESTful API, authentication, real-time notifications
- **Tech Stack**: Express, MongoDB, Redis, Socket.io, JWT, Cloudinary

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **MongoDB**: >= 6.0
- **Redis**: >= 7.0 (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foresite
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment files for each app:
   ```bash
   # Admin Panel
   cp apps/admin-panel/.env.example apps/admin-panel/.env.local

   # Front-end
   cp apps/front-end/.env.example apps/front-end/.env.local

   # Back-end
   cp apps/back-end/.env.example apps/back-end/.env
   ```

   Then edit each `.env` file with your actual configuration values.

4. **Start development servers**
   ```bash
   pnpm dev
   ```

   Or start individual apps:
   ```bash
   pnpm dev:admin    # Admin panel only
   pnpm dev:front    # Front-end only
   pnpm dev:back     # Back-end only
   ```

### Access the Applications

- **Admin Panel**: http://localhost:3000
- **Front-end Website**: http://localhost:5000
- **Back-end API**: http://localhost:3001/api/v1

## 📜 Available Scripts

### Development
```bash
pnpm dev              # Run all apps in development mode
pnpm dev:admin        # Run admin panel only
pnpm dev:front        # Run front-end only
pnpm dev:back         # Run back-end only
```

### Build
```bash
pnpm build            # Build all apps
pnpm build:admin      # Build admin panel only
pnpm build:front      # Build front-end only
pnpm build:back       # Build back-end (if applicable)
```

### Testing & Quality
```bash
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm lint             # Lint all apps
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
```

### Maintenance
```bash
pnpm clean            # Clean build artifacts and caches
```

## 🔧 Configuration

### Environment Variables

Each app has its own environment configuration. See [.env.example](.env.example) for a comprehensive list of all environment variables used across the monorepo.

**Key configurations:**
- **Database**: MongoDB connection string
- **Redis**: Caching and session store
- **Authentication**: JWT secrets
- **Cloud Services**: Cloudinary, Firebase, Google Maps
- **Email**: SMTP configuration

### Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Admin Panel | 3000 | http://localhost:3000 |
| Front-end | 5000 | http://localhost:5000 |
| Back-end API | 3001 | http://localhost:3001 |

## 🏗️ Project Structure

```
foresite/
├── apps/
│   ├── admin-panel/
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── pages/          # Page components
│   │   │   ├── api/            # API client
│   │   │   ├── hooks/          # Custom hooks
│   │   │   └── utils/          # Utilities
│   │   ├── public/             # Static assets
│   │   └── vite.config.js      # Vite configuration
│   │
│   ├── front-end/
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── pages/          # Next.js pages
│   │   │   ├── context/        # React context
│   │   │   ├── hooks/          # Custom hooks
│   │   │   └── utils/          # Utilities
│   │   ├── public/             # Static assets
│   │   ├── next.config.js      # Next.js configuration
│   │   └── jsconfig.json       # Path aliases
│   │
│   └── back-end/
│       ├── config/             # Configuration files
│       ├── controllers/        # Route controllers
│       ├── models/             # MongoDB models
│       ├── routes/             # API routes
│       ├── middlewares/        # Express middlewares
│       ├── utils/              # Utilities
│       ├── jobs/               # Background jobs
│       └── server.js           # Entry point
│
├── packages/                   # Shared packages (future)
├── scripts/                    # Build and deployment scripts
├── .prettierrc                 # Prettier configuration
├── .gitignore                  # Git ignore rules
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── package.json                # Root package.json
```

## 🧪 Testing

Each app has its own testing setup:

- **Admin Panel**: Vitest + React Testing Library
- **Front-end**: Jest + React Testing Library
- **Back-end**: Jest + Supertest

Run tests:
```bash
pnpm test           # All tests
pnpm test:watch     # Watch mode
```

## 📝 Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for code formatting
- **Consistent configurations** across all apps

Format your code:
```bash
pnpm format         # Format all files
pnpm lint:fix       # Fix linting issues
```

## 🚢 Deployment

### Production Build

```bash
pnpm build
```

This will build all apps in production mode.

### Individual App Deployment

Each app can be deployed independently:

**Admin Panel** (Static files):
```bash
pnpm build:admin
# Deploy the apps/admin-panel/dist folder
```

**Front-end** (Next.js):
```bash
pnpm build:front
# Deploy using Vercel, Netlify, or your preferred platform
```

**Back-end** (Node.js):
```bash
cd apps/back-end
npm start
# Or use PM2, Docker, etc.
```

### Environment-Specific Builds

Each app has environment-specific configurations:
- `.env.local` - Development
- `.env.production` - Production

## 🔐 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input sanitization and validation
- CORS configuration
- Helmet.js security headers
- MongoDB injection prevention
- XSS protection

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT

## 🛠️ Tech Stack Summary

### Frontend
- **React 18** - UI library
- **Next.js 14** - React framework with SSR
- **Vite** - Build tool for admin panel
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router** - Client-side routing (admin)

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Cloudinary** - Image storage

### DevOps
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Jest/Vitest** - Testing

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ by the Foresite Team**
