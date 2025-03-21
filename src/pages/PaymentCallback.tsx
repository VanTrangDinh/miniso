import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { paymentService } from '../services/paymentService';

const PaymentCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Lấy orderId từ query params
        const params = new URLSearchParams(location.search);
        const orderId = params.get('orderId') || params.get('vnp_TxnRef') || params.get('requestId');
        
        if (!orderId) {
          throw new Error('Không tìm thấy mã đơn hàng');
        }

        // Kiểm tra trạng thái thanh toán
        const status = await paymentService.checkPaymentStatus(orderId);
        
        // Điều hướng dựa vào trạng thái
        if (status === 'success') {
          navigate('/order-success', {
            state: {
              orderId,
              paymentMethod: location.search.includes('vnp_') ? 'vnpay' : 'momo',
            }
          });
        } else {
          navigate('/payment-failed', {
            state: {
              orderId,
              error: 'Thanh toán không thành công'
            }
          });
        }
      } catch (error) {
        console.error('Error handling payment callback:', error);
        navigate('/payment-failed', {
          state: {
            error: 'Có lỗi xảy ra khi xử lý thanh toán'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [location, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>
        Đang xử lý kết quả thanh toán...
      </Typography>
    </Box>
  );
};

export default PaymentCallback; 