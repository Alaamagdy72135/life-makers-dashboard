import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  Fab,
  Badge,
  Collapse
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  FilterList,
  Sort,
  TrendingUp,
  Analytics,
  Compare,
  Refresh,
  Download,
  Search,
  CalendarToday,
  Layers,
  People,
  Clear,
  Assignment,
  AccountBalance,
  Group,
  Public,
  Flag,
  Close,
  FilterAlt
} from '@mui/icons-material';
import Login from './components/Login';
import Logo from './components/Logo';
import Insights from './components/Insights';

// Brand colors from logo
const BRAND_COLORS = {
  primary: '#224466', // Dark blue
  secondary: '#EE9933', // Orange
  background: '#335544', // Dark green
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  text: '#333333',
  lightText: '#666666'
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredStats, setFilteredStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersHover, setFiltersHover] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    donor: '',
    type: '',
    year: '',
    stage: ''
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'year',
    direction: 'desc'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      fetchData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...projects];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(project =>
        project.project.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.donor.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.donor) {
      filtered = filtered.filter(project => project.donor === filters.donor);
    }
    if (filters.type) {
      filtered = filtered.filter(project => project.type === filters.type);
    }
    if (filters.year) {
      filtered = filtered.filter(project => project.year === parseInt(filters.year));
    }
    if (filters.stage) {
      filtered = filtered.filter(project => project.stage === filters.stage);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'budgetEGP') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProjects(filtered);
    
    // Calculate filtered stats
    if (filtered.length > 0) {
      const totalProjects = filtered.length;
      const totalBudget = filtered.reduce((sum, p) => sum + p.budgetEGP, 0);
      const uniqueDonors = [...new Set(filtered.map(p => p.donor))].length;
      const internationalDonors = [...new Set(filtered.filter(p => p.type === 'International').map(p => p.donor))].length;
      const nationalDonors = [...new Set(filtered.filter(p => p.type === 'National').map(p => p.donor))].length;
      
      const stage1Projects = filtered.filter(p => p.stage === 'Stage1').length;
      const stage2Projects = filtered.filter(p => p.stage === 'Stage2').length;
      const stage1Budget = filtered.filter(p => p.stage === 'Stage1').reduce((sum, p) => sum + p.budgetEGP, 0);
      const stage2Budget = filtered.filter(p => p.stage === 'Stage2').reduce((sum, p) => sum + p.budgetEGP, 0);
      
      const yearStats = {};
      filtered.forEach(project => {
        if (!yearStats[project.year]) {
          yearStats[project.year] = { count: 0, budget: 0 };
        }
        yearStats[project.year].count++;
        yearStats[project.year].budget += project.budgetEGP;
      });
      
      setFilteredStats({
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
    }
  }, [projects, filters, sortConfig]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchData = async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const [statsResponse, projectsResponse] = await Promise.all([
        fetch(`${apiUrl}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/dashboard/projects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    fetchData(token);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      setStats(null);
      setProjects([]);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      donor: '',
      type: '',
      year: '',
      stage: ''
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Use filtered stats if available, otherwise use original stats
  const displayStats = filteredStats || stats;
  
  // Calculate percentage growth between stages
  const stage1Budget = typeof displayStats?.stage1Budget === 'string' ? parseInt(displayStats.stage1Budget.replace(/,/g, '')) : displayStats?.stage1Budget || 0;
  const stage2Budget = typeof displayStats?.stage2Budget === 'string' ? parseInt(displayStats.stage2Budget.replace(/,/g, '')) : displayStats?.stage2Budget || 0;
  const stage1Projects = displayStats?.stage1Projects || 0;
  const stage2Projects = displayStats?.stage2Projects || 0;
  
  const budgetGrowth = stage1Budget > 0 ? ((stage2Budget - stage1Budget) / stage1Budget * 100).toFixed(1) : 0;
  const projectsGrowth = stage1Projects > 0 ? ((stage2Projects - stage1Projects) / stage1Projects * 100).toFixed(1) : 0;

  const chartData = displayStats ? [
    { 
      name: 'Stage 1', 
      projects: stage1Projects, 
      budget: stage1Budget,
      budgetLabel: `Budget: ${stage1Budget.toLocaleString()} EGP`,
      projectsLabel: `Projects: ${stage1Projects}`,
      growth: 'Baseline'
    },
    { 
      name: 'Stage 2', 
      projects: stage2Projects, 
      budget: stage2Budget,
      budgetLabel: `Budget: ${stage2Budget.toLocaleString()} EGP`,
      projectsLabel: `Projects: ${stage2Projects}`,
      growth: `${budgetGrowth > 0 ? '+' : ''}${budgetGrowth}%`
    }
  ] : [];

  const donorTypeData = displayStats ? [
    { name: 'International', value: displayStats.internationalDonors, color: BRAND_COLORS.primary },
    { name: 'National', value: displayStats.nationalDonors, color: BRAND_COLORS.secondary }
  ] : [];

  // Calculate year-over-year growth
  const yearChartData = displayStats ? Object.keys(displayStats.yearStats).map((year, index, years) => {
    const currentYear = displayStats.yearStats[year];
    const currentBudget = typeof currentYear.budget === 'string' 
      ? parseInt(currentYear.budget.replace(/,/g, ''))
      : currentYear.budget;
    const currentProjects = currentYear.count;
    
    // Calculate growth from previous year
    let budgetGrowth = 0;
    let projectsGrowth = 0;
    
    if (index > 0) {
      const prevYear = years[index - 1];
      const prevYearData = displayStats.yearStats[prevYear];
      const prevBudget = typeof prevYearData.budget === 'string' 
        ? parseInt(prevYearData.budget.replace(/,/g, ''))
        : prevYearData.budget;
      const prevProjects = prevYearData.count;
      
      budgetGrowth = prevBudget > 0 ? ((currentBudget - prevBudget) / prevBudget * 100).toFixed(1) : 0;
      projectsGrowth = prevProjects > 0 ? ((currentProjects - prevProjects) / prevProjects * 100).toFixed(1) : 0;
    }
    
    return {
      year,
      projects: currentProjects,
      budget: currentBudget,
      budgetLabel: `Budget: ${currentBudget.toLocaleString()} EGP`,
      projectsLabel: `Projects: ${currentProjects}`,
      growth: index === 0 ? 'Baseline' : `${budgetGrowth > 0 ? '+' : ''}${budgetGrowth}%`
    };
  }).sort((a, b) => a.year - b.year) : [];

  const uniqueDonors = [...new Set(projects.map(p => p.donor))];
  const uniqueYears = [...new Set(projects.map(p => p.year))].sort();
  const uniqueStages = [...new Set(projects.map(p => p.stage))];

  const FilterButtons = ({ title, options, value, onChange, field, icon }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: BRAND_COLORS.primary, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        {icon} {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Button
          variant={value === '' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => onChange(field, '')}
          sx={{
            backgroundColor: value === '' ? BRAND_COLORS.primary : 'transparent',
            color: value === '' ? 'white' : BRAND_COLORS.primary,
            borderColor: BRAND_COLORS.primary,
            minWidth: 'auto',
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
            '&:hover': {
              backgroundColor: value === '' ? BRAND_COLORS.primary : BRAND_COLORS.primary + '20'
            }
          }}
        >
          All
        </Button>
        {options.map(option => (
          <Button
            key={option}
            variant={value === option ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onChange(field, option)}
            sx={{
              backgroundColor: value === option ? BRAND_COLORS.primary : 'transparent',
              color: value === option ? 'white' : BRAND_COLORS.primary,
              borderColor: BRAND_COLORS.primary,
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              '&:hover': {
                backgroundColor: value === option ? BRAND_COLORS.primary : BRAND_COLORS.primary + '20'
              }
            }}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Box>
  );

  const FiltersDrawer = () => (
    <Drawer
      anchor="left"
      open={filtersOpen}
      onClose={() => setFiltersOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : 320,
          backgroundColor: 'white',
          p: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: BRAND_COLORS.primary, fontWeight: 'bold' }}>
          <FilterAlt /> Filters
        </Typography>
        <IconButton onClick={() => setFiltersOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <FilterButtons
        title="Donors"
        options={uniqueDonors}
        value={filters.donor}
        onChange={handleFilterChange}
        field="donor"
        icon={<People />}
      />
      
      <FilterButtons
        title="Project Type"
        options={['International', 'National']}
        value={filters.type}
        onChange={handleFilterChange}
        field="type"
        icon={<Public />}
      />
      
      <FilterButtons
        title="Year"
        options={uniqueYears}
        value={filters.year}
        onChange={handleFilterChange}
        field="year"
        icon={<CalendarToday />}
      />
      
      <FilterButtons
        title="Stage"
        options={uniqueStages}
        value={filters.stage}
        onChange={handleFilterChange}
        field="stage"
        icon={<Layers />}
      />
      
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={clearFilters}
          startIcon={<Clear />}
          sx={{
            borderColor: BRAND_COLORS.secondary,
            color: BRAND_COLORS.secondary,
            '&:hover': {
              backgroundColor: BRAND_COLORS.secondary + '20'
            }
          }}
        >
          Clear All Filters
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ backgroundColor: BRAND_COLORS.background, minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: BRAND_COLORS.primary }}>
        <Toolbar>
          <Logo />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, color: 'white' }}>
            Life Makers Foundation Funds Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setFiltersOpen(true)}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={Object.values(filters).filter(v => v !== '').length} color="secondary">
                <FilterList />
              </Badge>
            </IconButton>
            
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<Close />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <FiltersDrawer />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: BRAND_COLORS.primary, fontWeight: 'bold' }}>
                {displayStats?.totalProjects || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Projects
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: BRAND_COLORS.secondary, fontWeight: 'bold' }}>
                {displayStats?.totalBudget || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Budget (EGP)
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: BRAND_COLORS.success, fontWeight: 'bold' }}>
                {displayStats?.uniqueDonors || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Donors
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: BRAND_COLORS.warning, fontWeight: 'bold' }}>
                {displayStats?.internationalDonors || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                International Donors
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
          <TextField
            fullWidth
            placeholder="Search projects or donors..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: BRAND_COLORS.primary }} />
            }}
          />
        </Paper>

        {/* Tabs */}
        <Paper sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Overview" icon={<Analytics />} />
            <Tab label="Projects" icon={<Assignment />} />
            <Tab label="Charts" icon={<BarChart />} />
            <Tab label="Insights" icon={<TrendingUp />} />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, color: BRAND_COLORS.primary, fontWeight: 'bold' }}>
                  Dashboard Overview
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Welcome to the Life Makers Foundation Funds Dashboard. Here you can view and analyze project funding data, donor statistics, and track progress across different stages.
                </Typography>
                <Insights stats={displayStats} />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: BRAND_COLORS.primary, fontWeight: 'bold' }}>
                    Projects List
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell>Donor</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Budget (EGP)</TableCell>
                        <TableCell>Stage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>{project.project}</TableCell>
                          <TableCell>{project.donor}</TableCell>
                          <TableCell>
                            <Chip 
                              label={project.type} 
                              size="small"
                              sx={{ 
                                backgroundColor: project.type === 'International' ? BRAND_COLORS.primary : BRAND_COLORS.secondary,
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>{project.year}</TableCell>
                          <TableCell>{project.budgetEGP.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={project.stage} 
                              size="small"
                              sx={{ 
                                backgroundColor: project.stage === 'Stage1' ? BRAND_COLORS.success : BRAND_COLORS.warning,
                                color: 'white'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, color: BRAND_COLORS.primary, fontWeight: 'bold' }}>
                  Data Visualization
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: BRAND_COLORS.primary }}>
                      Stage Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="projects" fill={BRAND_COLORS.primary} name="Projects" />
                        <Bar dataKey="budget" fill={BRAND_COLORS.secondary} name="Budget (EGP)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                  
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: BRAND_COLORS.primary }}>
                      Donor Types
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={donorTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {donorTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Box>
                
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: BRAND_COLORS.primary }}>
                    Year-over-Year Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={yearChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area type="monotone" dataKey="projects" stackId="1" stroke={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} name="Projects" />
                      <Area type="monotone" dataKey="budget" stackId="2" stroke={BRAND_COLORS.secondary} fill={BRAND_COLORS.secondary} name="Budget (EGP)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, color: BRAND_COLORS.primary, fontWeight: 'bold' }}>
                  Insights & Analytics
                </Typography>
                <Insights stats={displayStats} />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App; 