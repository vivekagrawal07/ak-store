import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useItems, useCreateItem, useUpdateItemQuantity, useUpdateItemPrice } from '../services/api';
import { Item, CreateItemDTO } from '../types/inventory';

export const ItemsTable: React.FC = () => {
  const { data: items, isLoading, error } = useItems();
  const createItem = useCreateItem();
  const updateQuantity = useUpdateItemQuantity();
  const updatePrice = useUpdateItemPrice();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<CreateItemDTO>({
    name: '',
    quantity: 0,
    price: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', quantity: 0, price: 0 });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({ name: '', quantity: 0, price: 0 });
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        setErrorMessage('Name is required');
        return;
      }

      if (editingItem) {
        if (editingItem.quantity !== formData.quantity) {
          await updateQuantity.mutateAsync({
            id: editingItem.id,
            quantity: formData.quantity,
          });
        }
        if (editingItem.price !== formData.price) {
          await updatePrice.mutateAsync({
            id: editingItem.id,
            price: formData.price,
          });
        }
        setSuccessMessage('Item updated successfully');
      } else {
        await createItem.mutateAsync(formData);
        setSuccessMessage('Item created successfully');
      }
      handleCloseDialog();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading items</Typography>;

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add New Item
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!formData.name.trim()}
            helperText={!formData.name.trim() ? 'Name is required' : ''}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 0) {
                setFormData({ ...formData, quantity: value });
              }
            }}
            error={formData.quantity < 0}
            helperText={formData.quantity < 0 ? 'Quantity cannot be negative' : ''}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 0) {
                setFormData({ ...formData, price: value });
              }
            }}
            error={formData.price < 0}
            helperText={formData.price < 0 ? 'Price cannot be negative' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim() || formData.quantity < 0 || formData.price < 0}
          >
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </>
  );
}; 