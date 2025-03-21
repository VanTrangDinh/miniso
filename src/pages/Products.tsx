import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Stack,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
  InputAdornment,
  Slider,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Rating,
  Divider,
  Menu,
  Paper,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Search,
  Close,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  FilterList,
  GridView,
  ViewList,
  ViewModule,
  ExpandMore
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { formatPrice } from '../utils/format';

const ITEMS_PER_PAGE = 12;
const PRICE_RANGE = [0, 1000000];

// Sample categories
const categories = [
  'all',
  'men',
  'women',
  'accessories',
  'home',
  'beauty',
  'electronics'
];

// Sample category names for display
const categoryNames: Record<string, string> = {
  'all': 'Tất cả',
  'men': 'Thời trang nam',
  'women': 'Thời trang nữ',
  'accessories': 'Phụ kiện',
  'home': 'Đồ gia dụng',
  'beauty': 'Làm đẹp',
  'electronics': 'Điện tử'
};

// Sample colors
const availableColors = [
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Đỏ', value: '#FF0000' },
  { name: 'Xanh dương', value: '#0000FF' },
  { name: 'Xanh lá', value: '#00FF00' },
  { name: 'Vàng', value: '#FFFF00' },
  { name: 'Hồng', value: '#FFC0CB' },
  { name: 'Tím', value: '#800080' }
];

const Products: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  // State
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [priceRange, setPriceRange] = useState<number[]>(
    searchParams.get('price') ? JSON.parse(searchParams.get('price')!) : PRICE_RANGE
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get('colors') ? JSON.parse(searchParams.get('colors')!) : []
  );
  const [loading, setLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [displayedProducts, setDisplayedProducts] = useState<number>(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesColors =
      selectedColors.length === 0 ||
      (product.colors && selectedColors.some((color) => product.colors.includes(color)));
    return matchesCategory && matchesSearch && matchesPrice && matchesColors;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedProducts < sortedProducts.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayedProducts(prev => prev + ITEMS_PER_PAGE);
          setIsLoadingMore(false);
        }, 1000);
      }
    }, {
      threshold: 0.5,
      rootMargin: '100px 0px',
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, displayedProducts, sortedProducts.length]);

  // Reset displayed products when filters change
  useEffect(() => {
    setDisplayedProducts(ITEMS_PER_PAGE);
  }, [category, sortBy, searchQuery, priceRange, selectedColors]);

  // Get unique colors from products
  const allColors = Array.from(
    new Set(products.flatMap((product) => product.colors || []))
  );

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (searchQuery) params.set('search', searchQuery);
    if (page > 1) params.set('page', page.toString());
    if (priceRange[0] !== PRICE_RANGE[0] || priceRange[1] !== PRICE_RANGE[1]) {
      params.set('price', JSON.stringify(priceRange));
    }
    if (selectedColors.length > 0) {
      params.set('colors', JSON.stringify(selectedColors));
    }
    setSearchParams(params);
  }, [category, sortBy, searchQuery, page, priceRange, selectedColors, setSearchParams]);

  // Handle filter changes
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setPage(1);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
    setPage(1);
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      ...product,
      selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null,
      selectedColor: product.colors && product.colors.length > 0 ? product.colors[0] : null,
      quantity: 1,
    });
    handleCloseQuickView();
  };

  const handleToggleFavorite = (product: any) => {
    if (favorites.some((f) => f.id === product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [category, sortBy, searchQuery, priceRange, selectedColors]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setPriceRange([0, 1000000]);
    setSelectedColors([]);
    setShowFilters(false);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      {/* Search Bar */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={8} md={5}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Danh mục"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {categoryNames[cat] || cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleFilterClick}
              startIcon={<FilterList />}
              size={isMobile ? "small" : "medium"}
            >
              Lọc
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Header with product count and sort */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 2, md: 3 },
          borderBottom: 1,
          borderColor: 'divider',
          pb: { xs: 1, md: 2 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body1"
            color="text.secondary"
          >
            {filteredProducts.length} Sản phẩm
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 150 } }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Sắp xếp"
            >
              <MenuItem value="newest">Mới nhất</MenuItem>
              <MenuItem value="price-asc">Giá tăng dần</MenuItem>
              <MenuItem value="price-desc">Giá giảm dần</MenuItem>
              <MenuItem value="name-asc">Tên A-Z</MenuItem>
              <MenuItem value="name-desc">Tên Z-A</MenuItem>
            </Select>
          </FormControl>

          <Divider orientation="vertical" flexItem sx={{ mx: { xs: 0.5, sm: 1 } }} />

          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton 
              size="small"
              color={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            >
              <ViewModule />
            </IconButton>
            <IconButton 
              size="small"
              color={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              <ViewList />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: { xs: '90vw', sm: 400 },
            maxHeight: { xs: '80vh', sm: 'calc(100vh - 96px)' },
            p: 3,
            borderRadius: 2
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>Bộ lọc nâng cao</Typography>
        {/* Price Range Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Khoảng giá
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={PRICE_RANGE[0]}
            max={PRICE_RANGE[1]}
            step={50000}
            valueLabelFormat={(value) => `${formatPrice(value)}đ`}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">
              {formatPrice(priceRange[0])}đ
            </Typography>
            <Typography variant="body2">
              {formatPrice(priceRange[1])}đ
            </Typography>
          </Box>
        </Box>

        {/* Color Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Màu sắc
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {availableColors.map((color) => (
              <Chip
                key={color.name}
                label={color.name}
                onClick={() => handleColorToggle(color.name)}
                color={selectedColors.includes(color.name) ? 'primary' : 'default'}
                variant={selectedColors.includes(color.name) ? 'filled' : 'outlined'}
                sx={{ 
                  mb: 1,
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color.value,
                    marginRight: '4px',
                    border: color.value === '#FFFFFF' ? '1px solid #ccc' : 'none'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearAllFilters}
          >
            Xóa bộ lọc
          </Button>
          <Button
            variant="contained"
            onClick={handleFilterClose}
          >
            Áp dụng
          </Button>
        </Box>
      </Menu>

      {/* Applied filters display */}
      {(category !== 'all' || selectedColors.length > 0 || 
        priceRange[0] > PRICE_RANGE[0] || priceRange[1] < PRICE_RANGE[1] || searchQuery) && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {category !== 'all' && (
            <Chip 
              label={`Danh mục: ${categoryNames[category] || category}`} 
              onDelete={() => setCategory('all')}
              size="small"
            />
          )}
          
          {(priceRange[0] > PRICE_RANGE[0] || priceRange[1] < PRICE_RANGE[1]) && (
            <Chip 
              label={`Giá: ${formatPrice(priceRange[0])}đ - ${formatPrice(priceRange[1])}đ`} 
              onDelete={() => setPriceRange(PRICE_RANGE)}
              size="small"
            />
          )}
          
          {selectedColors.map(color => (
            <Chip 
              key={color}
              label={`Màu: ${color}`} 
              onDelete={() => handleColorToggle(color)}
              size="small"
            />
          ))}
          
          {searchQuery && (
            <Chip 
              label={`Tìm kiếm: ${searchQuery}`}
              onDelete={() => setSearchQuery('')}
              size="small"
            />
          )}
        </Box>
      )}

      {/* Products grid */}
      <Grid 
        container 
        spacing={2}
        columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
      >
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          sortedProducts.slice(0, displayedProducts).map((product, index) => (
            <Grid 
              item 
              xs={6}
              sm={viewMode === 'list' ? 12 : 4} 
              md={viewMode === 'list' ? 12 : 4} 
              lg={viewMode === 'list' ? 12 : 3} 
              key={product.id}
              ref={index === displayedProducts - 1 ? lastProductRef : undefined}
            >
              <Box sx={{ height: '100%' }}>
                <ProductCard
                  {...product}
                  onQuickView={() => handleQuickView(product)}
                  viewMode={viewMode}
                />
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 2, md: 4 } }}>
          <CircularProgress size={isMobile ? 20 : 24} />
        </Box>
      )}

      {/* No results message */}
      {filteredProducts.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy sản phẩm nào phù hợp
          </Typography>
          <Button 
            variant="contained" 
            onClick={clearAllFilters}
            sx={{ mt: 2 }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      )}

      {/* Quick View Dialog */}
      <Dialog
        open={!!quickViewProduct}
        onClose={handleCloseQuickView}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            maxHeight: { xs: '95vh', sm: 'auto' }
          }
        }}
      >
        {quickViewProduct && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{quickViewProduct.name}</Typography>
                <IconButton onClick={handleCloseQuickView} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>
                    {quickViewProduct.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={quickViewProduct.rating || 0} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({quickViewProduct.reviewCount || 0} đánh giá)
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatPrice(quickViewProduct.price)}đ
                    {quickViewProduct.originalPrice && (
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through', ml: 1 }}
                      >
                        {formatPrice(quickViewProduct.originalPrice)}đ
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {quickViewProduct.description || 'Không có mô tả sản phẩm.'}
                  </Typography>
                  
                  {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Màu sắc:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        {quickViewProduct.colors.map((color: string) => (
                          <Chip
                            key={color}
                            label={color}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </>
                  )}
                  
                  {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Kích thước:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        {quickViewProduct.sizes.map((size: string) => (
                          <Chip
                            key={size}
                            label={size}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleToggleFavorite(quickViewProduct)}
                startIcon={
                  favorites.some((f) => f.id === quickViewProduct.id) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )
                }
              >
                {favorites.some((f) => f.id === quickViewProduct.id)
                  ? 'Đã yêu thích'
                  : 'Yêu thích'}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAddToCart(quickViewProduct)}
                startIcon={<ShoppingCart />}
              >
                Thêm vào giỏ hàng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && !isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            siblingCount={isMobile ? 0 : 1}
          />
        </Box>
      )}
    </Container>
  );
};

export default Products; 