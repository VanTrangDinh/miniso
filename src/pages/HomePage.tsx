import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  useTheme,
  useMediaQuery,
  TextField,
  IconButton,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  alpha,
} from '@mui/material';
import {
  ArrowForward,
  LocalShipping,
  Security,
  SupportAgent,
  Send,
  Star,
  Favorite,
  FavoriteBorder,
  ShoppingBag,
  KeyboardArrowRight,
  KeyboardArrowDown,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { formatPrice } from '../utils/format';

// High-quality hero images
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isTouched, setIsTouched] = useState(false);
  const [showHoverImage, setShowHoverImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const featuredProductsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Change hero image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = () => {
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
  };

  const handleImageToggle = () => {
    if (isMobile) {
      setShowHoverImage(prev => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  const handleAddToCart = (product: any) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedProduct || !selectedSize || !selectedColor) return;
    
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice,
      image: selectedProduct.image,
      quantity: 1,
      selectedSize,
      selectedColor
    });
    
    setOpenDialog(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleFavoriteClick = (product: any) => {
    if (favorites.some(f => f.id === product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleExploreClick = () => {
    navigate('/products');
  };

  const handleScrollDown = () => {
    featuredProductsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleViewProduct = (id: string) => {
    navigate(`/products/${id}`);
  };

  const featuredProducts = products.slice(0, 8);
  const trendingProducts = products.slice(8, 12);

  return (
    <Box sx={{ 
      scrollBehavior: 'smooth',
      '& > section': {
        opacity: 0,
        animation: 'fadeInUp 1s ease forwards',
        animationFillMode: 'both'
      },
      '@keyframes fadeInUp': {
        from: {
          opacity: 0,
          transform: 'translateY(30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        }
      }
    }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          height: { xs: '100vh', md: '100vh' },
          overflow: 'hidden',
          mb: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(120deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1,
          },
        }}
      >
        {HERO_IMAGES.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            alt={`Hero Image ${index + 1}`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentHeroImage === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out, transform 10s ease-in-out',
              transform: currentHeroImage === index ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ))}
        
        <Container
          maxWidth="xl"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            px: { xs: 2, sm: 3, md: 4, lg: 8 },
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: '100%', sm: '80%', md: '60%' },
              animation: 'slideIn 1s ease-out',
              animationDelay: '0.2s',
              opacity: 0,
              animationFillMode: 'forwards',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateX(-50px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'white',
                fontWeight: 500,
                letterSpacing: '0.2em',
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' },
                mb: { xs: 2, sm: 3 },
                display: 'block',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              MINISO SELECTION
            </Typography>
            
            <Typography
              variant={isMobile ? 'h3' : 'h1'}
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: { xs: 2, sm: 3, md: 4 },
                fontFamily: '"Playfair Display", serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                maxWidth: '800px',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.1,
                letterSpacing: '0.01em',
              }}
            >
              Khám Phá Phong Cách Sống Hiện Đại
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                mb: { xs: 3, sm: 4, md: 5 },
                fontWeight: 400,
                maxWidth: { xs: '100%', sm: '80%', md: '600px' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.6,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
              }}
            >
              Mang đến trải nghiệm mua sắm thú vị với hàng nghìn sản phẩm chất lượng cao, đẹp mắt với giá cả phải chăng.
            </Typography>
            
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{ mt: { xs: 2, sm: 3 } }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleExploreClick}
                sx={{
                  bgcolor: 'white',
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 5,
                  py: 1.5,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Mua Sắm Ngay
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => categoriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 500,
                  px: 5,
                  py: 1.5,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Danh Mục
              </Button>
            </Stack>
          </Box>
        </Container>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            cursor: 'pointer',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translate(-50%, 0)',
              },
              '40%': {
                transform: 'translate(-50%, -20px)',
              },
              '60%': {
                transform: 'translate(-50%, -10px)',
              },
            },
          }}
          onClick={() => categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <KeyboardArrowDown
            sx={{
              fontSize: 48,
              color: 'white',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease',
              },
            }}
          />
        </Box>
      </Box>

      {/* Featured Categories Section */}
      <Box 
        component="section" 
        ref={categoriesRef}
        sx={{ 
          py: { xs: 4, sm: 5, md: 6 },
          bgcolor: '#f9f9f9',
          animationDelay: '0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 0,
          width: '100%'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 }, maxWidth: '800px', px: { xs: 2, sm: 0 } }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                letterSpacing: '0.15em',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                mb: { xs: 1, sm: 2 },
                display: 'block',
              }}
            >
              KHÁM PHÁ
            </Typography>
            
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                position: 'relative',
                display: 'inline-block',
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 3,
                  bgcolor: 'primary.main',
                  borderRadius: '2px',
                },
              }}
            >
              Danh Mục Sản Phẩm
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto', 
                mt: { xs: 2, sm: 3 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                px: { xs: 2, sm: 0 }
              }}
            >
              Khám phá các danh mục sản phẩm đa dạng của chúng tôi với các sản phẩm chất lượng cao
            </Typography>
          </Box>
          
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '95%', md: '90%', lg: '80%' },
                mx: 'auto'
              }}
            >
              <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{ 
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {categories.slice(0, 6).map((category) => (
                  <Grid 
                    item 
                    xs={6} 
                    sm={4} 
                    md={2} 
                    key={category.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        overflow: 'hidden',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        border: '1px solid #eee',
                        width: '100%',
                        maxWidth: '90%',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                          '& img': {
                            transform: 'scale(1.05)',
                          },
                        },
                      }}
                      onClick={() => navigate(`/products?category=${category.slug}`)}
                    >
                      <Box sx={{ position: 'relative', pt: '100%' }}>
                        <CardMedia
                          component="img"
                          image={category.image}
                          alt={category.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                        />
                      </Box>
                      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box
        component="section"
        ref={featuredProductsRef}
        sx={{ 
          py: { xs: 4, sm: 5, md: 6 },
          animationDelay: '0.4s',
          bgcolor: 'white',
          mt: 0,
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
            textAlign: 'center',
            mb: { xs: 4, sm: 6, md: 8 },
            maxWidth: '1200px',
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 0 }
          }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                letterSpacing: '0.15em',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                mb: { xs: 1, sm: 2 },
                display: 'block',
              }}
            >
              BỘ SƯU TẬP
            </Typography>
            
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                position: 'relative',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                display: 'inline-block',
                mb: 4,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  bgcolor: 'primary.main',
                  borderRadius: '2px',
                },
              }}
            >
              Sản Phẩm Nổi Bật
            </Typography>
            
            <Button
              endIcon={<KeyboardArrowRight />}
              onClick={() => navigate('/products')}
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                mt: 2,
                '&:hover': {
                  bgcolor: 'transparent',
                  transform: 'translateX(5px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '95%', md: '90%', lg: '80%' },
                mx: 'auto'
              }}
            >
              <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{ 
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <Grid 
                    item 
                    xs={6} 
                    sm={6} 
                    md={3} 
                    key={product.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        overflow: 'hidden',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        border: '1px solid #eee',
                        width: '100%',
                        maxWidth: '90%',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                          '& img': {
                            transform: 'scale(1.05)',
                          },
                        },
                      }}
                      onClick={() => handleViewProduct(product.id)}
                    >
                      <Box sx={{ position: 'relative', pt: '100%' }}>
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                        />
                        {product.discount && (
                          <Chip
                            label={`-${product.discount}%`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: { xs: 8, sm: 12 },
                              left: { xs: 8, sm: 12 },
                              bgcolor: 'error.main',
                              color: 'white',
                              fontWeight: 'bold',
                              borderRadius: '4px',
                              fontSize: { xs: '0.8rem', sm: '0.9rem' },
                              height: { xs: 24, sm: 28 },
                              zIndex: 1
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                            height: { xs: '2.5em', sm: '2.5em' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="h6"
                            color="primary.main"
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }
                            }}
                          >
                            {formatPrice(product.price)}
                          </Typography>
                          
                          {product.originalPrice && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ 
                                textDecoration: 'line-through',
                                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }
                              }}
                            >
                              {formatPrice(product.originalPrice)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box
        component="section"
        sx={{ 
          py: { xs: 8, md: 12 },
          bgcolor: '#f9f9f9',
          animationDelay: '0.6s'
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 8, maxWidth: '800px', px: { xs: 2, sm: 0 } }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                letterSpacing: '0.15em',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                mb: { xs: 1, sm: 2 },
                display: 'block',
              }}
            >
              TẠI SAO CHỌN CHÚNG TÔI
            </Typography>
            
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                position: 'relative',
                display: 'inline-block',
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 3,
                  bgcolor: 'primary.main',
                  borderRadius: '2px',
                },
              }}
            >
              Dịch Vụ Của Chúng Tôi
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '700px', 
                mx: 'auto', 
                mt: { xs: 2, sm: 3 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                px: { xs: 2, sm: 0 }
              }}
            >
              Chúng tôi tự hào mang đến cho khách hàng trải nghiệm mua sắm tuyệt vời với những dịch vụ chất lượng cao
            </Typography>
          </Box>
          
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            maxWidth: '100%'
          }}>
            <Grid container spacing={4} sx={{ 
              justifyContent: 'center', 
              maxWidth: '100%', 
              width: '100%', 
              mx: 'auto' 
            }}>
              <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid #eee',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                      '& .icon-container': {
                        transform: 'scale(1.1) rotateY(180deg)'
                      }
                    },
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mb: 3,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    <LocalShipping sx={{ fontSize: 40 }} />
                  </Box>
                    <Typography
                      variant="h6"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Giao Hàng Miễn Phí
                    </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Miễn phí giao hàng với tất cả đơn hàng từ 500.000đ trong nội thành và 1.000.000đ toàn quốc
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={0}
                sx={{
                      p: 4,
                      width: '100%',
                      maxWidth: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                  textAlign: 'center',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      border: '1px solid #eee',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                        '& .icon-container': {
                          transform: 'scale(1.1) rotateY(180deg)'
                        }
                  },
                }}
              >
                    <Box
                      className="icon-container"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        mb: 3,
                        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      }}
                    >
                      <SupportAgent sx={{ fontSize: 40 }} />
                  </Box>
                    <Typography
                      variant="h6"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Hỗ Trợ 24/7
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn 24/7
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid #eee',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                      '& .icon-container': {
                        transform: 'scale(1.1) rotateY(180deg)'
                      }
                    },
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mb: 3,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    <Security sx={{ fontSize: 40 }} />
                </Box>
                  <Typography
                    variant="h6"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Bảo Mật Thanh Toán
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  Hệ thống thanh toán an toàn và bảo mật, đảm bảo thông tin cá nhân của bạn luôn được bảo vệ
                </Typography>
              </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid #eee',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                      '& .icon-container': {
                        transform: 'scale(1.1) rotateY(180deg)'
                      }
                    },
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mb: 3,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    <ShoppingBag sx={{ fontSize: 40 }} />
                </Box>
                  <Typography
                    variant="h6"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Đổi Trả Dễ Dàng
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  Chính sách đổi trả trong vòng 30 ngày nếu sản phẩm có lỗi hoặc không đúng như mô tả
                </Typography>
              </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: `url('https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80') no-repeat center center/cover`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(44, 62, 80, 0.9) 0%, rgba(44, 62, 80, 0.7) 100%)',
            zIndex: 1,
          },
          animationDelay: '0.8s'
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box 
            sx={{ 
              textAlign: 'center',
              color: 'white',
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                position: 'relative',
                display: 'inline-block',
                paddingBottom: 2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  bgcolor: 'white',
                  borderRadius: '2px',
                },
              }}
            >
              Đăng Ký Nhận Thông Tin
            </Typography>
            
            <Typography
              variant="body1"
              sx={{ 
                mb: 6,
                opacity: 0.9,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              Đăng ký nhận thông tin về các sản phẩm mới, khuyến mãi đặc biệt và các sự kiện độc quyền dành cho khách hàng thân thiết
            </Typography>
            
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                maxWidth: '550px',
                mx: 'auto',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <TextField
                fullWidth
                placeholder="Nhập địa chỉ email của bạn"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: 2,
                    px: 3,
                    fontSize: '1rem',
                  },
                  flex: 1,
                }}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, color: 'text.secondary' }}>
                      <Send sx={{ transform: 'rotate(-45deg)', fontSize: 20 }} />
                    </Box>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  py: 2,
                  px: { xs: 3, sm: 5 },
                  borderRadius: { xs: '0 0 12px 12px', sm: '0 12px 12px 0' },
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Đăng Ký
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 