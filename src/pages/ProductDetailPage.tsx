import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Divider,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  ArrowBack,
  Add,
  Remove,
  ZoomIn,
} from '@mui/icons-material';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { formatPrice } from '../utils/format';
import CustomAlert from '../components/CustomAlert';
import ProductCard from '../components/ProductCard';
import CustomSnackbar from '../components/CustomSnackbar';
import { useSnackbar } from '../components/GlobalSnackbarProvider';

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
}

interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  sizes: string[];
  colors: string[];
  discount?: number;
  purchaseCount?: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { showSuccess, showError } = useSnackbar();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [mainImage, setMainImage] = useState('');
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [currentImage, setCurrentImage] = useState('');
  const [nextImage, setNextImage] = useState('');

  const product = products.find((p) => p.id === id) as Product;

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
      setCurrentImage(product.images[0]);
      setNextImage(product.images[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Không tìm thấy sản phẩm</Typography>
      </Container>
    );
  }

  const handleImageClick = (image: string) => {
    if (image === currentImage) return;
    
    const currentIndex = product.images.indexOf(currentImage);
    const newIndex = product.images.indexOf(image);
    setSlideDirection(newIndex > currentIndex ? 'left' : 'right');
    
    setIsTransitioning(true);
    setNextImage(image);
    
    setTimeout(() => {
      setCurrentImage(image);
      setIsTransitioning(false);
    }, 300);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      showError('Vui lòng chọn kích thước');
      return;
    }
    
    if (!selectedColor && product.colors.length > 0) {
      showError('Vui lòng chọn màu sắc');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      selectedSize,
      selectedColor,
    });

    showSuccess('Đã thêm sản phẩm vào giỏ hàng');
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      const favoriteProduct: FavoriteProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        originalPrice: product.originalPrice,
        discount: product.discount,
        rating: product.rating,
        reviewCount: product.reviewCount,
      };
      addToFavorites(favoriteProduct);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        <ArrowBack />
      </IconButton>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              bgcolor: 'background.paper',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: showZoom ? 'zoom-out' : 'zoom-in',
                transition: 'transform 0.3s ease',
                transform: showZoom ? `scale(${zoomLevel})` : 'scale(1)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: isTransitioning 
                    ? `translateX(${slideDirection === 'left' ? '-100%' : '100%'})` 
                    : 'translateX(0)',
                  opacity: isTransitioning ? 0 : 1,
                }}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: isTransitioning 
                    ? 'translateX(0)' 
                    : `translateX(${slideDirection === 'left' ? '100%' : '-100%'})`,
                  opacity: isTransitioning ? 1 : 0,
                }}
              >
                <img
                  src={nextImage}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {!showZoom && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    p: 1,
                    cursor: 'pointer',
                    zIndex: 2,
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowZoom(true)}
                >
                  <ZoomIn />
                </Box>
              )}
            </Box>
          </Box>
          <Box 
            sx={{ 
              mt: 2, 
              display: 'flex', 
              gap: 1, 
              overflowX: 'auto', 
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: '#555',
                },
              },
            }}
          >
            {product.images.map((image, index) => (
              <Box
                key={index}
                onClick={() => handleImageClick(image)}
                sx={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: currentImage === image ? '2px solid' : '2px solid transparent',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount} đánh giá)
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: 600, display: 'inline' }}
            >
              {formatPrice(product.price)}₫
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  textDecoration: 'line-through',
                  ml: 1,
                  display: 'inline',
                }}
              >
                {formatPrice(product.originalPrice)}₫
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Kích thước
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Màu sắc
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'contained' : 'outlined'}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Số lượng
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <Typography>{quantity}</Typography>
              <Button
                variant="outlined"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
            >
              Thêm vào giỏ hàng
            </Button>
            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>

          <Divider sx={{ my: 3 }} />

        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
            },
          }}
        >
          <Tab label="Mô tả" />
          <Tab label="Đánh giá" />
          <Tab label="Chính sách" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Đánh giá sản phẩm
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} readOnly precision={0.5} />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {product.rating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.reviewCount} đánh giá)
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bình luận mới nhất
              </Typography>
              {product.reviews?.map((review: Review, index: number) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {review.userName}
                    </Typography>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{ ml: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {new Date(review.date).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                  {review.images && review.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {review.images.map((image: string, imgIndex: number) => (
                        <Box
                          key={imgIndex}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src={image}
                            alt={`Review ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Chính sách bảo hành
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              - Sản phẩm được bảo hành 12 tháng kể từ ngày mua hàng
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              - Đổi trả miễn phí trong vòng 30 ngày nếu sản phẩm lỗi
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              - Hoàn tiền 100% nếu sản phẩm không đúng như mô tả
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 6 }}>
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '50%',
                height: 2,
                backgroundColor: 'primary.main'
              }
            }}
          >
            Sản phẩm bán chạy nhất
          </Typography>
          <Grid container spacing={2}>
            {products
              .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
              .slice(0, 4)
              .map(product => (
                <Grid item xs={6} sm={3} key={`bestseller-${product.id}`}>
                  <ProductCard {...product} viewMode="grid" />
                </Grid>
              ))}
          </Grid>
        </Box>
        
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '50%',
                height: 2,
                backgroundColor: 'primary.main'
              }
            }}
          >
            Ưu đãi đặc biệt
          </Typography>
          <Grid container spacing={2}>
            {products
              .filter(p => p.discount && p.discount > 15)
              .slice(0, 4)
              .map(product => (
                <Grid item xs={6} sm={3} key={`discount-${product.id}`}>
                  <ProductCard {...product} viewMode="grid" />
                </Grid>
              ))}
          </Grid>
        </Box>
        
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '50%',
                height: 2,
                backgroundColor: 'primary.main'
              }
            }}
          >
            Phối đẹp nhất với
          </Typography>
          <Grid container spacing={2}>
            {products
              .filter(p => p.id !== id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4)
              .map(product => (
                <Grid item xs={6} sm={3} key={`match-${product.id}`}>
                  <ProductCard {...product} viewMode="grid" />
                </Grid>
              ))}
          </Grid>
        </Box>
        
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '50%',
                height: 2,
                backgroundColor: 'primary.main'
              }
            }}
          >
            Sản phẩm đã xem
          </Typography>
          <Grid container spacing={2}>
            {products
              .filter(p => p.id !== id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4)
              .map(product => (
                <Grid item xs={6} sm={3} key={`viewed-${product.id}`}>
                  <ProductCard {...product} viewMode="grid" />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetailPage; 