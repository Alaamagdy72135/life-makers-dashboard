# SharePoint Permissions Setup Guide

This guide will help you set up the necessary permissions for the Life Makers Foundation Funds Dashboard to access SharePoint Excel files.

## Prerequisites

- Azure Active Directory (AAD) tenant
- SharePoint site with Excel files
- Admin access to Azure AD

## Step 1: Create Azure AD Application

### 1.1 Register New Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: Life Makers Dashboard
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - `http://localhost:3000`
5. Click **Register**

### 1.2 Configure Application

1. Note down the **Application (client) ID**
2. Go to **Certificates & secrets**
3. Click **New client secret**
4. Add a description and select expiration
5. **Copy the secret value immediately** (you won't see it again)

### 1.3 Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Application permissions**
5. Add the following permissions:
   - `Files.Read.All`
   - `Sites.Read.All`
   - `User.Read.All`

### 1.4 Grant Admin Consent

1. Click **Grant admin consent for [Your Organization]**
2. Confirm the action

## Step 2: Environment Configuration

Create a `.env` file in the backend directory:

```env
# Azure AD Configuration
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
AZURE_TENANT_ID=your-tenant-id-here

# SharePoint Configuration
SHAREPOINT_SITE_URL=https://your-organization.sharepoint.com/
EXCEL_FILE_PATH=/path/to/your/excel/file.xlsx

# Application Configuration
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

## Step 3: SharePoint Site Configuration

### 3.1 Get SharePoint Site URL

1. Navigate to your SharePoint site
2. Copy the site URL from the browser
3. Ensure it ends with `/`

### 3.2 Configure Excel File Path

1. Locate your Excel file in SharePoint
2. Right-click and select **Copy path**
3. Use the relative path from the site root

## Step 4: Test Configuration

### 4.1 Start the Backend Server

```bash
cd backend
npm install
npm start
```

### 4.2 Test SharePoint Connection

The server will automatically test the SharePoint connection on startup. Check the console for:

- ✅ SharePoint configured successfully
- ✅ Excel file accessible
- ❌ Any error messages

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check Azure AD application permissions
   - Ensure admin consent is granted
   - Verify client ID and secret

2. **403 Forbidden**
   - Check SharePoint site permissions
   - Verify Excel file path
   - Ensure application has read access

3. **404 Not Found**
   - Verify SharePoint site URL
   - Check Excel file path
   - Ensure file exists and is accessible

### Permission Requirements

The Azure AD application needs these Microsoft Graph permissions:

- **Files.Read.All**: Read all files in SharePoint
- **Sites.Read.All**: Read site information
- **User.Read.All**: Read user information

### Security Best Practices

1. **Client Secret**: Keep your Azure AD client secret secure
2. **Environment Variables**: Never commit `.env` files to version control
3. **Least Privilege**: Only grant necessary permissions
4. **Regular Rotation**: Rotate client secrets regularly

## Next Steps

After completing this setup:

1. Start the backend server
2. Start the frontend application
3. Test the dashboard functionality
4. Deploy to production environment

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all configuration values
3. Test SharePoint access manually
4. Contact your Azure AD administrator 