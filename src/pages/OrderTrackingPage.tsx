import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  LocalShipping,
  Inventory,
  Assignment,
  CheckCircle,
  Search,
} from '@mui/icons-material';
import { formatPrice } from '../utils/format';

// Định nghĩa interface cho đơn hàng
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

const OrderTrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Lấy tất cả đơn hàng từ localStorage khi component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        setAllOrders(orders);
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
      }
    }
  }, []);

  // Xử lý tìm kiếm đơn hàng
  const handleSearch = () => {
    setIsSearched(true);
    setError('');
    setOrder(null);

    if (!orderId.trim()) {
      setError('Vui lòng nhập mã đơn hàng');
      return;
    }

    // Tìm kiếm đơn hàng trong danh sách
    const searchId = orderId.trim().toUpperCase();
    const foundOrder = allOrders.find(order => {
      // So sánh với id đầy đủ hoặc phần sau "ORD"
      return order.id === searchId || 
             order.id === `ORD${searchId}` || 
             order.id.substring(3) === searchId;
    });

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.');
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Xác định trạng thái của các bước theo dõi đơn hàng
  const getActiveStep = () => {
    if (!order) return 0;
    
    switch (order.orderStatus) {
      case 'Đã hủy':
        return -1; // Đơn hàng đã hủy
      case 'Đang xử lý':
        return 0;
      case 'Đang giao hàng':
        return 1;
      case 'Đã giao hàng':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Theo dõi đơn hàng
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            label="Nhập mã đơn hàng"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Nhập mã đơn hàng (VD: ORD12345678)"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Search color="action" />
              ),
            }}
            error={!!error && isSearched}
            helperText={error && isSearched ? error : ''}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ height: 56, minWidth: 120 }}
          >
            Kiểm tra
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nhập mã đơn hàng của bạn để theo dõi trạng thái giao hàng. Mã đơn hàng được gửi trong email xác nhận đơn hàng.
        </Typography>
      </Paper>

      {order && (
        <Box>
          <Card sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ mb: 4 }}>
                <Stepper activeStep={getActiveStep()} alternativeLabel>
                  <Step>
                    <StepLabel StepIconComponent={() => (
                      <Assignment color={getActiveStep() >= 0 ? 'primary' : 'disabled'} />
                    )}>Đang xử lý</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={() => (
                      <Inventory color={getActiveStep() >= 1 ? 'primary' : 'disabled'} />
                    )}>Đã đóng gói</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={() => (
                      <LocalShipping color={getActiveStep() >= 2 ? 'primary' : 'disabled'} />
                    )}>Đang giao hàng</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={() => (
                      <CheckCircle color={getActiveStep() >= 3 ? 'primary' : 'disabled'} />
                    )}>Đã giao hàng</StepLabel>
                  </Step>
                </Stepper>
              </Box>

              {getActiveStep() === -1 && (
                <Typography variant="body1" color="error" sx={{ textAlign: 'center', mb: 2 }}>
                  Đơn hàng này đã bị hủy.
                </Typography>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thông tin đơn hàng</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Mã đơn hàng:</Typography>
                      <Typography variant="body2">{order.id}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Ngày đặt hàng:</Typography>
                      <Typography variant="body2">{formatDate(order.orderDate)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                      <Typography variant="body2" fontWeight={500}>{order.orderStatus}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Giao hàng dự kiến:</Typography>
                      <Typography variant="body2">{order.estimatedDelivery}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thông tin giao hàng</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Người nhận:</Typography>
                      <Typography variant="body2">{order.shippingInfo.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Số điện thoại:</Typography>
                      <Typography variant="body2">{order.shippingInfo.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body2">{order.shippingInfo.email || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Địa chỉ:</Typography>
                      <Typography variant="body2" style={{ maxWidth: '60%', textAlign: 'right' }}>
                        {order.shippingInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Sản phẩm</Typography>
              <List>
                {order.items.map((item) => (
                  <ListItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={item.image} 
                        alt={item.name} 
                        sx={{ width: 56, height: 56, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <>
                          {item.selectedSize && `Kích thước: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ' | '}
                          {item.selectedColor && `Màu sắc: ${item.selectedColor}`}
                          <Box component="span" sx={{ display: 'block' }}>
                            SL: {item.quantity} x {formatPrice(item.price)}đ
                          </Box>
                        </>
                      }
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {formatPrice(item.price * item.quantity)}đ
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px', mb: 1 }}>
                  <Typography variant="body2">Tạm tính:</Typography>
                  <Typography variant="body2">{formatPrice(order.subtotal)}đ</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px', mb: 1 }}>
                  <Typography variant="body2">Phí vận chuyển:</Typography>
                  <Typography variant="body2">{formatPrice(order.shippingFee)}đ</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px', mt: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Tổng tiền:</Typography>
                  <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                    {formatPrice(order.totalAmount)}đ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default OrderTrackingPage; 