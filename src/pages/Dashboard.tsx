import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { ItemCard } from '../components/ItemCard';
import { Item } from '../types/inventory';

const ROTATION_INTERVAL = 30000; // 30 seconds
const FEATURED_ITEMS_COUNT = 6;

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { items, isLoading, error, updateQuantity } = useItems();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);

  // Get items with low stock (quantity < 5)
  const lowStockItems = items?.filter(item => item.quantity < 5) || [];

  // Filter items based on search
  const filteredItems = items?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Function to get random items
  const getRandomItems = (allItems: Item[], count: number) => {
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Update featured items every 30 seconds
  useEffect(() => {
    if (!items?.length) return;

    const updateFeaturedItems = () => {
      setFeaturedItems(getRandomItems(items, FEATURED_ITEMS_COUNT));
    };

    // Initial set
    updateFeaturedItems();

    // Set up interval
    const interval = setInterval(updateFeaturedItems, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [items]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading dashboard data
        </Typography>
      </Container>
    );
  }

  const gridItemSize = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 }
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: { xs: 2, sm: 3 },
            '& .MuiOutlinedInput-root': {
              borderRadius: { xs: 1, sm: 2 }
            }
          }}
        />
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Search Results Section */}
        {searchTerm && (
          <Grid item xs={12}>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                gutterBottom
                sx={{ mb: { xs: 1.5, sm: 2 } }}
              >
                Search Results
              </Typography>
              {filteredItems.length > 0 ? (
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {filteredItems.map(item => (
                    <Grid item {...gridItemSize} key={item.id}>
                      <ItemCard
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        variant="dashboard"
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography color="textSecondary" align="center">
                    No items found matching "{searchTerm}"
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        )}

        {/* Low Stock Items Section */}
        {!searchTerm && lowStockItems.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                gutterBottom 
                color="error"
                sx={{ mb: { xs: 1.5, sm: 2 } }}
              >
                Low Stock Items
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {lowStockItems.map(item => (
                  <Grid item {...gridItemSize} key={item.id}>
                    <ItemCard
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      variant="dashboard"
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Featured Items Section */}
        {!searchTerm && (
          <Grid item xs={12}>
            <Box sx={{ 
              mb: { xs: 1, sm: 2 }, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 1, sm: 0 }
            }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ mb: { xs: 1, sm: 0 } }}
              >
                Featured Items
              </Typography>
              <Button 
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                onClick={() => navigate('/items')}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
                View All Items
              </Button>
            </Box>
            {isLoading ? (
              <Typography sx={{ p: { xs: 2, sm: 3 } }}>Loading...</Typography>
            ) : featuredItems.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {featuredItems.map(item => (
                  <Grid item {...gridItemSize} key={item.id}>
                    <ItemCard
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      variant="dashboard"
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography color="textSecondary" align="center">
                  No items found
                </Typography>
              </Paper>
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard; 