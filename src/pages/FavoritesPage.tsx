import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  IconButton, 
  Container, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Paper,
  CircularProgress
} from '@mui/material';
import { Favorite, ShoppingCart, ArrowBack, DeleteOutline, ArrowForward, ShoppingBag } from '@mui/icons-material';
import { useFavorites } from '../contexts/FavoriteContext';
import { useCart } from '../contexts/CartContext';
import { useSnackbar } from '../components/GlobalSnackbarProvider';
import { useAuth } from '../contexts/AuthContext';

// This is how CartItem is defined in CartContext.tsx
interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

// Importing FavoriteProduct type to match what FavoriteContext uses
interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account/favorites' } } });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleRemoveFromFavorites = (productId: string) => {
    toggleFavorite(productId);
    showSuccess('Product removed from favorites');
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    // Create a CartItem object that matches the expected structure
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.image,
      selectedColor: product.colors && product.colors.length > 0 ? product.colors[0] : '',
      selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
    };
    
    addToCart(cartItem);
    showSuccess('Product added to cart');
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: { sm: '100%', md: '95%', lg: '90%' },
        mx: 'auto',
        width: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 3, sm: 4 },
          gap: { xs: 1, sm: 2 }
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              color: 'text.secondary',
              px: { xs: 0, sm: 1 },
              mb: { xs: 1, sm: 0 },
              '&:hover': {
                bgcolor: 'transparent',
                color: 'text.primary'
              }
            }}
          >
            Quay lại
          </Button>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              fontFamily: '"Playfair Display", serif',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: 1,
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: { xs: 40, sm: 50, md: 60 },
                height: 3,
                bgcolor: 'primary.main',
                borderRadius: '2px',
              },
            }}
          >
            Sản Phẩm Yêu Thích
          </Typography>
        </Box>

        <Divider sx={{ mb: { xs: 3, sm: 4 } }} />

        {favorites.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Bạn chưa có sản phẩm yêu thích nào
            </Typography>
            <Typography color="text.secondary" paragraph>
              Hãy khám phá các sản phẩm và thêm vào danh sách yêu thích của bạn
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
            >
              Khám phá sản phẩm
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}>
            {favorites.map((product) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: { xs: '6px', sm: '8px' },
                    overflow: 'hidden',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #eee',
                    '&:hover': {
                      transform: { xs: 'translateY(-3px)', sm: 'translateY(-5px)' },
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      '& img': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    paddingTop: '100%' // 1:1 aspect ratio
                  }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={product.image}
                      alt={product.name}
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.5s ease',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                      }}
                      onClick={() => handleViewProduct(product.id)}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: { xs: 5, sm: 8 },
                        right: { xs: 5, sm: 8 },
                        bgcolor: 'white',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        '&:hover': { 
                          bgcolor: 'white',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleRemoveFromFavorites(product.id)}
                    >
                      <DeleteOutline color="error" sx={{ fontSize: { xs: 14, sm: 16 } }} />
                    </IconButton>
                  </Box>
                  <CardContent 
                    sx={{ 
                      flexGrow: 1, 
                      cursor: 'pointer',
                      p: { xs: 1.5, sm: 2 }, 
                      pb: { xs: 1, sm: 1.5 },
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 0.5
                    }} 
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <Typography 
                      variant="subtitle2" 
                      component="div" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                        mb: 0.5,
                        height: '2.5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary.main" 
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        mt: 'auto'
                      }}
                    >
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        py: { xs: 0.5, sm: 0.75 },
                        fontWeight: 600,
                        borderRadius: { xs: '4px', sm: '4px' },
                        textTransform: 'none',
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                        '&:hover': { 
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      Thêm Vào Giỏ
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default FavoritesPage; 