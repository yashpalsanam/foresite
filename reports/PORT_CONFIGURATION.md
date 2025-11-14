# Foresite Platform - Port Configuration

This document outlines the port assignments for all services in the Foresite real estate platform to avoid conflicts and ensure smooth development and deployment.

---

## Port Assignments

### Development Environment

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Admin Panel** (Vite) | 3000 | http://localhost:3000 | Admin dashboard for property management |
| **Back-End API** (Express) | 3001 | http://localhost:3001 | REST API server |
| **Admin Preview** (Vite) | 3002 | http://localhost:3002 | Production preview of admin panel |
| **Front-End** (Next.js) | 5000 | http://localhost:5000 | Public-facing website |
| **Redis** | 6379 | localhost:6379 | Cache and session storage |

---

## Configuration Files

### Admin Panel
**File:** `/foresite/admin-panel/vite.config.js`
```javascript
server: {
  port: 3000,  // Changed from 5000 to avoid conflict
  host: '0.0.0.0',
  hmr: {
    protocol: 'ws',
    host: 'localhost',
    port: 3000,
  }
}
```

**File:** `/foresite/admin-panel/.env.local`
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_SOCKET_URL=http://localhost:3001
```

**Start Command:**
```bash
cd admin-panel
npm run dev
# Opens on http://localhost:3000
```

---

### Front-End (Next.js)
**File:** `/foresite/front-end/package.json`
```json
"scripts": {
  "dev": "next dev -p 5000 -H 0.0.0.0",
  "start": "next start -p 5000 -H 0.0.0.0"
}
```

**File:** `/foresite/front-end/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:5000
```

**Start Command:**
```bash
cd front-end
npm run dev
# Opens on http://localhost:5000
```

---

### Back-End API
**File:** `/foresite/back-end/server.js`
```javascript
const PORT = process.env.BACKEND_PORT || 3001;
```

**File:** `/foresite/back-end/.env.local`
```env
PORT=3001
BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5000
ADMIN_PANEL_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5000,http://localhost:3002
```

**Start Command:**
```bash
cd back-end
npm run dev
# Runs on http://localhost:3001
```

---

## CORS Configuration

The backend allows requests from:
- **Admin Panel**: `http://localhost:3000`
- **Front-End**: `http://localhost:5000`
- **Admin Preview**: `http://localhost:3002`

**File:** `/foresite/back-end/.env`
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5000,http://localhost:3002
```

---

## Starting All Services

### Option 1: Start Individually

```bash
# Terminal 1 - Backend API
cd back-end
npm run dev

# Terminal 2 - Admin Panel
cd admin-panel
npm run dev

# Terminal 3 - Front-End
cd front-end
npm run dev
```

### Option 2: Use Process Manager (Recommended)

Create a file `ecosystem.config.js` in the root:

```javascript
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './back-end',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      }
    },
    {
      name: 'admin-panel',
      cwd: './admin-panel',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      }
    },
    {
      name: 'front-end',
      cwd: './front-end',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      }
    }
  ]
};
```

Then use PM2:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 logs
pm2 stop all
```

---

## Troubleshooting Port Conflicts

### Check What's Using a Port

```bash
# Linux/Mac
lsof -i :3000
lsof -i :3001
lsof -i :5000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5000
```

### Kill a Process Using a Port

```bash
# Linux/Mac
kill -9 $(lsof -t -i:3000)

# Windows (use PID from netstat)
taskkill /PID <PID> /F
```

### Common Errors

#### Error: "EADDRINUSE: address already in use 0.0.0.0:5000"
**Cause:** Admin panel was previously running on port 5000, now front-end is trying to use it.

**Solution:**
1. Stop all running dev servers
2. Pull latest changes (admin panel now uses port 3000)
3. Restart servers in order: backend → admin-panel → front-end

---

## Production Environment

### Recommended Port Assignments

| Service | Port | Notes |
|---------|------|-------|
| **Admin Panel** | 80/443 | admin.foresite.com |
| **Front-End** | 80/443 | foresite.com |
| **Back-End API** | Internal | Behind reverse proxy |
| **Redis** | Internal | Not exposed |

### Nginx Reverse Proxy Configuration

```nginx
# Front-End (foresite.com)
server {
    listen 80;
    server_name foresite.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel (admin.foresite.com)
server {
    listen 80;
    server_name admin.foresite.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API (api.foresite.com)
server {
    listen 80;
    server_name api.foresite.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Environment-Specific Configuration

### Development (.env.local)
```env
# Backend
PORT=3001
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5000
ADMIN_PANEL_URL=http://localhost:3000

# Admin Panel
VITE_API_URL=http://localhost:3001/api/v1

# Front-End
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:5000
```

### Production (.env.production)
```env
# Backend
PORT=3001
BACKEND_URL=https://api.foresite.com
FRONTEND_URL=https://foresite.com
ADMIN_PANEL_URL=https://admin.foresite.com

# Admin Panel
VITE_API_URL=https://api.foresite.com/api/v1

# Front-End
NEXT_PUBLIC_API_BASE_URL=https://api.foresite.com/api/v1
NEXT_PUBLIC_SITE_URL=https://foresite.com
```

---

## API Endpoints

All API endpoints are accessible via the backend server:

| Endpoint | URL (Dev) | URL (Prod) |
|----------|-----------|------------|
| Health Check | http://localhost:3001/api/v1/health | https://api.foresite.com/api/v1/health |
| API Docs | http://localhost:3001/api/v1/docs | https://api.foresite.com/api/v1/docs |
| Auth | http://localhost:3001/api/v1/auth | https://api.foresite.com/api/v1/auth |
| Properties | http://localhost:3001/api/v1/properties | https://api.foresite.com/api/v1/properties |
| Users | http://localhost:3001/api/v1/users | https://api.foresite.com/api/v1/users |
| Admin | http://localhost:3001/api/v1/admin | https://api.foresite.com/api/v1/admin |

---

## WebSocket Connections

### Admin Panel HMR (Hot Module Replacement)
- **Protocol:** ws://
- **Host:** localhost
- **Port:** 3000
- **URL:** ws://localhost:3000

### Socket.IO (Real-time features)
- **Development:** http://localhost:3001
- **Production:** https://api.foresite.com

---

## Quick Reference

### Access URLs (Development)

```
Admin Panel:  http://localhost:3000
Front-End:    http://localhost:5000
API:          http://localhost:3001
API Docs:     http://localhost:3001/api/v1/docs
Health Check: http://localhost:3001/api/v1/health
```

### Default Credentials

**Admin User:**
- Email: admin@foresite.com
- Password: (set in database)

---

## Change Log

### 2025-01-14
- **BREAKING CHANGE:** Admin panel moved from port 5000 → 3000
- Reason: Avoid conflict with Next.js front-end
- Updated: vite.config.js, .env files, CORS configuration
- Action Required: Stop all servers and restart

---

## Support

If you encounter port conflicts or connection issues:

1. Check this document for correct port assignments
2. Verify environment files are up to date
3. Kill all running processes and restart in order
4. Check firewall settings if running in production
5. Verify CORS settings in backend .env file

---

**Last Updated:** 2025-01-14
**Maintained By:** Development Team
