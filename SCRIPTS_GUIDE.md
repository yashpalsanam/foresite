# Scripts Guide

Complete reference for all available scripts in the Foresite monorepo.

## 📦 Root Package Scripts

All root scripts use Turborepo to manage tasks across apps.

### Development Scripts

#### `pnpm dev`
Start all apps in development mode simultaneously.
```bash
pnpm dev
```
This starts:
- Admin Panel on http://localhost:3000
- Front-end on http://localhost:5000
- Back-end on http://localhost:3001

#### `pnpm dev:admin`
Start only the Admin Panel.
```bash
pnpm dev:admin
```

#### `pnpm dev:front`
Start only the Front-end.
```bash
pnpm dev:front
```

#### `pnpm dev:back`
Start only the Back-end API.
```bash
pnpm dev:back
```

### Build Scripts

#### `pnpm build`
Build all apps for production.
```bash
pnpm build
```

#### `pnpm build:admin`
Build only the Admin Panel.
```bash
pnpm build:admin
```
Output: `apps/admin-panel/dist/`

#### `pnpm build:front`
Build only the Front-end.
```bash
pnpm build:front
```
Output: `apps/front-end/.next/`

### Testing Scripts

#### `pnpm test`
Run tests for all apps.
```bash
pnpm test
```

#### `pnpm test:watch`
Run tests in watch mode.
```bash
pnpm test:watch
```

### Code Quality Scripts

#### `pnpm lint`
Lint all apps.
```bash
pnpm lint
```

#### `pnpm lint:fix`
Fix linting issues automatically.
```bash
pnpm lint:fix
```

#### `pnpm format`
Format all code with Prettier.
```bash
pnpm format
```

### Maintenance Scripts

#### `pnpm clean`
Clean all build artifacts and caches.
```bash
pnpm clean
```

## 🔧 App-Specific Scripts

Run app-specific scripts using the `--filter` flag:

### Admin Panel Scripts

```bash
# Development
pnpm --filter @foresite/admin-panel dev

# Build
pnpm --filter @foresite/admin-panel build

# Preview production build
pnpm --filter @foresite/admin-panel preview

# Tests
pnpm --filter @foresite/admin-panel test
pnpm --filter @foresite/admin-panel test:ui
pnpm --filter @foresite/admin-panel test:coverage

# Linting
pnpm --filter @foresite/admin-panel lint
pnpm --filter @foresite/admin-panel lint:fix
```

### Front-end Scripts

```bash
# Development
pnpm --filter @foresite/front-end dev

# Build
pnpm --filter @foresite/front-end build

# Start production server
pnpm --filter @foresite/front-end start

# Tests
pnpm --filter @foresite/front-end test
pnpm --filter @foresite/front-end test:ci

# Linting
pnpm --filter @foresite/front-end lint

# Bundle analysis
pnpm --filter @foresite/front-end analyze

# Export static site
pnpm --filter @foresite/front-end export
```

### Back-end Scripts

```bash
# Development (with nodemon)
pnpm --filter @foresite/back-end dev

# Production
pnpm --filter @foresite/back-end start

# Tests
pnpm --filter @foresite/back-end test
pnpm --filter @foresite/back-end test:watch
pnpm --filter @foresite/back-end test:coverage

# Linting
pnpm --filter @foresite/back-end lint
pnpm --filter @foresite/back-end lint:fix

# Database
pnpm --filter @foresite/back-end backup
pnpm --filter @foresite/back-end seed

# Deployment
pnpm --filter @foresite/back-end deploy
```

## 🛠️ Utility Scripts

### Setup Script
```bash
./scripts/setup.sh
```
- Checks prerequisites (Node.js, pnpm)
- Installs dependencies
- Creates environment files
- Checks database connections

### Clean Script
```bash
./scripts/clean.sh
```
- Removes build outputs
- Cleans caches
- Optionally removes node_modules
- Cleans log files

### Port Check Script
```bash
./scripts/check-ports.sh
```
- Checks if ports 3000, 3001, 5000 are available
- Shows what's using each port
- Provides suggestions for freeing ports

## 🐳 Docker Scripts

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Start specific service
```bash
docker-compose up -d backend
docker-compose up -d frontend
docker-compose up -d admin
```

## 🔍 Advanced pnpm Commands

### Install dependency in specific app
```bash
pnpm --filter @foresite/admin-panel add axios
pnpm --filter @foresite/front-end add next-seo
pnpm --filter @foresite/back-end add express-validator
```

### Install dev dependency
```bash
pnpm --filter @foresite/admin-panel add -D vitest
```

### Remove dependency
```bash
pnpm --filter @foresite/admin-panel remove axios
```

### Update dependencies
```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update react --latest

# Update in specific app
pnpm --filter @foresite/admin-panel update
```

### List outdated packages
```bash
pnpm outdated
```

## 🚀 Common Workflows

### Starting Fresh Development
```bash
# 1. Setup environment
./scripts/setup.sh

# 2. Check ports
./scripts/check-ports.sh

# 3. Start development
pnpm dev
```

### Before Committing
```bash
# 1. Format code
pnpm format

# 2. Fix linting issues
pnpm lint:fix

# 3. Run tests
pnpm test

# 4. Ensure build works
pnpm build
```

### Clean Install
```bash
# 1. Clean everything
./scripts/clean.sh
# (Select 'y' to remove node_modules)

# 2. Fresh install
pnpm install

# 3. Verify setup
pnpm dev
```

### Production Build
```bash
# 1. Clean previous builds
pnpm clean

# 2. Install dependencies
pnpm install --frozen-lockfile

# 3. Run tests
pnpm test

# 4. Build for production
pnpm build
```

### Debugging Specific App
```bash
# Terminal 1: Start back-end only
pnpm dev:back

# Terminal 2: Start front-end only
pnpm dev:front

# Terminal 3: Start admin only
pnpm dev:admin
```

## 📊 CI/CD Scripts

The GitHub Actions workflow runs these automatically:

```yaml
# Linting
pnpm lint
pnpm format --check

# Testing
pnpm --filter @foresite/admin-panel test
pnpm --filter @foresite/front-end test
pnpm --filter @foresite/back-end test

# Building
pnpm build:admin
pnpm build:front

# Security
pnpm audit --audit-level=moderate
```

## 💡 Tips

### Run Multiple Commands
```bash
# Sequential (one after another)
pnpm lint && pnpm test && pnpm build

# Parallel (all at once)
pnpm lint & pnpm test & wait
```

### Watch Mode for Development
```bash
# Back-end already has watch mode with nodemon
pnpm dev:back

# Front-end and Admin have HMR built-in
pnpm dev:front
pnpm dev:admin
```

### Performance Profiling
```bash
# Turbo with timing information
pnpm build --profile

# Next.js bundle analysis
pnpm --filter @foresite/front-end analyze
```

### Cache Management
```bash
# Clear Turbo cache
rm -rf .turbo

# Or use the clean script
pnpm clean
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Check what's using ports
./scripts/check-ports.sh

# Kill process on specific port (macOS/Linux)
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Build Failures
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Dependency Issues
```bash
# Remove all node_modules and reinstall
./scripts/clean.sh  # Select 'y'
pnpm install
```

### Test Failures
```bash
# Run tests with verbose output
pnpm test -- --verbose

# Run specific test file
pnpm --filter @foresite/back-end test -- user.test.js
```

---

**Quick Reference Card**

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps |
| `pnpm build` | Build all apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format all code |
| `pnpm clean` | Clean artifacts |
| `./scripts/setup.sh` | Initial setup |
| `./scripts/check-ports.sh` | Check ports |
| `docker-compose up -d` | Start with Docker |
