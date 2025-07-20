# Render Deployment Guide

This guide will help you deploy the Life Makers Foundation Funds Dashboard backend to Render.

## Prerequisites

- GitHub repository: https://github.com/Alaamagdy72135/life-makers-dashboard.git
- Render account (free tier available)
- Azure AD application configured (for SharePoint integration)

## Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email address

## Step 2: Deploy Backend Service

### 2.1 Create New Web Service

1. Click **New +** in your Render dashboard
2. Select **Web Service**
3. Connect your GitHub repository
4. Select the repository: `Alaamagdy72135/life-makers-dashboard`

### 2.2 Configure Service Settings

**Basic Settings:**
- **Name**: `life-makers-dashboard-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (uses root)

**Build & Deploy Settings:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 2.3 Environment Variables

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

### 2.4 Advanced Settings

- **Auto-Deploy**: Enable (deploys on every push to main branch)
- **Health Check Path**: `/api/health` (if implemented)

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 3.2 Configure Frontend

**Build Settings:**
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

**Environment Variables:**
- `REACT_APP_API_URL`: `https://your-backend-service.onrender.com`

## Step 4: Update Frontend API URL

After deploying the backend, update the frontend to use the Render URL:

1. In Vercel dashboard, add environment variable:
   - `REACT_APP_API_URL`: `https://your-backend-service.onrender.com`

2. The frontend will automatically use this URL for API calls.

## Step 5: Test Deployment

### 5.1 Test Backend

```bash
# Test health endpoint
curl https://your-backend-service.onrender.com/api/health

# Test projects endpoint
curl https://your-backend-service.onrender.com/api/projects
```

### 5.2 Test Frontend

1. Visit your Vercel frontend URL
2. Try logging in with admin credentials
3. Test dashboard functionality

## Step 6: Configure CORS

The backend is already configured to allow requests from any origin in production. If you need to restrict it:

```javascript
// In backend/server.js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
};
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Verify package.json dependencies
   - Ensure all files are committed to GitHub

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no extra spaces in values

3. **CORS Errors**
   - Check frontend API URL configuration
   - Verify CORS settings in backend
   - Test with Postman or curl

4. **SharePoint Connection**
   - Verify Azure AD credentials
   - Check SharePoint permissions
   - Test with mock data first

### Debug Mode

Enable debug logging by adding to environment variables:
- `DEBUG`: `true`
- `LOG_LEVEL`: `debug`

## Monitoring

### Render Dashboard

- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory, and response times
- **Deployments**: Track deployment history and status

### Health Checks

Implement a health check endpoint:

```javascript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets to code
2. **HTTPS**: Render provides SSL certificates automatically
3. **CORS**: Restrict origins in production
4. **Rate Limiting**: Consider implementing rate limiting
5. **Input Validation**: Validate all API inputs

## Cost Optimization

### Free Tier Limits

- **Render**: 750 hours/month free
- **Vercel**: Generous free tier
- **Bandwidth**: Monitor usage

### Scaling

- **Paid Plans**: Available when needed
- **Auto-scaling**: Configure based on traffic
- **CDN**: Vercel provides global CDN

## Support

### Render Support

- [Render Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

### Troubleshooting Resources

- Check Render logs for detailed error messages
- Verify GitHub repository connectivity
- Test locally before deploying

## Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure custom domain (optional)
3. Set up CI/CD pipeline
4. Implement backup strategies
5. Document deployment procedures 