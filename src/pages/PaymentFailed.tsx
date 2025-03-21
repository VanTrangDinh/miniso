import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ErrorOutline, ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  orderId?: string;
  error: string;
}

const PaymentFailed: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: { xs: 48, md: 64 },
            color: 'error.main',
            mb: 2,
          }}
        />
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            mb: 2,
            fontWeight: 600,
            color: 'error.main',
          }}
        >
          Thanh toán không thành công
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {state?.error || 'Đã có lỗi xảy ra trong quá trình thanh toán'}
          {state?.orderId && (
            <>
              <br />
              Mã đơn hàng: {state.orderId}
            </>
          )}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              px: 4,
              py: 1.5,
            }}
          >
            Quay lại trang chủ
          </Button>
          
          <Button
            variant="contained"
            onClick={() => navigate('/checkout')}
            sx={{
              textTransform: 'none',
              px: 4,
              py: 1.5,
            }}
          >
            Thử lại
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentFailed; 