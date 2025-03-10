import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Item } from '../types/inventory';

interface ItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  variant?: 'dashboard' | 'full';
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onUpdateQuantity,
  variant = 'full'
}) => {
  const stockStatus = item.quantity === 0 ? 'Out of Stock' :
    item.quantity < 5 ? 'Low Stock' : 'In Stock';

  const stockColor = item.quantity === 0 ? 'error' :
    item.quantity < 5 ? 'warning' : 'success';

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {item.name}
          </Typography>
          {onEdit && (
            <Tooltip title="Edit item">
              <IconButton size="small" onClick={() => onEdit(item)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip 
            label={stockStatus} 
            color={stockColor} 
            size="small" 
            sx={{ mb: 1 }}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          Price: ${parseFloat(item.price).toFixed(2)}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: variant === 'dashboard' ? 'space-between' : 'flex-start',
          mt: 2 
        }}>
          <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
            Quantity:
          </Typography>
          {onUpdateQuantity ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Decrease quantity">
                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  disabled={item.quantity <= 0}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
              <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
              <Tooltip title="Increase quantity">
                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography>{item.quantity}</Typography>
          )}
        </Box>

        {variant === 'full' && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Added: {new Date(item.created_at).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}; 