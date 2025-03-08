import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { Product } from '../../server/src/models/product.model';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

const AddProductModal = ({ open, onClose, onAdd }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
  });

  const [errors, setErrors] = useState({
    price: false,
    quantity: false,
  });

  const validateNumber = (value: string, field: 'price' | 'quantity') => {
    const num = field === 'price' ? parseFloat(value) : parseInt(value);
    const isValid = !isNaN(num) && num >= 0;
    setErrors(prev => ({ ...prev, [field]: !isValid }));
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'price' || name === 'quantity') {
      validateNumber(value, name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceValid = validateNumber(formData.price, 'price');
    const quantityValid = validateNumber(formData.quantity, 'quantity');

    if (!priceValid || !quantityValid) {
      return;
    }

    onAdd({
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category.trim(),
    });

    setFormData({
      name: '',
      price: '',
      quantity: '',
      category: '',
    });
    setErrors({
      price: false,
      quantity: false,
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
            disabled={errors.price || errors.quantity}
          >
            Add Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal; 