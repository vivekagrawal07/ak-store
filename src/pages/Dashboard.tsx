import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { Product } from '../../server/src/models/product.model';
import ProductCard from '../components/ProductCard';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Welcome to AK Store Dashboard
            </Typography>
            <Typography variant="body1" gutterBottom>
              Manage your inventory and track your products efficiently.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              sx={{ flexGrow: 1, minWidth: '200px' }}
            />
            <FormControl sx={{ minWidth: '150px' }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: '150px' }}>
              <InputLabel>Items per page</InputLabel>
              <Select
                value={itemsPerPage}
                label="Items per page"
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={27}>27</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        {paginatedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {filteredProducts.length > 0 && (
          <Grid item xs={12}>
            <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
              <Typography variant="body2" color="text.secondary">
                Showing {Math.min(itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </Typography>
            </Stack>
          </Grid>
        )}
        {filteredProducts.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
              No products found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard; 