import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ItemList } from '../components/ItemList';
import { ItemCard } from '../components/ItemCard';
import { ItemForm } from '../components/ItemForm';
import { useItems } from '../hooks/useItems';
import { Item, CreateItemDTO } from '../types/inventory';

export const ItemsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { items, isLoading, error, createItem, updateQuantity, updatePrice } = useItems();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (data: CreateItemDTO) => {
    try {
      if (editingItem) {
        if (editingItem.quantity !== data.quantity) {
          await updateQuantity.mutateAsync({ 
            id: editingItem.id, 
            dto: { quantity: data.quantity } 
          });
        }
        if (parseFloat(editingItem.price) !== data.price) {
          await updatePrice.mutateAsync({ 
            id: editingItem.id, 
            dto: { price: data.price } 
          });
        }
        setSuccessMessage('Item updated successfully');
      } else {
        await createItem.mutateAsync(data);
        setSuccessMessage('Item created successfully');
      }
      setFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      // Error will be handled by the form component
    }
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      await updateQuantity.mutateAsync({ id, dto: { quantity } });
      setSuccessMessage('Quantity updated successfully');
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading items: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, sm: 4 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
          >
            Inventory Items
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
            fullWidth={isMobile}
          >
            Add Item
          </Button>
        </Box>

        {isLoading ? (
          <Typography sx={{ p: { xs: 2, sm: 3 } }}>Loading...</Typography>
        ) : isMobile ? (
          // Mobile view - Grid of cards
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {items.map(item => (
              <Grid item xs={12} key={item.id}>
                <ItemCard
                  item={item}
                  onEdit={handleEdit}
                  onUpdateQuantity={handleUpdateQuantity}
                  variant="full"
                />
              </Grid>
            ))}
            {items.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    No items found
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        ) : (
          // Desktop view - Table
          <ItemList
            items={items}
            onEdit={handleEdit}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}

        <ItemForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingItem}
          isLoading={createItem.isPending || updateQuantity.isPending || updatePrice.isPending}
          error={
            createItem.error instanceof Error ? createItem.error :
            updateQuantity.error instanceof Error ? updateQuantity.error :
            updatePrice.error instanceof Error ? updatePrice.error :
            null
          }
        />

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />
      </Box>
    </Container>
  );
};

export default ItemsPage; 