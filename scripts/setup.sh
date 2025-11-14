#!/bin/bash

# Foresite Monorepo Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up Foresite Monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Please install pnpm: npm install -g pnpm@8.15.0"
    exit 1
fi

echo -e "${GREEN}✓ pnpm is installed${NC}"

# Check Node version
REQUIRED_NODE_VERSION="18"
CURRENT_NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$CURRENT_NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version is compatible${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Set up environment files
echo "🔧 Setting up environment files..."

# Admin Panel
if [ ! -f apps/admin-panel/.env.local ]; then
    echo "Creating apps/admin-panel/.env.local..."
    cp apps/admin-panel/.env.example apps/admin-panel/.env.local
    echo -e "${YELLOW}⚠️  Please update apps/admin-panel/.env.local with your configuration${NC}"
fi

# Front-end
if [ ! -f apps/front-end/.env.local ]; then
    echo "Creating apps/front-end/.env.local..."
    cp apps/front-end/.env.local apps/front-end/.env.local 2>/dev/null || echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1" > apps/front-end/.env.local
    echo -e "${YELLOW}⚠️  Please update apps/front-end/.env.local with your configuration${NC}"
fi

# Back-end
if [ ! -f apps/back-end/.env ]; then
    echo "Creating apps/back-end/.env..."
    cp apps/back-end/.env.example apps/back-end/.env
    echo -e "${YELLOW}⚠️  Please update apps/back-end/.env with your configuration${NC}"
fi

echo -e "${GREEN}✓ Environment files created${NC}"

# Check if MongoDB is running (optional)
echo "🗄️  Checking database connections..."
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB CLI is installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB CLI not found. Make sure MongoDB is installed and running${NC}"
fi

# Check if Redis is running (optional)
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis is not running. Start it with: redis-server${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Redis CLI not found. Redis is optional but recommended${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update environment files with your configuration"
echo "2. Start the development servers: pnpm dev"
echo "3. Or start individual apps:"
echo "   - Admin Panel:  pnpm dev:admin"
echo "   - Front-end:    pnpm dev:front"
echo "   - Back-end:     pnpm dev:back"
echo ""
echo "For more information, see README.md"
