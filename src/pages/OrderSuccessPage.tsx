import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { Check, AccessTime, LocalShipping, Home, Person } from '@mui/icons-material';
import { formatPrice } from '../utils/format';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface ShippingInfo {
  name: string;
  email?: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  orderDate: string;
  paymentMethod: string;
  orderStatus: string;
  estimatedDelivery: string;
  shippingInfo: ShippingInfo;
}

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state as { order: Order };

  // Nếu không có dữ liệu đơn hàng, thử lấy từ localStorage
  React.useEffect(() => {
    if (!order) {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        if (orders.length > 0) {
          // Nếu có đơn hàng, sử dụng đơn hàng mới nhất
          // Trong thực tế, bạn có thể sử dụng ID đơn hàng từ URL để tìm đơn hàng cụ thể
          const latestOrder = orders[orders.length - 1];
          if (latestOrder) {
            // Đặt latestOrder vào state nếu cần
          }
        }
      }
    }
  }, [order]);

  const handleContinueShopping = () => {
    navigate('/');
  };
  
  const handleViewAllOrders = () => {
    navigate('/account/orders');
  };

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Không tìm thấy thông tin đơn hàng
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleContinueShopping}
          sx={{ mt: 2 }}
        >
          Quay lại trang chủ
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 5,
          animation: 'fadeIn 0.6s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(-20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'success.light', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <Check sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Đặt hàng thành công!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cảm ơn bạn đã mua sắm tại MINISO. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Thông tin đơn hàng</Typography>
              <Chip 
                label={order.orderStatus} 
                color="primary" 
                size="small" 
                sx={{ 
                  fontWeight: 500,
                  bgcolor: order.orderStatus === 'Đang xử lý' ? 'primary.main' : 'success.main' 
                }}
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt hàng:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{formatDate(order.orderDate)}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Mã đơn hàng:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{order.id}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShipping fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Dự kiến giao hàng:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{order.estimatedDelivery}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Home fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Địa chỉ giao hàng:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{order.shippingInfo.address}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>Chi tiết sản phẩm</Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="center">Đơn giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            variant="rounded" 
                            src={item.image} 
                            alt={item.name}
                            sx={{ width: 64, height: 64, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.selectedSize && `Kích thước: ${item.selectedSize}`}
                              {item.selectedSize && item.selectedColor && ' | '}
                              {item.selectedColor && `Màu sắc: ${item.selectedColor}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{formatPrice(item.price)}đ</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{formatPrice(item.price * item.quantity)}đ</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ maxWidth: 400, ml: 'auto' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography>Tạm tính:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">{formatPrice(order.subtotal)}đ</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Phí vận chuyển:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">{formatPrice(order.shippingFee)}đ</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Tổng cộng:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right" color="primary.main">{formatPrice(order.totalAmount)}đ</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>Thông tin thanh toán</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Phương thức thanh toán:</Typography>
                <Typography variant="body1">{order.paymentMethod}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Trạng thái thanh toán:</Typography>
                <Typography variant="body1">
                  {order.paymentMethod === 'Thanh toán khi nhận hàng (COD)' 
                    ? 'Chưa thanh toán' 
                    : 'Đã thanh toán'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={handleViewAllOrders}
            >
              Xem tất cả đơn hàng
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleContinueShopping}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderSuccessPage; 