import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Item } from '../types/inventory';

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onEdit,
  onUpdateQuantity,
}) => {
  return (
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
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
              </TableCell>
              <TableCell align="right">
                ${parseFloat(item.price).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit item">
                  <IconButton onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="textSecondary">
                  No items found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 