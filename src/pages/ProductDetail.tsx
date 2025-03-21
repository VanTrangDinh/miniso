import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Rating,
  Chip,
  Stack,
  Tab,
  Tabs,
  Divider,
  TextField,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  Share,
  ShoppingCart,
  LocalShipping,
  Cached,
  Shield,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import CustomAlert from '../components/CustomAlert';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const [selectedProduct] = useState<Product | undefined>(
    products.find((p) => p.id === id)
  );
  const [mainImage, setMainImage] = useState(selectedProduct?.image || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  if (!selectedProduct) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4">Không tìm thấy sản phẩm</Typography>
      </Container>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setAlertMessage(!selectedSize && !selectedColor 
        ? 'Vui lòng chọn kích thước và màu sắc'
        : !selectedSize 
          ? 'Vui lòng chọn kích thước'
          : 'Vui lòng chọn màu sắc');
      setAlertSeverity('warning');
      setShowAlert(true);
      return;
    }

    addToCart({
      ...selectedProduct,
      quantity,
      selectedSize,
      selectedColor,
    });
    setAlertMessage('Đã thêm sản phẩm vào giỏ hàng!');
    setAlertSeverity('success');
    setShowAlert(true);
    
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleFavoriteClick = () => {
    if (selectedProduct) {
      if (isFavorite(selectedProduct.id)) {
        removeFromFavorites(selectedProduct.id);
      } else {
        addToFavorites(selectedProduct);
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '300px', md: '500px' },
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={mainImage}
              alt={selectedProduct.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'white',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              {isFavorite(selectedProduct.id) ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                top: 16,
                right: 72,
                bgcolor: 'white',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <Share />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
            {selectedProduct.images?.map((image, index) => (
              <Box
                key={index}
                onClick={() => setMainImage(image)}
                sx={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: mainImage === image ? '2px solid' : '2px solid transparent',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`${selectedProduct.name}-${index}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  mb: 1,
                }}
              >
                {selectedProduct.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Rating value={selectedProduct.rating} precision={0.5} readOnly />
                <Typography color="text.secondary">
                  ({selectedProduct.reviewCount} đánh giá)
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    color: 'primary.main',
                  }}
                >
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(selectedProduct.price)}
                </Typography>
                {selectedProduct.discount && (
                  <Chip
                    label={`-${selectedProduct.discount}%`}
                    color="error"
                    size="small"
                  />
                )}
              </Stack>
              {selectedProduct.discount && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through', mt: 0.5 }}
                >
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(selectedProduct.price * (1 + selectedProduct.discount / 100))}
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Size Selection */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Kích thước
              </Typography>
              <Stack direction="row" spacing={1}>
                {selectedProduct.sizes?.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      minWidth: 48,
                      height: 48,
                      borderRadius: 1,
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Color Selection */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Màu sắc
              </Typography>
              <Stack direction="row" spacing={1}>
                {selectedProduct.colors?.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'contained' : 'outlined'}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      minWidth: 80,
                      height: 48,
                      borderRadius: 1,
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Quantity */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Số lượng
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleQuantityChange(-1)}
                  sx={{ minWidth: 48, height: 48 }}
                >
                  -
                </Button>
                <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleQuantityChange(1)}
                  sx={{ minWidth: 48, height: 48 }}
                >
                  +
                </Button>
              </Stack>
            </Box>

            {/* Add to Cart */}
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              sx={{
                height: 56,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Thêm vào giỏ hàng
            </Button>

            {/* Benefits */}
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ py: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShipping color="primary" />
                <Typography variant="body2">Miễn phí vận chuyển</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Cached color="primary" />
                <Typography variant="body2">Đổi trả trong 30 ngày</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Shield color="primary" />
                <Typography variant="body2">Bảo hành 12 tháng</Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* Tabs */}
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Mô tả" />
                <Tab label="Thông tin chi tiết" />
                <Tab label="Đánh giá" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography>{selectedProduct.description}</Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1">Chất liệu:</Typography>
                  <Typography>Cotton 100%, thoáng mát</Typography>
                  <Typography variant="subtitle1">Xuất xứ:</Typography>
                  <Typography>Việt Nam</Typography>
                  <Typography variant="subtitle1">Hướng dẫn bảo quản:</Typography>
                  <Typography>
                    - Giặt máy ở nhiệt độ thường
                    <br />
                    - Không sử dụng chất tẩy
                    <br />
                    - Phơi trong bóng râm
                  </Typography>
                </Stack>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Stack spacing={3}>
                  {/* Review Form */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Viết đánh giá
                    </Typography>
                    <Stack spacing={2}>
                      <Rating
                        size="large"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                      <TextField
                        multiline
                        rows={4}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        sx={{
                          alignSelf: 'flex-start',
                          textTransform: 'none',
                        }}
                      >
                        Gửi đánh giá
                      </Button>
                    </Stack>
                  </Box>

                  {/* Review List */}
                  <Stack spacing={3}>
                    {[1, 2, 3].map((review) => (
                      <Box key={review}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar>U</Avatar>
                          <Box>
                            <Typography variant="subtitle1">
                              Người dùng {review}
                            </Typography>
                            <Rating value={5} size="small" readOnly />
                          </Box>
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, ml: 7 }}
                        >
                          Sản phẩm rất đẹp và chất lượng. Đóng gói cẩn thận,
                          giao hàng nhanh.
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <CustomAlert 
        open={showAlert}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
        title={alertSeverity === 'error' ? 'Lỗi' : 'Thành công'}
        autoHideDuration={alertSeverity === 'error' ? 6000 : 3000}
      />
    </Container>
  );
};

export default ProductDetail; 