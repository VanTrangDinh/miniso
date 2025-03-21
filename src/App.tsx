import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import GlobalSnackbarProvider from './components/GlobalSnackbarProvider';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AboutPage from './pages/AboutPage';

// Create a wrapper component that provides the children prop to Layout
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalSnackbarProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <FavoriteProvider>
                <Routes>
                  <Route path="/" element={<LayoutWrapper />}>
                    {/* Trang chủ */}
                    <Route index element={<HomePage />} />
                    
                    {/* Sản phẩm */}
                    <Route path="products">
                      <Route index element={<ProductsPage />} />
                      <Route path=":id" element={<ProductDetailPage />} />
                    </Route>
              
                    
                    {/* Giỏ hàng và thanh toán */}
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="order-success" element={<OrderSuccessPage />} />
                    
                    {/* Tài khoản người dùng */}
                    <Route path="account">
                      <Route path="settings" element={<AccountSettingsPage />} />
                      <Route path="favorites" element={<FavoritesPage />} />
                      <Route path="orders" element={<MyOrdersPage />} />
                    </Route>
                    
                    {/* Xác thực */}
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    
                    {/* Liên hệ */}
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Route>
                </Routes>
              </FavoriteProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </GlobalSnackbarProvider>
    </ThemeProvider>
  );
};

export default App; 