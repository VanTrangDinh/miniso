import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Collapse
} from '@mui/material';
import { formatPrice } from '../utils/format';
import { KeyboardArrowRight, KeyboardArrowDown, KeyboardArrowUp, ShoppingBag } from '@mui/icons-material';

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

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Lấy danh sách đơn hàng từ localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders.reverse()); // Hiển thị đơn hàng mới nhất trước
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
      }
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  const handleViewDetail = (order: Order) => {
    navigate('/order-success', { state: { order } });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  // Lọc đơn hàng theo tab
  const filteredOrders = tab === 0 
    ? orders 
    : orders.filter(order => {
        if (tab === 1) return order.orderStatus === 'Đang xử lý';
        if (tab === 2) return order.orderStatus === 'Đang giao hàng';
        if (tab === 3) return order.orderStatus === 'Đã giao hàng';
        if (tab === 4) return order.orderStatus === 'Đã hủy';
        return true;
      });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Hiển thị trang trống nếu không có đơn hàng
  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              py: 6
            }}
          >
            <ShoppingBag 
              sx={{ 
                fontSize: 80, 
                color: 'text.disabled',
                mb: 2
              }} 
            />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Bạn chưa có đơn hàng nào
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Hãy mua sắm và quay lại đây để xem lịch sử đơn hàng của bạn
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleContinueShopping}
            >
              Mua sắm ngay
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Đơn hàng của tôi
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 4,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1rem',
          }
        }}
      >
        <Tab label="Tất cả đơn hàng" />
        <Tab label="Đang xử lý" />
        <Tab label="Đang giao hàng" />
        <Tab label="Đã giao hàng" />
        <Tab label="Đã hủy" />
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Không có đơn hàng nào trong mục này
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {filteredOrders.map((order) => (
            <Paper 
              key={order.id} 
              sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Đơn hàng #{order.id.substring(3, 11)}
                </Typography>
                <Chip 
                  label={order.orderStatus} 
                  color={
                    order.orderStatus === 'Đã giao hàng' 
                      ? 'success' 
                      : order.orderStatus === 'Đã hủy'
                        ? 'error'
                        : 'primary'
                  }
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đặt hàng
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(order.orderDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng tiền
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary.main">
                    {formatPrice(order.totalAmount)}đ
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Giao đến
                  </Typography>
                  <Typography variant="body1" noWrap>
                    {order.shippingInfo.address}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {order.items.slice(0, 3).map((item) => (
                  <Box 
                    key={`${item.id}-preview-${item.selectedSize}-${item.selectedColor}`}
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ 
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ))}
                {order.items.length > 3 && (
                  <Box 
                    sx={{ 
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      typography: 'body2',
                      fontWeight: 600
                    }}
                  >
                    +{order.items.length - 3}
                  </Box>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  onClick={() => handleViewDetail(order)}
                  endIcon={<KeyboardArrowRight />}
                >
                  Xem chi tiết
                </Button>
                
                <IconButton 
                  onClick={() => handleToggleExpand(order.id)}
                  size="small"
                >
                  {expandedOrder === order.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedOrder === order.id}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Chi tiết sản phẩm
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell align="right">Đơn giá</TableCell>
                          <TableCell align="center">SL</TableCell>
                          <TableCell align="right">Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={`${item.id}-detail-${item.selectedSize}-${item.selectedColor}`}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  component="img"
                                  src={item.image}
                                  alt={item.name}
                                  sx={{ width: 40, height: 40, mr: 1, borderRadius: 1 }}
                                />
                                <Box>
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.selectedSize && `${item.selectedSize}`}
                                    {item.selectedSize && item.selectedColor && ' / '}
                                    {item.selectedColor && `${item.selectedColor}`}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{formatPrice(item.price)}đ</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">{formatPrice(item.price * item.quantity)}đ</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyOrdersPage; 