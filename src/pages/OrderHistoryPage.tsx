import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Chip,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore, ShoppingBag, LocalShipping, Inventory2, Receipt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { formatPrice } from '../utils/format';

const OrderHistoryPage: React.FC = () => {
  const { state } = useOrders();
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang xử lý':
        return 'primary';
      case 'Đang giao hàng':
        return 'info';
      case 'Đã giao hàng':
        return 'success';
      case 'Đã hủy':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt /> Lịch sử đơn hàng
      </Typography>

      {state.orders.length > 0 ? (
        <Stack spacing={3}>
          {state.orders.map((order) => (
            <Paper key={order.id} elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2">
                      Mã đơn hàng: {order.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2">
                      Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Chip 
                      label={order.orderStatus}
                      color={getStatusColor(order.orderStatus) as any}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingBag fontSize="small" /> Chi tiết đơn hàng
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Accordion defaultExpanded>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="order-items-content"
                          id="order-items-header"
                        >
                          <Typography>
                            Sản phẩm ({order.items.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            {order.items.map((item) => (
                              <Card 
                                key={item.id} 
                                elevation={0} 
                                sx={{ 
                                  display: 'flex', 
                                  border: '1px solid', 
                                  borderColor: 'divider' 
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  sx={{ width: 100, height: 100, objectFit: 'cover', cursor: 'pointer' }}
                                  image={item.image}
                                  alt={item.name}
                                  onClick={() => handleViewProduct(item.id)}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => handleViewProduct(item.id)}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Size: {item.selectedSize} | Màu: {item.selectedColor}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body2">
                                      {formatPrice(item.price)} x {item.quantity}
                                    </Typography>
                                    <Typography variant="subtitle2" color="primary.main">
                                      {formatPrice(item.price * item.quantity)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShipping fontSize="small" /> Thông tin giao hàng
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Người nhận:</strong> {order.shippingInfo.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Địa chỉ:</strong> {order.shippingInfo.address}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Số điện thoại:</strong> {order.shippingInfo.phone}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Dự kiến giao hàng:</strong> {order.estimatedDelivery}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Inventory2 fontSize="small" /> Thanh toán
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Phương thức:</strong> {order.paymentMethod}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Tạm tính:</Typography>
                        <Typography variant="body2">{formatPrice(order.totalAmount)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Phí vận chuyển:</Typography>
                        <Typography variant="body2">{formatPrice(order.shippingFee)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Tổng cộng:</Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                          {formatPrice(order.totalAmount + order.shippingFee)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ))}
        </Stack>
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
            Bạn chưa có đơn hàng nào
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
          >
            Bắt đầu mua sắm
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryPage; 