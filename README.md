# Life Makers Foundation Funds Dashboard

A comprehensive, interactive dashboard for Life Makers Foundation Funds projects with filtering, comparisons, and visual insights.

## Features

- 📊 Interactive charts and visualizations
- 🔍 Advanced filtering and search capabilities
- 📱 Fully responsive design
- 🔐 Secure authentication system
- 📈 Year-to-year and stage-to-stage growth analysis
- 🎨 Modern UI with brand colors and glassmorphism effects
- 📊 SharePoint integration with fallback to mock data

## Tech Stack

- **Frontend**: React, Material-UI (MUI), Recharts
- **Backend**: Netlify Functions (Express.js)
- **Authentication**: JWT-based with serverless functions
- **Data Source**: Mock data with realistic projects
- **Deployment**: Full-stack Netlify (Frontend + Backend)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alaamagdy72135/life-makers-dashboard.git
   cd life-makers-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd src/frontend
   npm install
   
   # Install function dependencies
   cd ../../netlify/functions
   npm install
   ```

3. **Start the development server**
   ```bash
   # Start frontend (from src/frontend directory)
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Functions: Use Netlify CLI for local testing

## Deployment

### Full-Stack Netlify Deployment

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   - Base directory: `src/frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
   - Functions directory: `../netlify/functions`

3. **Add environment variables**
   - `JWT_SECRET`: Your secret key for JWT tokens

4. **Deploy**
   - Netlify will automatically deploy on every push to main branch

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `life-makers-foundation-secret-key-2024` |

## Project Structure

```
life-makers-dashboard/
├── src/
│   └── frontend/            # React frontend application
│       ├── public/          # Static files
│       ├── src/             # Source code
│       │   ├── components/  # React components
│       │   ├── App.js       # Main application
│       │   └── index.js     # Entry point
│       └── package.json     # Frontend dependencies
├── netlify/
│   └── functions/           # Netlify serverless functions
│       ├── api.js           # Express API function
│       └── package.json     # Function dependencies
├── netlify.toml             # Netlify configuration
└── README.md                # This file
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/logout` | POST | User logout |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/dashboard/projects` | GET | Project data |
| `/api/health` | GET | Health check |
| `/api/test` | GET | Test endpoint |

## Authentication

- **Username**: `admin`
- **Password**: `admin123`

## Features Overview

### Dashboard Components
- **Overview Tab**: Key metrics and summary statistics
- **Projects Tab**: Detailed project listings with filtering
- **Charts Tab**: Advanced data visualizations
- **Insights Tab**: Analytics and insights

### Filtering Capabilities
- Year range selection
- Donor type filtering
- Project stage filtering
- Search functionality
- Sticky filter bar for easy access

### Visualizations
- Bar charts with growth percentages
- Pie charts with thousands separators
- Area charts with visible labels
- Interactive tooltips and legends

### Responsive Design
- Mobile-first approach
- Flexible layouts using Flexbox
- Adaptive card sizes
- Touch-friendly interface

## Security Features

- JWT-based authentication
- Serverless function security
- Environment variable protection
- Secure password handling
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository. 