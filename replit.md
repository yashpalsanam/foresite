# Foresite Real Estate - Replit Migration

## Overview
Full-stack real estate management platform migrated from Vercel to Replit. The application consists of three main components running on separate ports for proper client/server separation.

## Project Structure
```
├── front-end/        # Next.js 14 - User-facing website (Port 5000)
├── back-end/         # Express.js API - Backend server (Port 3001)
├── admin-panel/      # Vite/React - Admin dashboard (Port 3002)
```

## Recent Changes (2024-11-14)
**Vercel to Replit Migration**
- ✅ Configured Next.js frontend for Replit (port 5000, host 0.0.0.0)
- ✅ Configured Express backend API (port 3001, host 0.0.0.0)
- ✅ Configured Vite admin panel (port 3002, host 0.0.0.0)
- ✅ Updated API client URLs to point to correct backend port
- ✅ Installed all dependencies for all three projects
- ✅ Set up workflow to run frontend on port 5000
- ✅ Fixed authentication flow (accessToken naming) in admin panel
- ✅ Made Redis and Firebase optional for development
- ✅ Configured CORS to allow Replit domains
- ✅ Optimized dashboard queries (12-month user growth, 5 recent items)
- ✅ Added property deletion with confirmation dialog in properties listings

**Frontend Website Features Complete**
- ✅ Created AuthContext for user authentication management
- ✅ Created login and register pages with form validation
- ✅ Updated Navbar with login/logout/profile functionality
- ✅ Configured environment variables for Replit (.env.local and .env.production)
- ✅ Set up all three workflows correctly (frontend:5000, backend:3001, admin:3002)
- ✅ Verified CORS allows both Replit domains and localhost for development
- ✅ Tested frontend running successfully with authentication UI

**Admin Dashboard Features Complete**
- ✅ Implemented Analytics page with comprehensive charts (pie, bar, doughnut)
  - User statistics (total, active, by role)
  - Property statistics (by status, by type)
  - Inquiry statistics (by type, completion rates)
  - Device usage analytics
- ✅ Implemented Audit Logs page showing recent system activity
  - Activity log table with user registrations, property additions, inquiries
  - Activity statistics cards
  - Chronological activity display
- ✅ Enhanced Users page with management actions
  - Activate/deactivate user toggle buttons
  - Delete user functionality
  - Status and role indicators
- ✅ Enhanced Inquiries page with status management
  - Status update buttons (pending, completed, cancelled)
  - Visual status indicators
  - Property and user information display
- ✅ Enhanced Settings page
  - Profile information update
  - Password change functionality
  - Role display
- ✅ Enhanced Dashboard with visualizations
  - User growth chart (last 12 months)
  - Property status distribution chart
  - Recent properties, users, and inquiries sections
  - Clickable activity cards with navigation
- ✅ AddProperty form with keyword and amenity management
  - Add/remove keywords with tag-based UI (blue badges)
  - Add/remove amenities with tag-based UI (green badges)
  - Input fields with "Add" buttons and Enter key support
  - Keywords and amenities sent to backend with property creation

## Architecture

### Port Configuration (Replit-specific)
- **Frontend (Next.js)**: Port 5000 - Main user-facing website (webview)
- **Backend (Express API)**: Port 3001 - API server for data and authentication
- **Admin Panel (Vite)**: Port 3002 - Administrative interface (console)

### Authentication Flow
All three applications share a unified authentication system:

1. **Backend Auth Routes** (`/api/v1/auth`):
   - POST `/auth/login` - User login
   - POST `/auth/register` - User registration
   - POST `/auth/logout` - User logout
   - POST `/auth/refresh-token` - Token refresh
   - GET `/auth/me` - Get current user profile

2. **Frontend Authentication**:
   - Uses JWT tokens stored in localStorage
   - API client automatically includes Bearer token in requests
   - Connects to backend at `http://localhost:3001/api/v1`

3. **Admin Panel Authentication**:
   - Separate admin authentication flow
   - Uses Firebase for additional features
   - Token-based authentication with refresh token support
   - Connects to backend at `http://localhost:3001/api/v1`

## Environment Variables

### Required for Backend (back-end/.env)
```
# Database
MONGO_URI=<MongoDB connection string>
MONGO_DB_NAME=foresite

# Authentication
JWT_SECRET=<secure random string>
JWT_REFRESH_SECRET=<secure random string>
SESSION_SECRET=<provided via Replit Secrets>

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=<your cloudinary cloud name>
CLOUDINARY_API_KEY=<your cloudinary api key>
CLOUDINARY_API_SECRET=<your cloudinary api secret>

# Google Maps
GOOGLE_MAPS_API_KEY=<your google maps api key>

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=<your firebase project id>
FIREBASE_PRIVATE_KEY=<your firebase private key>
FIREBASE_CLIENT_EMAIL=<your firebase client email>

# Server Configuration
BACKEND_PORT=3001
NODE_ENV=development
API_VERSION=v1

# Optional
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Required for Frontend (front-end/.env.local)
```
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1

# Cloudinary (Public)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your cloudinary cloud name>

# Google Maps (Public)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your google maps api key>

# Site Configuration
NEXT_PUBLIC_SITE_URL=<your replit deployment url>
```

### Required for Admin Panel (admin-panel/.env)
```
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_URL=http://localhost:3001         # Used by Vite dev proxy
VITE_SOCKET_URL=http://localhost:3001

# Firebase (Admin Panel)
VITE_FIREBASE_API_KEY=<your firebase api key>
VITE_FIREBASE_AUTH_DOMAIN=<your firebase auth domain>
VITE_FIREBASE_PROJECT_ID=<your firebase project id>
VITE_FIREBASE_STORAGE_BUCKET=<your firebase storage bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your firebase messaging sender id>
VITE_FIREBASE_APP_ID=<your firebase app id>
VITE_FIREBASE_VAPID_KEY=<your firebase vapid key>

# App Configuration
VITE_APP_NAME=Foresite Admin
VITE_APP_VERSION=1.0.0
```

## Getting Started

### 1. Set Up Environment Variables
Add all required environment variables to Replit Secrets (lock icon in sidebar). The SESSION_SECRET is already provided.

### 2. Current Status
- ✅ **Frontend**: Running on port 5000 with authentication UI
- ✅ **Backend**: Running on port 3001 with MongoDB Atlas connected
- ✅ **Admin Panel**: Running on port 3002 with full dashboard features

### 3. To Start Backend
Once you've provided the required environment variables:
```bash
cd back-end && npm start
```

### 4. To Start Admin Panel
Once you've configured Firebase credentials:
```bash
cd admin-panel && npm run dev
```

## Dependencies Installed
- **front-end**: 742 packages (Next.js 14, React 18, Tailwind CSS, etc.)
- **back-end**: 785 packages (Express, Mongoose, Socket.io, etc.)
- **admin-panel**: 554 packages (Vite, React, Chart.js, etc.)

## Security Notes
- Client/server separation properly maintained
- All three applications run on separate ports
- JWT-based authentication with refresh tokens
- Session secrets managed via Replit Secrets
- CORS configured for development and production
- Rate limiting enabled on authentication endpoints

## Next Steps
1. **Add Environment Variables**: Provide MongoDB URI and other required API keys via Replit Secrets
2. **Test Backend**: Start the backend server and verify database connection
3. **Test Admin Panel**: Configure Firebase and test admin authentication
4. **End-to-End Testing**: Verify property listings, authentication, and image uploads
5. **Deployment**: Configure deployment settings for production

**Frontend User Features Complete (2024-11-14)**
- ✅ Search by location with autocomplete and filters on homepage
- ✅ Property statistics display (Total, For Sale, For Rent, Sold)
- ✅ Night/dark theme toggle with comprehensive CSS coverage
- ✅ Favorites feature - add/remove properties with localStorage persistence
- ✅ Favorites page - display and manage saved properties
- ✅ Contact form with backend API integration (/inquiries/public)
- ✅ Authentication UI (Login/Register pages, dynamic Navbar)
- ✅ Property details page with Google Maps integration
- ✅ PropertyCard displays Cloudinary images with proper fallback
- ✅ Property search includes keywords and amenities

**Property Details Page Enhancement (2024-11-14)**
- ✅ Google Maps integration showing property location with marker
- ✅ Proper address display using property.address fields (street, city, state)
- ✅ Keywords section displaying property tags in blue badges
- ✅ PropertySpecs component showing numeric details (bedrooms, bathrooms, area, etc.)
- ✅ PropertyFeatures component showing amenities with icons
- ✅ Property gallery with multiple images from Cloudinary
- ✅ Fixed data structure mapping across all components (features.bedrooms, address.city)

**Backend API Enhancements**
- ✅ Public inquiry endpoint (POST /api/v1/inquiries/public) for contact form
- ✅ Property stats endpoint made public for homepage statistics
- ✅ Email confirmation sent to users who submit contact inquiries
- ✅ Keywords field added to Property model (indexed array for search)
- ✅ Property search now includes keywords and amenities in query
- ✅ Backend property structure uses nested objects (features, address, location)

**Dark Theme Implementation**
- ✅ Theme toggle button in Navbar (moon/sun icons)
- ✅ ThemeContext manages theme state with localStorage persistence
- ✅ CSS variables for dark mode colors (text, background, borders)
- ✅ Dark mode styles for all components (cards, inputs, buttons, links, etc.)
- ✅ Smooth transitions between light and dark themes

## Known Issues
- Backend requires MongoDB connection to start (MONGO_URI needed)
- Admin panel requires Firebase configuration (multiple VITE_FIREBASE_* variables needed)
- Some deprecated packages in backend (csurf, multer@1.x) - consider updating in future
- Database currently empty (property statistics show 0 until properties are added)

## User Preferences
- Package manager: npm
- Node.js version: 20.x
- Migrated from Vercel
