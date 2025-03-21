import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import {
  LocalShipping,
  Cached,
  Shield,
  Facebook,
  Instagram,
  Twitter,
  Pinterest,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const categories = [
  {
    title: 'Thời trang nam',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    path: '/products?category=men',
  },
  {
    title: 'Thời trang nữ',
    image: 'https://images.unsplash.com/photo-1581044777550-2cfa2e6abf88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80',
    path: '/products?category=women',
  },
  {
    title: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80',
    path: '/products?category=accessories',
  },
];

const features = [
  {
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    title: 'Miễn phí vận chuyển',
    description: 'Cho đơn hàng trên 500.000đ',
  },
  {
    icon: <Cached sx={{ fontSize: 40 }} />,
    title: 'Đổi trả dễ dàng',
    description: 'Trong vòng 30 ngày',
  },
  {
    icon: <Shield sx={{ fontSize: 40 }} />,
    title: 'Bảo hành chính hãng',
    description: '12 tháng cho tất cả sản phẩm',
  },
];

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'relative',
              color: 'white',
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { md: '50%' },
            }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              sx={{
                mb: 2,
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
              }}
            >
              Bộ sưu tập mới nhất
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Khám phá những xu hướng thời trang mới nhất
            </Typography>
            <Button
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              onClick={() => navigate('/products')}
              sx={{
                textTransform: 'none',
                fontFamily: '"Playfair Display", serif',
                px: { xs: 3, sm: 4 },
                py: 1.5,
              }}
            >
              Mua sắm ngay
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: 4,
            textAlign: 'center',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Danh mục sản phẩm
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} md={4} key={category.title}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
                onClick={() => navigate(category.path)}
              >
                <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                  <CardMedia
                    component="img"
                    image={category.image}
                    alt={category.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontFamily: '"Playfair Display", serif',
                        textAlign: 'center',
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            sx={{
              mb: 4,
              textAlign: 'center',
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Sản phẩm nổi bật
          </Typography>
          <Grid container spacing={3}>
            {products.slice(0, 8).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard {...product} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size={isMobile ? 'medium' : 'large'}
              onClick={() => navigate('/products')}
              sx={{
                textTransform: 'none',
                fontFamily: '"Playfair Display", serif',
                px: { xs: 3, sm: 4 },
                py: 1.5,
              }}
            >
              Xem tất cả sản phẩm
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  '&:hover': {
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <Box sx={{ color: 'text.secondary', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                mb: 2,
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Đăng ký nhận tin
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Đăng ký để nhận những thông tin mới nhất về sản phẩm và khuyến mãi
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              <TextField
                fullWidth
                placeholder="Nhập email của bạn"
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
              />
              <Button
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  textTransform: 'none',
                  fontFamily: '"Playfair Display", serif',
                  px: { xs: 3, sm: 4 },
                  py: 1.5,
                }}
              >
                Đăng ký
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Social Media Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: 4,
            textAlign: 'center',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Theo dõi chúng tôi
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          <IconButton
            size="large"
            sx={{
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            size="large"
            sx={{
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            size="large"
            sx={{
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            <Twitter />
          </IconButton>
          <IconButton
            size="large"
            sx={{
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            <Pinterest />
          </IconButton>
        </Box>
        <Divider />
      </Container>
    </Box>
  );
};

export default Home; 