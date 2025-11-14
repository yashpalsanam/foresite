#!/bin/bash

# Foresite Monorepo Clean Script
# Removes all build artifacts, caches, and node_modules

set -e

echo "🧹 Cleaning Foresite Monorepo..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Clean build outputs
echo "🗑️  Removing build outputs..."
rm -rf apps/admin-panel/dist
rm -rf apps/front-end/.next
rm -rf apps/front-end/out
rm -rf apps/back-end/dist

# Clean caches
echo "🗑️  Removing caches..."
rm -rf .turbo
rm -rf apps/admin-panel/.turbo
rm -rf apps/front-end/.turbo
rm -rf apps/back-end/.turbo
rm -rf .cache

# Clean node_modules (optional - ask user)
read -p "Remove all node_modules? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing node_modules..."
    rm -rf node_modules
    rm -rf apps/admin-panel/node_modules
    rm -rf apps/front-end/node_modules
    rm -rf apps/back-end/node_modules
    echo -e "${GREEN}✓ node_modules removed${NC}"
    echo ""
    echo "Run 'pnpm install' to reinstall dependencies"
else
    echo "Skipping node_modules removal"
fi

# Clean logs
echo "🗑️  Removing log files..."
find . -name "*.log" -type f -delete
rm -rf apps/back-end/logs/*.log 2>/dev/null || true

# Clean test coverage
echo "🗑️  Removing test coverage..."
rm -rf coverage
rm -rf apps/*/coverage

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
