# Netlify Deployment Guide

## Overview
This guide will help you deploy the Life Makers Foundation Funds Dashboard to Netlify.

## Prerequisites
- GitHub repository: `Alaamagdy72135/life-makers-dashboard`
- Backend deployed on Render: `https://life-makers-dashboard-backend.onrender.com`

## Deployment Steps

### Step 1: Connect to Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"

### Step 2: Connect Repository
1. Choose "GitHub" as your Git provider
2. Select repository: `Alaamagdy72135/life-makers-dashboard`
3. Click "Connect"

### Step 3: Configure Build Settings
Netlify will auto-detect the configuration from `netlify.toml`:

- **Base directory**: `src/frontend`
- **Build command**: `npm run build`
- **Publish directory**: `build`

### Step 4: Environment Variables
Add this environment variable:
- **Key**: `REACT_APP_API_URL`
- **Value**: `https://life-makers-dashboard-backend.onrender.com`

### Step 5: Deploy
1. Click "Deploy site"
2. Wait for build to complete (2-5 minutes)

## Configuration Files

### netlify.toml
```toml
[build]
  base = "src/frontend"
  command = "npm run build"
  publish = "build"

[build.environment]
  REACT_APP_API_URL = "https://life-makers-dashboard-backend.onrender.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Troubleshooting

### Build Fails
- Check that all dependencies are installed
- Verify the base directory is correct
- Ensure the build command works locally

### API Connection Issues
- Verify the backend URL is correct
- Check CORS settings on the backend
- Ensure environment variables are set

### Routing Issues
- The redirect rule handles client-side routing
- All routes redirect to index.html for SPA

## Features
- ✅ React SPA with client-side routing
- ✅ Material-UI components
- ✅ Recharts for data visualization
- ✅ Responsive design
- ✅ Authentication system
- ✅ Real-time data filtering

## Support
If you encounter issues, check:
1. Netlify build logs
2. Browser console for errors
3. Network tab for API calls
4. Environment variables configuration 