import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Chip,
  Rating,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoriteContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import { Product } from '../types';
import CustomAlert from '../components/CustomAlert';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  likesCount?: number;
  purchaseCount?: number;
  discount?: number;
  onQuickView?: () => void;
  viewMode?: 'grid' | 'list';
  isMobile?: boolean;
  sizes?: string[];
  colors?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  images = [],
  rating = 5,
  reviewCount = 0,
  likesCount = 0,
  purchaseCount = 0,
  discount,
  onQuickView,
  viewMode = 'grid',
  isMobile = false,
  sizes,
  colors,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('error');
  const isFavorite = favorites.some((f) => f.id === id);
  const [showHoverImage, setShowHoverImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Randomly select a hover image from the images array
  const hoverImage = images?.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ id, name, price, originalPrice, image, rating, reviewCount });
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleQuickAddToCart = () => {
    if (sizes && colors && (sizes.length > 0 || colors.length > 0)) {
      setOpenDialog(true);
    } else {
      addToCart({
        id,
        name,
        price,
        image,
        quantity: 1,
        selectedSize: '',
        selectedColor: '',
      });
      setAlertMessage('Đã thêm sản phẩm vào giỏ hàng!');
      setAlertSeverity('success');
      setShowAlert(true);
    }
  };

  const handleAddToCartFromDialog = () => {
    if ((sizes && sizes.length > 0 && !selectedSize) || 
        (colors && colors.length > 0 && !selectedColor)) {
      setAlertMessage(!selectedSize && !selectedColor 
        ? 'Vui lòng chọn kích thước và màu sắc'
        : !selectedSize 
          ? 'Vui lòng chọn kích thước'
          : 'Vui lòng chọn màu sắc');
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1,
      selectedSize,
      selectedColor,
    });

    setOpenDialog(false);
    setSelectedSize('');
    setSelectedColor('');
    setAlertMessage('Đã thêm sản phẩm vào giỏ hàng!');
    setAlertSeverity('success');
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleCardClick = () => {
    navigate(`/products/${id}`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.();
  };

  const handleTouch = () => {
    if (isMobile && hoverImage) {
      setShowHoverImage(!showHoverImage);
    }
  };

  return (
    <Box
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: {
            xs: 'none', // Không có hiệu ứng hover trên mobile
            sm: 'translateY(-5px)' // Chỉ có hiệu ứng trên tablet trở lên
          }
        }
      }}
    >
      {viewMode === 'grid' ? (
        <>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '150%', // Tỷ lệ 2:3 cho grid view
              backgroundColor: '#F8F8F8',
              overflow: 'hidden',
              borderRadius: { xs: '4px', sm: '8px' },
              boxShadow: {
                xs: '0 1px 2px rgba(0,0,0,0.1)',
                sm: '0 2px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box
              component="img"
              src={image}
              alt={name}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered && images?.length > 0 && !isMobile ? 'translateX(-100%)' : 'translateX(0)',
              }}
            />
            {images?.length > 0 && (
              <Box
                component="img"
                src={images[0]}
                alt={`${name} hover`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: isHovered && !isMobile ? 'translateX(0)' : 'translateX(100%)',
                }}
              />
            )}
          </Box>
          <Box sx={{ 
            mt: { xs: 1, sm: 2 }, 
            px: { xs: 0.5, sm: 1 }
          }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: { xs: 1.3, sm: 1.5 },
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: { xs: '2.6em', sm: '3em' },
                fontWeight: 500,
              }}
            >
              {name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.5, sm: 1 }, 
              mt: { xs: 0.5, sm: 1 },
              alignItems: 'center'
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  color: '#E53935',
                }}
              >
                {price.toLocaleString()}đ
              </Typography>
              {originalPrice && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.675rem', sm: '0.813rem' },
                    color: 'text.secondary',
                    textDecoration: 'line-through',
                  }}
                >
                  {originalPrice.toLocaleString()}đ
                </Typography>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%', // Tỷ lệ 1:1 cho list view
            backgroundColor: '#F8F8F8',
            overflow: 'hidden',
            borderRadius: '4px',
            '&:hover': {
              '& img': {
                transform: 'scale(1.05)',
              }
            }
          }}
        >
          <Box
            component="img"
            src={image}
            alt={name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Chọn kích thước và màu sắc</DialogTitle>
        <DialogContent>
          {sizes && sizes.length > 0 && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Kích thước</InputLabel>
              <Select
                value={selectedSize}
                label="Kích thước"
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          {colors && colors.length > 0 && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Màu sắc</InputLabel>
              <Select
                value={selectedColor}
                label="Màu sắc"
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleAddToCartFromDialog}
          >
            Thêm vào giỏ
          </Button>
        </DialogActions>
      </Dialog>

      <CustomAlert 
        open={showAlert}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
        title={alertSeverity === 'error' ? 'Lỗi' : 'Thành công'}
        autoHideDuration={alertSeverity === 'error' ? 6000 : 3000}
      />
    </Box>
  );
};

export default ProductCard; 