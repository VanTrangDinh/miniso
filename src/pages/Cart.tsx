import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { state: cartState, updateQuantity, removeFromCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartState.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ mb: 4, fontFamily: '"Playfair Display", serif' }}
        >
          Giỏ hàng trống
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{
            textTransform: 'none',
            fontFamily: '"Playfair Display", serif',
            px: { xs: 3, sm: 4 },
            py: 1.5,
          }}
        >
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        sx={{ mb: { xs: 3, md: 4 }, fontFamily: '"Playfair Display", serif' }}
      >
        Giỏ hàng của bạn
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cartState.items.map((item) => (
              <Card 
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} 
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: '100%', sm: 120 },
                    height: { xs: 200, sm: 160 },
                    objectFit: 'cover',
                  }}
                  image={item.image}
                  alt={item.name}
                />
                <CardContent 
                  sx={{ 
                    flex: 1,
                    p: { xs: 1, sm: 2 },
                    '&:last-child': { pb: { xs: 1, sm: 2 } },
                  }}
                >
                  <Stack spacing={1}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Playfair Display", serif',
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary">
                        Kích thước: {item.selectedSize}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Màu sắc: {item.selectedColor}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {formatPrice(item.price)}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Add />
                        </IconButton>
                      </Box>
                      <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: { md: 24 },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tổng quan đơn hàng
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Tạm tính:</Typography>
                <Typography>{formatPrice(calculateTotal())}₫</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Phí vận chuyển:</Typography>
                <Typography>30,000₫</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Tổng cộng:
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  {formatPrice(calculateTotal() + 30000)}₫
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/checkout')}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Tiến hành thanh toán
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 