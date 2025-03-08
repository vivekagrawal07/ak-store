import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Product } from '../../server/src/models/product.model';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  variant?: 'dashboard' | 'compact';
}

const ProductCard = ({ product, onEdit, onDelete, variant = 'dashboard' }: ProductCardProps) => {
  const getLowStockStatus = (quantity: number) => {
    if (quantity <= 5) return 'error';
    if (quantity <= 10) return 'warning';
    return 'success';
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {product.name}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${formatPrice(product.price)}
          </Typography>
          <Chip
            label={`Stock: ${product.quantity}`}
            color={getLowStockStatus(product.quantity)}
            size={variant === 'compact' ? 'small' : 'medium'}
          />
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          Category: {product.category}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        {variant === 'dashboard' ? (
          <>
            <Button size="small" color="primary" onClick={() => onEdit?.(product)}>
              Edit
            </Button>
            <Button size="small" color="primary">
              View Details
            </Button>
          </>
        ) : (
          <>
            <IconButton size="small" color="primary" onClick={() => onEdit?.(product)}>
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => product.id && onDelete?.(product.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard; 