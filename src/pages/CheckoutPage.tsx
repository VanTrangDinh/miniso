import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  FormControl,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import { useOrders } from '../contexts/OrderContext';
import { useSnackbar } from '../components/GlobalSnackbarProvider';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowForward,
  LocalShipping,
  Payment,
  CheckCircle,
  CreditCard,
  AccountBalanceWallet,
  Security,
  ShoppingBag,
} from '@mui/icons-material';

interface FormDataType {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: string;
  saveInfo: boolean;
}

const CheckoutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { state: cartState, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { isAuthenticated, user, loading } = useAuth();
  
  const [formData, setFormData] = useState<FormDataType>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    paymentMethod: 'cod',
    saveInfo: true,
  });

  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Thông tin giao hàng', 'Phương thức thanh toán', 'Xác nhận đơn hàng'];

  const { showSuccess, showError } = useSnackbar();

  // Kiểm tra đăng nhập và điều hướng
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isAuthenticated, loading, navigate]);

  // Điền thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0) {
      navigate('/cart');
    }
  }, [cartState.items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'saveInfo' ? checked : value,
    });
  };

  const validateForm = () => {
    if (activeStep === 0) {
      if (!formData.fullName || !formData.phone || !formData.address) {
        showError('Vui lòng điền đầy đủ thông tin bắt buộc');
        return false;
      }
    }
    
    if (activeStep === 1) {
      if (!formData.paymentMethod) {
        showError('Vui lòng chọn phương thức thanh toán');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.paymentMethod) {
      showError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Tạo đơn hàng mới
    const newOrder = {
      id: `ORD${Date.now()}`,
      items: cartState.items,
      totalAmount: calculateSubtotal(),
      status: 'Đang xử lý',
      orderDate: new Date().toISOString(),
      orderStatus: 'Đang xử lý',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      shippingInfo: {
        name: formData.fullName,
        phone: formData.phone,
        address: formData.address
      },
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toISOString(),
      shippingFee: 0,
      userId: user?.id || null,
    };

    // Thêm đơn hàng và xóa giỏ hàng
    addOrder(newOrder);
    clearCart();
    
    showSuccess('Đặt hàng thành công!');
    
    // Chuyển đến trang xác nhận đơn hàng
    setTimeout(() => {
      navigate('/order-success', { state: { order: newOrder } });
    }, 1500);
  };

  const calculateSubtotal = () => {
    return cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Hiển thị spinner khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Hiển thị thông báo yêu cầu đăng nhập
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Vui lòng đăng nhập để tiếp tục thanh toán
          </Alert>
          <Typography variant="h5" gutterBottom>
            Bạn cần đăng nhập để đặt hàng
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Để đảm bảo đơn hàng của bạn được xử lý chính xác, vui lòng đăng nhập hoặc tạo tài khoản trước khi tiếp tục thanh toán.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              component={Link}
              to="/login"
              sx={{ minWidth: 150 }}
            >
              Đăng nhập
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/register"
              sx={{ minWidth: 150 }}
            >
              Đăng ký
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Thanh toán
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Shipping Information */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Thông tin giao hàng
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={2}
                    size={isMobile ? 'small' : 'medium'}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tỉnh/Thành phố"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quận/Huyện"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        name="saveInfo"
                        color="primary"
                      />
                    }
                    label="Lưu thông tin cho lần mua hàng sau"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Payment Method */}
          {activeStep === 1 && (
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Phương thức thanh toán
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <FormControlLabel 
                    value="cod" 
                    control={<Radio />} 
                    label="Thanh toán khi nhận hàng (COD)" 
                  />
                  <FormControlLabel
                    value="banking"
                    control={<Radio />}
                    label="Chuyển khoản ngân hàng"
                  />
                  <FormControlLabel
                    value="momo"
                    control={<Radio />}
                    label="Ví MoMo"
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          )}

          {/* Order Confirmation */}
          {activeStep === 2 && (
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Xác nhận đơn hàng
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thông tin giao hàng
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.fullName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.phone}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.address}
                  {formData.district && `, ${formData.district}`}
                  {formData.city && `, ${formData.city}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1">
                  {formData.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                  {formData.paymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
                  {formData.paymentMethod === 'momo' && 'Ví MoMo'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Danh sách sản phẩm
                </Typography>
                <List>
                  {cartState.items.map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar variant="rounded" src={item.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${formatPrice(item.price)} x ${item.quantity}`}
                      />
                      <Typography variant="body1" fontWeight="bold">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/cart') : handleBack}
              sx={{ px: 3 }}
            >
              {activeStep === 0 ? 'Quay lại giỏ hàng' : 'Quay lại'}
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
              sx={{ px: 3 }}
            >
              {activeStep === steps.length - 1 ? 'Đặt hàng' : 'Tiếp tục'}
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, md: 3 }, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Tóm tắt đơn hàng
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Tạm tính</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatPrice(calculateSubtotal())}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Phí vận chuyển</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatPrice(0)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {formatPrice(calculateSubtotal())}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Số lượng sản phẩm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cartState.items.reduce((acc, item) => acc + item.quantity, 0)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage; 