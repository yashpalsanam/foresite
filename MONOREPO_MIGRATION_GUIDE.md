# Foresite Monorepo Migration Guide

## 🎉 Migration Complete!

Your Foresite project has been successfully migrated to a monorepo structure using **Turborepo** and **pnpm**.

## 📋 What Changed

### 1. **Project Structure**
```
Before:                          After:
foresite-admin-panel/           foresite/
foresite-website/                 ├── apps/
foresite-backend/                 │   ├── admin-panel/
                                  │   ├── front-end/
                                  │   └── back-end/
                                  ├── packages/
                                  └── scripts/
```

### 2. **Package Names**
All packages now use the `@foresite` scope:
- `foresite-admin-panel` → `@foresite/admin-panel`
- `foresite-website` → `@foresite/front-end`
- `foresite-backend` → `@foresite/back-end`

### 3. **Build Configuration**
- **Turborepo** manages task orchestration
- Proper caching for faster builds
- Parallel execution of tasks

### 4. **Environment Variables**
- Each app maintains its own `.env` files
- Root `.env.example` documents all variables
- Port conflict resolved (back-end now on 3001)

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
pnpm install

# Or run the setup script
./scripts/setup.sh
```

### Development
```bash
# Start all apps
pnpm dev

# Start individual apps
pnpm dev:admin    # Admin Panel on :3000
pnpm dev:front    # Front-end on :5000
pnpm dev:back     # Back-end on :3001
```

### Building
```bash
# Build all apps
pnpm build

# Build individual apps
pnpm build:admin
pnpm build:front
```

## 📦 New Files Added

### Configuration Files
- [.prettierrc](.prettierrc) - Code formatting rules
- [.prettierignore](.prettierignore) - Files to ignore in formatting
- [.editorconfig](.editorconfig) - Editor configuration
- [.nvmrc](.nvmrc) - Node version specification
- [turbo.json](turbo.json) - Turborepo configuration
- [pnpm-workspace.yaml](pnpm-workspace.yaml) - pnpm workspace definition

### Documentation
- [README.md](README.md) - Comprehensive project documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [MONOREPO_MIGRATION_GUIDE.md](MONOREPO_MIGRATION_GUIDE.md) - This file

### Environment Files
- [.env.example](.env.example) - Root environment variables documentation
- [apps/admin-panel/.env.example](apps/admin-panel/.env.example) - Updated with correct port
- [apps/back-end/.env.example](apps/back-end/.env.example) - Updated with correct port

### Scripts
- [scripts/setup.sh](scripts/setup.sh) - Automated setup script
- [scripts/clean.sh](scripts/clean.sh) - Clean build artifacts
- [scripts/check-ports.sh](scripts/check-ports.sh) - Check port availability

### VS Code Integration
- [.vscode/settings.json](.vscode/settings.json) - Editor settings
- [.vscode/extensions.json](.vscode/extensions.json) - Recommended extensions
- [.vscode/launch.json](.vscode/launch.json) - Debug configurations

### Docker Support
- [docker-compose.yml](docker-compose.yml) - Multi-container setup
- [apps/back-end/Dockerfile](apps/back-end/Dockerfile) - Back-end container
- [apps/front-end/Dockerfile](apps/front-end/Dockerfile) - Front-end container
- [apps/admin-panel/Dockerfile](apps/admin-panel/Dockerfile) - Admin panel container
- [apps/admin-panel/nginx.conf](apps/admin-panel/nginx.conf) - Nginx configuration

### CI/CD
- [.github/workflows/ci.yml](.github/workflows/ci.yml) - GitHub Actions workflow
- [.github/ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md) - Bug report template
- [.github/ISSUE_TEMPLATE/feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md) - Feature request template
- [.github/pull_request_template.md](.github/pull_request_template.md) - PR template

### Updated Files
- [package.json](package.json) - Root package with Turbo scripts
- [.gitignore](.gitignore) - Enhanced with monorepo-specific patterns
- [apps/admin-panel/package.json](apps/admin-panel/package.json) - Updated name
- [apps/front-end/package.json](apps/front-end/package.json) - Updated name
- [apps/back-end/package.json](apps/back-end/package.json) - Updated name

## 🔧 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Admin Panel | 3000 | http://localhost:3000 |
| **Back-end API** | **3001** | **http://localhost:3001** |
| Front-end | 5000 | http://localhost:5000 |

**⚠️ Important**: The back-end port was changed from 5000 to 3001 to avoid conflicts with the front-end.

## 🐳 Docker Support

Start all services with Docker:
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Back-end API on port 3001
- Front-end on port 5000
- Admin Panel on port 3000

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter @foresite/admin-panel test
pnpm --filter @foresite/front-end test
pnpm --filter @foresite/back-end test

# Watch mode
pnpm test:watch
```

## 📝 Code Quality

```bash
# Lint all apps
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

## 🛠️ Maintenance Scripts

```bash
# Clean build artifacts
pnpm clean
# or
./scripts/clean.sh

# Check port availability
./scripts/check-ports.sh

# Setup development environment
./scripts/setup.sh
```

## 📚 Additional Resources

### Recommended VS Code Extensions
The following extensions are recommended (see [.vscode/extensions.json](.vscode/extensions.json)):
- Prettier - Code formatter
- ESLint - Linting
- Tailwind CSS IntelliSense
- Path Intellisense
- ES7+ React/Redux/React-Native snippets
- DotEnv - Syntax highlighting for .env files
- EditorConfig - Maintain consistent coding styles

### Debugging in VS Code
Use the pre-configured debug configurations:
- `F5` to start debugging
- Select the app to debug from the dropdown
- Or use "Debug All Apps" to debug everything

## 🔐 Security Checklist

Before deploying to production:
- [ ] Update all `.env` files with production values
- [ ] Change all default secrets and passwords
- [ ] Review CORS settings in back-end
- [ ] Enable HTTPS in production
- [ ] Set up proper database backups
- [ ] Configure rate limiting
- [ ] Enable monitoring and error tracking

## 🚀 Deployment

### Option 1: Individual Deployments
Each app can be deployed independently to different platforms:
- **Admin Panel**: Static hosting (Netlify, Vercel, Cloudflare Pages)
- **Front-end**: Next.js hosting (Vercel, Netlify)
- **Back-end**: Node.js hosting (Railway, Render, DigitalOcean)

### Option 2: Docker Deployment
Use the provided Docker configuration to deploy all services together:
```bash
docker-compose -f docker-compose.yml up -d
```

### Option 3: CI/CD Pipeline
The GitHub Actions workflow automatically:
- Runs tests on every push
- Lints and formats code
- Builds all apps
- Can be extended to deploy automatically

## 📈 Performance Improvements

With Turborepo, you get:
- **Incremental builds**: Only rebuild what changed
- **Remote caching**: Share build artifacts across team
- **Parallel execution**: Run tasks in parallel
- **Task pipelining**: Smart dependency management

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📞 Support

- **Documentation**: See [README.md](README.md)
- **Issues**: Create an issue using the provided templates
- **Questions**: Start a discussion on GitHub

## ✅ Migration Checklist

- [x] Package names updated with `@foresite` scope
- [x] Root package.json with Turbo scripts
- [x] Turborepo configuration
- [x] Environment files documented
- [x] Port conflicts resolved
- [x] Build outputs configured
- [x] Docker support added
- [x] CI/CD pipeline created
- [x] VS Code integration
- [x] Documentation completed
- [ ] Team onboarded to new structure
- [ ] Production deployment configured

## 🎯 Next Steps

1. **Review Configuration**: Check all `.env` files and update with your values
2. **Test Locally**: Run `pnpm dev` and verify all apps work
3. **Run Tests**: Ensure all tests pass with `pnpm test`
4. **Update Team**: Share this guide with your team
5. **Set Up CI/CD**: Configure GitHub Actions secrets for deployment
6. **Deploy**: Follow deployment instructions above

---

**Need Help?** Refer to the comprehensive [README.md](README.md) or create an issue.

**Happy Coding! 🚀**
