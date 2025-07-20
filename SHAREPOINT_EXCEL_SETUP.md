# SharePoint Excel Integration Setup

This guide explains how to configure the Life Makers Foundation Funds Dashboard to read Excel files from SharePoint.

## Overview

The dashboard connects to SharePoint Excel files using Microsoft Graph API and Azure Active Directory authentication. This allows real-time access to project data stored in SharePoint.

## Prerequisites

- Azure AD application configured (see SHAREPOINT_PERMISSIONS_SETUP.md)
- SharePoint site with Excel files
- Proper permissions granted

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SHAREPOINT_SITE_URL=https://your-organization.sharepoint.com/
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
AZURE_TENANT_ID=your-tenant-id-here
EXCEL_FILE_PATH=/path/to/your/excel/file.xlsx
```

### Excel File Structure

The Excel file should have the following columns:

| Column | Description | Required |
|--------|-------------|----------|
| Project | Project name | Yes |
| Donor | Donor organization | Yes |
| Type | International/National | Yes |
| Year | Project year | Yes |
| Budget | Budget amount (EGP) | Yes |
| Stage | Project stage | Yes |

### Example Excel Structure

```
| Project | Donor | Type | Year | Budget | Stage |
|---------|-------|------|------|--------|-------|
| Improve the livelihood of refugees | Plan International | International | 2018 | 1,488,770 | Stage1 |
| Support Community education for refugee children | Plan International | International | 2018 | 669,152 | Stage1 |
| Development of the Blind School | SAMSUNG | National | 2018 | 6,243,338 | Stage1 |
```

## Integration Process

### 1. Authentication

The system uses Azure AD client credentials flow:

1. Request access token from Azure AD
2. Use token to authenticate with Microsoft Graph API
3. Access SharePoint files using Graph API endpoints

### 2. File Reading

1. Connect to SharePoint site using Graph API
2. Navigate to the specified Excel file
3. Download file content
4. Parse Excel data using xlsx library
5. Transform data for dashboard consumption

### 3. Data Processing

1. Parse Excel rows into project objects
2. Validate required fields
3. Convert budget strings to numbers
4. Group data by various dimensions
5. Calculate statistics and trends

## Error Handling

### Fallback to Mock Data

If SharePoint access fails, the system automatically falls back to mock data:

```javascript
// Example fallback logic
if (sharePointError) {
  console.log('SharePoint access failed, using mock data');
  return mockProjectData;
}
```

### Common Errors

1. **401 Unauthorized**
   - Check Azure AD credentials
   - Verify application permissions

2. **403 Forbidden**
   - Check SharePoint site permissions
   - Verify file access rights

3. **404 Not Found**
   - Check file path
   - Verify SharePoint site URL

## Testing

### Manual Testing

1. Start the backend server
2. Check console for SharePoint connection status
3. Test API endpoints:
   ```bash
   curl http://localhost:5000/api/projects
   curl http://localhost:5000/api/stats
   ```

### Automated Testing

The system includes built-in tests:

```bash
cd backend
npm test
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Client Secrets**: Store securely and rotate regularly
3. **API Permissions**: Use least privilege principle
4. **Data Validation**: Validate all input data

## Performance Optimization

1. **Caching**: Implement response caching
2. **Pagination**: Handle large datasets
3. **Error Recovery**: Graceful fallback mechanisms
4. **Monitoring**: Track API usage and errors

## Troubleshooting

### Debug Mode

Enable debug logging:

```env
DEBUG=true
LOG_LEVEL=debug
```

### Common Issues

1. **CORS Errors**: Configure CORS in backend
2. **Token Expiry**: Implement token refresh
3. **File Format**: Ensure Excel file format compatibility
4. **Network Issues**: Check firewall and proxy settings

## Next Steps

After successful setup:

1. Test with real SharePoint data
2. Configure production environment
3. Set up monitoring and alerts
4. Document customizations

## Support

For issues and questions:

1. Check the console logs
2. Review error messages
3. Test SharePoint access manually
4. Contact system administrator 