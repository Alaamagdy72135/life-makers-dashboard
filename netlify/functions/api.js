const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    project: "Education Enhancement Program",
    donor: "UNICEF",
    type: "International",
    year: 2023,
    budgetEGP: 2500000,
    stage: "Stage1"
  },
  {
    id: 2,
    project: "Healthcare Initiative",
    donor: "WHO",
    type: "International",
    year: 2023,
    budgetEGP: 1800000,
    stage: "Stage2"
  },
  {
    id: 3,
    project: "Youth Development",
    donor: "Egyptian Ministry",
    type: "National",
    year: 2023,
    budgetEGP: 1200000,
    stage: "Stage1"
  },
  {
    id: 4,
    project: "Women Empowerment",
    donor: "USAID",
    type: "International",
    year: 2022,
    budgetEGP: 3000000,
    stage: "Stage2"
  },
  {
    id: 5,
    project: "Environmental Protection",
    donor: "Green Fund",
    type: "International",
    year: 2022,
    budgetEGP: 1500000,
    stage: "Stage1"
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/auth/login', (req, res) => {
  console.log('Login attempt:', { username: req.body.username, hasPassword: !!req.body.password });
  
  const { username, password } = req.body;
  
  // Simple authentication (replace with your logic)
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    console.log('Login successful for user:', username);
    res.json({ 
      token, 
      user: { username, role: 'admin' },
      message: 'Login successful' 
    });
  } else {
    console.log('Login failed for user:', username);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.get('/dashboard/stats', authenticateToken, (req, res) => {
  const totalProjects = mockProjects.length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budgetEGP, 0);
  const uniqueDonors = [...new Set(mockProjects.map(p => p.donor))].length;
  const internationalDonors = [...new Set(mockProjects.filter(p => p.type === 'International').map(p => p.donor))].length;
  const nationalDonors = [...new Set(mockProjects.filter(p => p.type === 'National').map(p => p.donor))].length;
  
  const stage1Projects = mockProjects.filter(p => p.stage === 'Stage1').length;
  const stage2Projects = mockProjects.filter(p => p.stage === 'Stage2').length;
  const stage1Budget = mockProjects.filter(p => p.stage === 'Stage1').reduce((sum, p) => sum + p.budgetEGP, 0);
  const stage2Budget = mockProjects.filter(p => p.stage === 'Stage2').reduce((sum, p) => sum + p.budgetEGP, 0);
  
  const yearStats = {};
  mockProjects.forEach(project => {
    if (!yearStats[project.year]) {
      yearStats[project.year] = { count: 0, budget: 0 };
    }
    yearStats[project.year].count++;
    yearStats[project.year].budget += project.budgetEGP;
  });
  
  res.json({
    totalProjects,
    totalBudget: totalBudget.toLocaleString(),
    uniqueDonors,
    internationalDonors,
    nationalDonors,
    stage1Projects,
    stage2Projects,
    stage1Budget: stage1Budget.toLocaleString(),
    stage2Budget: stage2Budget.toLocaleString(),
    yearStats
  });
});

app.get('/dashboard/projects', authenticateToken, (req, res) => {
  res.json(mockProjects);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Netlify function is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports.handler = serverless(app); 