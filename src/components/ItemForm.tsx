import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Item, CreateItemDTO } from '../types/inventory';

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemDTO) => void;
  initialData?: Item;
  isLoading: boolean;
  error?: Error | null;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  error
}) => {
  const [formData, setFormData] = React.useState<CreateItemDTO>({
    name: initialData?.name || '',
    quantity: initialData?.quantity || 0,
    price: initialData ? parseFloat(initialData.price) : 0
  });

  const [validationErrors, setValidationErrors] = React.useState<{
    name?: string;
    quantity?: string;
    price?: string;
  }>({});

  const validate = () => {
    const errors: typeof validationErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.price < 0) {
      errors.price = 'Price cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Item' : 'Create New Item'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            disabled={isLoading}
          />
          
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            error={!!validationErrors.quantity}
            helperText={validationErrors.quantity}
            disabled={isLoading}
          />
          
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            error={!!validationErrors.price}
            helperText={validationErrors.price}
            disabled={isLoading}
            inputProps={{ step: "0.01" }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 