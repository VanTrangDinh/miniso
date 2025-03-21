import axios from 'axios';

interface PaymentData {
  amount: number;
  orderId: string;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
}

interface PaymentResponse {
  paymentUrl: string;
}

interface PaymentStatusResponse {
  status: string;
}

export const paymentService = {
  // Tạo URL thanh toán VNPay
  createVNPayUrl: async (data: PaymentData) => {
    try {
      const { data: responseData } = await axios.post<PaymentResponse>('/api/payment/vnpay/create', data);
      return responseData.paymentUrl;
    } catch (error) {
      console.error('Error creating VNPay URL:', error);
      throw error;
    }
  },

  // Tạo URL thanh toán MoMo
  createMoMoUrl: async (data: PaymentData) => {
    try {
      const { data: responseData } = await axios.post<PaymentResponse>('/api/payment/momo/create', data);
      return responseData.paymentUrl;
    } catch (error) {
      console.error('Error creating MoMo URL:', error);
      throw error;
    }
  },

  // Xử lý thanh toán COD
  processCODPayment: async (orderId: string) => {
    try {
      const { data: responseData } = await axios.post('/api/payment/cod/process', { orderId });
      return responseData;
    } catch (error) {
      console.error('Error processing COD payment:', error);
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (orderId: string) => {
    try {
      const { data: responseData } = await axios.get<PaymentStatusResponse>(`/api/payment/status/${orderId}`);
      return responseData.status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  },
}; 