import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { Product } from '../types/inventory';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
}

const AddProductModal = ({ open, onClose, onAdd }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    quantity: false,
    category: false,
  });

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      price: !formData.price || parseFloat(formData.price) < 0,
      quantity: !formData.quantity || parseInt(formData.quantity) < 0,
      category: !formData.category.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAdd({
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category.trim(),
    });

    // Reset form
    setFormData({
      name: '',
      price: '',
      quantity: '',
      category: '',
    });
    setErrors({
      name: false,
      price: false,
      quantity: false,
      category: false,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                helperText={errors.name ? "Product name is required" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                error={errors.price}
                helperText={errors.price ? "Please enter a valid price" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                error={errors.quantity}
                helperText={errors.quantity ? "Please enter a valid quantity" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                helperText={errors.category ? "Category is required" : ""}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={Object.values(errors).some(Boolean)}
          >
            Add Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal; 