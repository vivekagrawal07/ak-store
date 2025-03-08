import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Product } from '../../server/src/models/product.model';
import AddProductModal from '../components/AddProductModal';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        setIsAddModalOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add product');
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
          <Paper sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Typography variant="h5">
                Products
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Product
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
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
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={36}>36</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    variant="compact"
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
            {filteredProducts.length > 0 && (
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
            )}
            {filteredProducts.length === 0 && (
              <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
                No products found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </Container>
  );
};

export default Products; 