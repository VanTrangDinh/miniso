import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalSnackbarProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <FavoriteProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-success" element={<OrderSuccessPage />} />
                      <Route path="/account/settings" element={<AccountSettingsPage />} />
                      <Route path="/account/favorites" element={<FavoritesPage />} />
                      <Route path="/account/orders" element={<MyOrdersPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about" element={<AboutPage />} />
                    </Routes>
                  </Layout>
                </FavoriteProvider>
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </GlobalSnackbarProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App; 