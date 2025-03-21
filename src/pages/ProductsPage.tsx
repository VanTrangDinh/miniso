import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Slider,
  Rating,
  Button,
  Drawer,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Search,
  FilterList,
  Close,
  ExpandMore,
  Star,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
} from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';
import { useFavorites } from '../contexts/FavoriteContext';

// Tạo một số danh mục mẫu
const categories = [
  'Tất cả',
  'Đồ dùng sinh hoạt',
  'Đồ dùng nhà bếp',
  'Làm đẹp & Chăm sóc cá nhân',
  'Phụ kiện thời trang',
  'Văn phòng phẩm',
  'Đồ điện tử',
  'Đồ chơi'
];

// Tạo mẫu kích thước
const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

// Tạo mẫu màu sắc
const colors = [
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Đỏ', value: '#FF0000' },
  { name: 'Xanh dương', value: '#0000FF' },
  { name: 'Xanh lá', value: '#00FF00' },
  { name: 'Vàng', value: '#FFFF00' },
  { name: 'Hồng', value: '#FFC0CB' },
  { name: 'Tím', value: '#800080' },
  { name: 'Cam', value: '#FFA500' },
  { name: 'Xám', value: '#808080' }
];

// Tạo mẫu thương hiệu
const brands = ['MINISO', 'nome', 'MUMUSO', 'ilahui', 'USUPSO', 'YOYOSO', 'DAISO'];

const ProductsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  
  // Lấy giá cao nhất trong danh sách sản phẩm
  const maxPrice = Math.max(...products.map(product => product.price));
  
  useEffect(() => {
    // Khởi tạo khoảng giá từ 0 đến giá cao nhất
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };
  
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearAllFilters = () => {
    setSearchTerm('');
    setCategory('Tất cả');
    setPriceRange([0, maxPrice]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setRatingFilter(null);
  };

  // Lọc sản phẩm dựa trên các điều kiện
  const filteredProducts = products.filter(product => {
    // Lọc theo từ khóa
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Lọc theo danh mục
    if (category !== 'Tất cả' && product.category !== category) {
      return false;
    }
    
    // Lọc theo khoảng giá
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Lọc theo kích thước (nếu có)
    if (selectedSizes.length > 0 && product.sizes) {
      if (!product.sizes.some(size => selectedSizes.includes(size))) {
        return false;
      }
    }
    
    // Lọc theo màu sắc (nếu có)
    if (selectedColors.length > 0 && product.colors) {
      if (!product.colors.some(color => selectedColors.includes(color))) {
        return false;
      }
    }
    
    // Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      const productBrand = 'brand' in product ? product.brand as string : '';
      if (!selectedBrands.includes(productBrand)) {
        return false;
      }
    }
    
    // Lọc theo đánh giá
    if (ratingFilter !== null && (product.rating || 0) < ratingFilter) {
      return false;
    }
    
    return true;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Render bộ lọc cho màn hình máy tính
  const renderDesktopFilters = () => (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Danh mục"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Giá</InputLabel>
          <Select
            value=""
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'under100') setPriceRange([0, 100000]);
              else if (value === '100to200') setPriceRange([100000, 200000]);
              else if (value === '200to500') setPriceRange([200000, 500000]);
              else if (value === 'above500') setPriceRange([500000, maxPrice]);
              else setPriceRange([0, maxPrice]);
            }}
            label="Giá"
          >
            <MenuItem value="">Tất cả mức giá</MenuItem>
            <MenuItem value="under100">Dưới 100.000đ</MenuItem>
            <MenuItem value="100to200">100.000đ - 200.000đ</MenuItem>
            <MenuItem value="200to500">200.000đ - 500.000đ</MenuItem>
            <MenuItem value="above500">Trên 500.000đ</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Thương hiệu</InputLabel>
          <Select
            value={selectedBrands.length === 1 ? selectedBrands[0] : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSelectedBrands([value]);
              } else {
                setSelectedBrands([]);
              }
            }}
            label="Thương hiệu"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand} value={brand}>{brand}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Đánh giá:</Typography>
          <Rating
            value={ratingFilter}
            onChange={(_, newValue) => setRatingFilter(newValue)}
            size="small"
          />
          {ratingFilter !== null && (
            <IconButton size="small" onClick={() => setRatingFilter(null)}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleToggleFilters}
          startIcon={<FilterList />}
          sx={{ ml: 'auto' }}
        >
          {showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'}
        </Button>
      </Box>
      
      {showFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Khoảng giá</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
                  max={maxPrice}
                  step={10000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${formatPrice(value)}đ`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">{formatPrice(priceRange[0])}đ</Typography>
                  <Typography variant="caption">{formatPrice(priceRange[1])}đ</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Kích thước</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sizes.map((size) => (
                  <Chip 
                    key={size}
                    label={size}
                    onClick={() => handleSizeToggle(size)}
                    color={selectedSizes.includes(size) ? 'primary' : 'default'}
                    variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Màu sắc</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {colors.map((color) => (
                  <Chip 
                    key={color.name}
                    label={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    sx={{
                      backgroundColor: selectedColors.includes(color.name) ? 'primary.main' : 'transparent',
                      color: selectedColors.includes(color.name) ? 'white' : 'inherit',
                      borderColor: color.value,
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: color.value,
                        marginRight: '4px',
                        border: color.value === '#FFFFFF' ? '1px solid #ccc' : 'none'
                      }
                    }}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              size="small" 
              onClick={clearAllFilters}
              sx={{ mr: 1 }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );

  // Render bộ lọc cho màn hình điện thoại
  const renderMobileFilterDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleDrawerToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: '85%',
          maxWidth: '360px',
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Bộ lọc</Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Danh mục</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Khoảng giá</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              max={maxPrice}
              step={10000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${formatPrice(value)}đ`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{formatPrice(priceRange[0])}đ</Typography>
              <Typography variant="caption">{formatPrice(priceRange[1])}đ</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Thương hiệu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    size="small"
                  />
                }
                label={brand}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Kích thước</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {sizes.map((size) => (
              <Chip 
                key={size}
                label={size}
                onClick={() => handleSizeToggle(size)}
                color={selectedSizes.includes(size) ? 'primary' : 'default'}
                variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Màu sắc</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {colors.map((color) => (
              <Chip 
                key={color.name}
                label={color.name}
                onClick={() => handleColorToggle(color.name)}
                sx={{
                  backgroundColor: selectedColors.includes(color.name) ? 'primary.main' : 'transparent',
                  color: selectedColors.includes(color.name) ? 'white' : 'inherit',
                  borderColor: color.value,
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: color.value,
                    marginRight: '4px',
                    border: color.value === '#FFFFFF' ? '1px solid #ccc' : 'none'
                  }
                }}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Đánh giá</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Box 
                key={star} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: ratingFilter === star ? 'action.hover' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
              >
                <Rating value={star} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {star} sao trở lên
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={clearAllFilters}
        >
          Xóa tất cả
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleDrawerToggle}
        >
          Áp dụng
        </Button>
      </Box>
    </Drawer>
  );
  
  // Render Mobile Filter Bar
  const renderMobileFilterBar = () => (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 1, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            onClick={handleDrawerToggle}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            <FilterList />
          </Button>
        </Box>
        
        {(category !== 'Tất cả' || selectedBrands.length > 0 || selectedSizes.length > 0 || 
          selectedColors.length > 0 || ratingFilter !== null || 
          priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {category !== 'Tất cả' && (
              <Chip 
                label={`Danh mục: ${category}`} 
                onDelete={() => setCategory('Tất cả')}
                size="small"
              />
            )}
            
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Chip 
                label={`Giá: ${formatPrice(priceRange[0])}đ - ${formatPrice(priceRange[1])}đ`} 
                onDelete={() => setPriceRange([0, maxPrice])}
                size="small"
              />
            )}
            
            {selectedBrands.map(brand => (
              <Chip 
                key={brand}
                label={brand} 
                onDelete={() => handleBrandToggle(brand)}
                size="small"
              />
            ))}
            
            {selectedSizes.map(size => (
              <Chip 
                key={size}
                label={`Size: ${size}`} 
                onDelete={() => handleSizeToggle(size)}
                size="small"
              />
            ))}
            
            {selectedColors.map(color => (
              <Chip 
                key={color}
                label={`Màu: ${color}`} 
                onDelete={() => handleColorToggle(color)}
                size="small"
              />
            ))}
            
            {ratingFilter !== null && (
              <Chip 
                label={`${ratingFilter} sao trở lên`}
                onDelete={() => setRatingFilter(null)}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Sản phẩm
      </Typography>
      
      {/* Thanh tìm kiếm và lọc */}
      {!isMobile ? (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sắp xếp theo"
                    >
                      <MenuItem value="newest">Mới nhất</MenuItem>
                      <MenuItem value="price_asc">Giá tăng dần</MenuItem>
                      <MenuItem value="price_desc">Giá giảm dần</MenuItem>
                      <MenuItem value="name_asc">Tên A-Z</MenuItem>
                      <MenuItem value="name_desc">Tên Z-A</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ) : (
        <>
          {/* Thanh lọc cho mobile đã được xử lý bởi renderMobileFilterBar */}
          {renderMobileFilterBar()}
        </>
      )}
      
      {/* Bộ lọc */}
      {!isMobile && renderDesktopFilters()}
      {isMobile && renderMobileFilterDrawer()}
      
      {/* Hiển thị số lượng kết quả lọc */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị {sortedProducts.length} sản phẩm
          {(category !== 'Tất cả' || selectedBrands.length > 0 || selectedSizes.length > 0 || 
            selectedColors.length > 0 || ratingFilter !== null || searchTerm || 
            priceRange[0] > 0 || priceRange[1] < maxPrice) && ' (đã lọc)'}
        </Typography>
        
        {(category !== 'Tất cả' || selectedBrands.length > 0 || selectedSizes.length > 0 || 
          selectedColors.length > 0 || ratingFilter !== null || searchTerm ||
          priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <Button 
            variant="text" 
            size="small" 
            onClick={clearAllFilters}
            color="secondary"
          >
            Xóa bộ lọc
          </Button>
        )}
      </Box>
      
      {/* Danh sách sản phẩm */}
      {sortedProducts.length > 0 ? (
        <Grid container spacing={2}>
          {sortedProducts.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product.id}>
              <Box sx={{ position: 'relative' }}>
                <ProductCard {...product} viewMode="grid" />
                
                {/* Trái tim yêu thích */}
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                    width: 30,
                    height: 30,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: 0.5
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isFavorite = favorites.some(fav => fav.id === product.id);
                    if (isFavorite) {
                      removeFromFavorites(product.id);
                    } else {
                      addToFavorites(product);
                    }
                  }}
                >
                  {favorites.some(fav => fav.id === product.id) ? (
                    <Favorite fontSize="small" color="error" />
                  ) : (
                    <FavoriteBorder fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy sản phẩm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Không có sản phẩm nào phù hợp với điều kiện lọc của bạn.
          </Typography>
          <Button 
            variant="contained" 
            onClick={clearAllFilters}
            sx={{ mt: 2 }}
          >
            Xóa bộ lọc
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default ProductsPage; 