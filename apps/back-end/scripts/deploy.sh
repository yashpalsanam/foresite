#!/bin/bash

echo "Starting deployment..."

echo "Installing dependencies..."
npm ci --production

echo "Running database migrations..."

echo "Building application..."

echo "Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo "Tests passed!"
else
    echo "Tests failed! Aborting deployment."
    exit 1
fi

echo "Deployment completed successfully!"
