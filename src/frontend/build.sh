#!/bin/bash

# Install dependencies
npm install

# Build the React app
npm run build

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ Build successful! index.html found."
    ls -la build/
else
    echo "❌ Build failed! index.html not found."
    exit 1
fi 