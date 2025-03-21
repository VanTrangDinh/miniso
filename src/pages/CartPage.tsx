import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import CustomAlert from '../components/CustomAlert';
import { useSnackbar } from '../components/GlobalSnackbarProvider';

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const { showSuccess, showError } = useSnackbar();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(id, newQuantity);
      if (newQuantity === 0) {
        setAlertMessage('Sản phẩm đã được xóa khỏi giỏ hàng');
        setAlertSeverity('info');
        setShowAlert(true);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    showSuccess('Item removed from cart');
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateCartItemQuantity(id, newQuantity);
    showSuccess('Cart updated successfully');
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          Giỏ hàng của bạn
        </Typography>

        {state.items.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {state.items.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {item.name}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                              Size: {item.selectedSize} | Màu: {item.selectedColor}
                            </Typography>
                            <Typography color="primary" variant="h6">
                              {formatPrice(item.price)}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={() => handleRemoveItem(item.id)}
                            color="error"
                            sx={{ mt: -1 }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                handleUpdateQuantity(item.id, value);
                              }
                            }}
                            inputProps={{
                              min: 1,
                              style: { textAlign: 'center', width: '50px' },
                            }}
                            sx={{ mx: 1 }}
                          />
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            size="small"
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tổng giỏ hàng
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Tạm tính:</Typography>
                      <Typography>{formatPrice(state.totalAmount)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Phí vận chuyển:</Typography>
                      <Typography>Miễn phí</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">Tổng cộng:</Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(state.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    sx={{ mt: 2 }}
                  >
                    Tiến hành thanh toán
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Giỏ hàng của bạn đang trống
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        )}
      </Container>

      <CustomAlert 
        open={showAlert}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
      />
    </>
  );
};

export default CartPage; 