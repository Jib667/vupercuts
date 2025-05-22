#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Install dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build the frontend
echo "Building frontend..."
npm run build

echo "Ready for deployment to Vercel!"
echo "Push changes to GitHub and deploy on Vercel dashboard or run 'vercel' command." 