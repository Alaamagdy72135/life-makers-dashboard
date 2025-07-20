# Full-Stack Netlify Deployment Guide

## Overview
This guide will help you deploy the Life Makers Foundation Funds Dashboard as a full-stack application on Netlify, including both frontend and backend API.

## Architecture
- **Frontend**: React SPA deployed as static files
- **Backend**: Express API deployed as Netlify Functions
- **Database**: Mock data (can be extended with external database)
- **Authentication**: JWT-based with serverless functions

## Prerequisites
- GitHub repository: `Alaamagdy72135/life-makers-dashboard`
- Netlify account

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
- **Functions directory**: `../netlify/functions`

### Step 4: Environment Variables
Add these environment variables:

**Site settings** → **Environment variables**:
- **Key**: `JWT_SECRET`
- **Value**: `your-super-secret-jwt-key-here`

### Step 5: Deploy
1. Click "Deploy site"
2. Wait for build to complete (3-5 minutes)
3. Monitor build logs for any issues

## Configuration Files

### netlify.toml
```toml
[build]
  base = "src/frontend"
  command = "npm run build"
  publish = "build"
  functions = "../netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### API Functions
The backend API is implemented as Netlify Functions in `netlify/functions/api.js`:
- Authentication endpoints
- Dashboard statistics
- Project data
- Health check

## Features

### Frontend
- ✅ React SPA with Material-UI
- ✅ Interactive charts with Recharts
- ✅ Responsive design
- ✅ Real-time filtering and search
- ✅ Authentication system

### Backend (Netlify Functions)
- ✅ Express.js API
- ✅ JWT authentication
- ✅ CORS enabled
- ✅ Mock data with realistic projects
- ✅ Dashboard statistics calculation

### Authentication
- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/logout` | POST | User logout |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/dashboard/projects` | GET | Project data |
| `/api/health` | GET | Health check |

## Troubleshooting

### Build Fails
- Check that all dependencies are installed
- Verify the base directory is correct
- Ensure the build command works locally

### Functions Not Working
- Check function logs in Netlify dashboard
- Verify function dependencies are installed
- Check environment variables

### API Connection Issues
- Verify redirect rules in netlify.toml
- Check function deployment status
- Test API endpoints directly

### Authentication Issues
- Verify JWT_SECRET environment variable
- Check token expiration settings
- Test login endpoint directly

## Local Development

### Frontend
```bash
cd src/frontend
npm install
npm start
```

### Functions (Local Testing)
```bash
cd netlify/functions
npm install
netlify dev
```

## Security Features
- JWT-based authentication
- CORS configuration
- Environment variable protection
- Secure password handling
- Token expiration

## Support
If you encounter issues, check:
1. Netlify build logs
2. Function logs
3. Browser console for errors
4. Network tab for API calls
5. Environment variables configuration 