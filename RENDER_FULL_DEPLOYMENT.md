# Complete Render Deployment Guide

This guide will help you deploy both the frontend and backend of the Life Makers Foundation Funds Dashboard to Render.

## 🎯 Overview

We'll deploy:
- **Backend**: Node.js API service on Render
- **Frontend**: React static site on Render

## 📋 Prerequisites

- GitHub repository: https://github.com/Alaamagdy72135/life-makers-dashboard.git
- Render account (free tier available)
- Azure AD application configured (for SharePoint integration)

## 🚀 Step 1: Deploy Backend Service

### 1.1 Create Backend Service

1. **Go to [Render.com](https://render.com)**
2. **Sign in** with your GitHub account
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**:
   - Repository: `Alaamagdy72135/life-makers-dashboard`
   - Branch: `main`

### 1.2 Configure Backend Settings

**Basic Settings:**
- **Name**: `life-makers-dashboard-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty

**Build & Deploy Settings:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 1.3 Set Backend Environment Variables

Add these environment variables in Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port for the service |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `[Generate Secure Password]` | Admin login password |
| `AZURE_CLIENT_ID` | `[Your Azure Client ID]` | Azure AD application ID |
| `AZURE_CLIENT_SECRET` | `[Your Azure Client Secret]` | Azure AD client secret |
| `AZURE_TENANT_ID` | `[Your Azure Tenant ID]` | Azure AD tenant ID |
| `SHAREPOINT_SITE_URL` | `[Your SharePoint URL]` | SharePoint site URL |
| `EXCEL_FILE_PATH` | `[Your Excel File Path]` | Path to Excel file in SharePoint |

### 1.4 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (2-5 minutes)
3. **Note your backend URL**: `https://life-makers-dashboard-backend.onrender.com`

## 🎨 Step 2: Deploy Frontend Service

### 2.1 Create Frontend Service

1. **Click "New +"** → **"Static Site"**
2. **Connect your GitHub repository**:
   - Repository: `Alaamagdy72135/life-makers-dashboard`
   - Branch: `main`

### 2.2 Configure Frontend Settings

**Basic Settings:**
- **Name**: `life-makers-dashboard-frontend`
- **Environment**: `Static Site`
- **Region**: Same as backend
- **Branch**: `main`

**Build & Deploy Settings:**
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`

### 2.3 Set Frontend Environment Variables

Add this environment variable:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://life-makers-dashboard-backend.onrender.com` | Backend API URL |

### 2.4 Deploy Frontend

1. **Click "Create Static Site"**
2. **Wait for deployment** (3-7 minutes)
3. **Note your frontend URL**: `https://life-makers-dashboard-frontend.onrender.com`

## 🔧 Step 3: Alternative Method - Using render.yaml

If you prefer to use the `render.yaml` file for deployment:

1. **Go to Render Dashboard**
2. **Click "New +"** → **"Blueprint"**
3. **Connect your GitHub repository**
4. **Select the repository**: `Alaamagdy72135/life-makers-dashboard`
5. **Render will automatically detect the `render.yaml` file**
6. **Click "Apply"** to deploy both services

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Backend

```bash
# Test health endpoint
curl https://life-makers-dashboard-backend.onrender.com/api/health

# Test projects endpoint
curl https://life-makers-dashboard-backend.onrender.com/api/projects
```

### 4.2 Test Frontend

1. **Visit your frontend URL**: `https://life-makers-dashboard-frontend.onrender.com`
2. **Login** with admin credentials
3. **Test dashboard functionality**

### 4.3 Test Complete Flow

1. **Open frontend URL**
2. **Login** with admin credentials
3. **Verify data loads** from backend
4. **Test filters and charts**
5. **Test responsive design**

## 🔄 Step 5: Configure Auto-Deploy

### 5.1 Enable Auto-Deploy

Both services will automatically deploy when you push to the `main` branch:

1. **Make changes to your code**
2. **Commit and push to GitHub**
3. **Render automatically rebuilds and deploys**

### 5.2 Manual Deploy

To manually trigger a deployment:
1. **Go to service dashboard**
2. **Click "Manual Deploy"**
3. **Select branch and commit**

## 🛠️ Step 6: Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Ensure all files are committed to GitHub

2. **CORS Errors**
   - Verify frontend URL is in backend CORS configuration
   - Check environment variables are set correctly
   - Test API endpoints directly

3. **Environment Variables**
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no extra spaces in values

4. **SharePoint Connection**
   - Verify Azure AD credentials
   - Check SharePoint permissions
   - Test with mock data first

### Debug Mode

Enable debug logging by adding to backend environment variables:
- `DEBUG`: `true`
- `LOG_LEVEL`: `debug`

## 📊 Step 7: Monitoring

### Render Dashboard Features

- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory, and response times
- **Deployments**: Track deployment history and status
- **Health Checks**: Monitor service health

### Health Check Endpoint

Your backend includes a health check endpoint:
```
GET https://life-makers-dashboard-backend.onrender.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

## 🔒 Step 8: Security

### Best Practices

1. **Environment Variables**: Never commit secrets to code
2. **HTTPS**: Render provides SSL certificates automatically
3. **CORS**: Configured to allow only necessary origins
4. **Authentication**: Secure admin login system
5. **Input Validation**: All API inputs are validated

### Security Headers

Render automatically adds security headers:
- HTTPS enforcement
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options

## 💰 Step 9: Cost Optimization

### Free Tier Limits

- **Render**: 750 hours/month free per service
- **Bandwidth**: Generous free tier
- **Build minutes**: Sufficient for most projects

### Scaling Options

- **Paid Plans**: Available when needed
- **Auto-scaling**: Configure based on traffic
- **Custom domains**: Available on paid plans

## 🚀 Step 10: Custom Domain (Optional)

### Add Custom Domain

1. **Go to service settings**
2. **Click "Custom Domains"**
3. **Add your domain**
4. **Configure DNS records**
5. **Wait for SSL certificate**

## 📈 Step 11: Performance Optimization

### Frontend Optimization

- **Build optimization**: React build is optimized
- **Static assets**: Served from CDN
- **Caching**: Automatic caching headers

### Backend Optimization

- **Response caching**: Implement as needed
- **Database optimization**: Use connection pooling
- **API optimization**: Efficient data fetching

## 🆘 Support

### Render Support

- [Render Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

### Troubleshooting Resources

- Check Render logs for detailed error messages
- Verify GitHub repository connectivity
- Test locally before deploying

## 🎉 Success!

Your Life Makers Foundation Funds Dashboard is now deployed on Render!

**Frontend URL**: `https://life-makers-dashboard-frontend.onrender.com`
**Backend URL**: `https://life-makers-dashboard-backend.onrender.com`

### Next Steps

1. **Set up monitoring** and alerts
2. **Configure custom domain** (optional)
3. **Set up CI/CD pipeline**
4. **Implement backup strategies**
5. **Document deployment procedures**
6. **Train users** on the new system 