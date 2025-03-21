import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Stack,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  GridView,
  ViewList,
  FilterList,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const CategoryPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const getGridColumns = () => {
    if (isMobile) return 6; // 2 columns
    if (isTablet) return 4; // 3 columns
    return 3; // 4 columns
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator="›" 
          sx={{ 
            mb: 2,
            '& .MuiBreadcrumbs-separator': {
              mx: 1,
              color: 'text.secondary'
            }
          }}
        >
          <Link 
            component={RouterLink} 
            to="/"
            underline="hover"
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem',
              '&:hover': { color: 'primary.main' }
            }}
          >
            Trang chủ
          </Link>
          <Typography 
            color="text.primary"
            sx={{ fontSize: '0.875rem' }}
          >
            New Arrivals
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography 
            variant="h5"
            sx={{ 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            New Arrivals
            <Typography 
              component="span" 
              color="text.secondary"
              sx={{ fontSize: '1rem', fontWeight: 400 }}
            >
              (54 sản phẩm)
            </Typography>
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="standard"
                IconComponent={KeyboardArrowDown}
                sx={{ 
                  minWidth: 120,
                  '& .MuiSelect-select': {
                    py: 0.5,
                    fontSize: '0.875rem'
                  }
                }}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                <MenuItem value="price-desc">Giá giảm dần</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1}>
              <IconButton 
                onClick={() => setViewMode('grid')}
                sx={{ 
                  color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                  p: 1
                }}
              >
                <GridView sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton 
                onClick={() => setViewMode('list')}
                sx={{ 
                  color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                  p: 1
                }}
              >
                <ViewList sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'text.secondary',
                  p: 1
                }}
              >
                <FilterList sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={viewMode === 'list' ? 2 : 0}>
        {products.map((product) => (
          <Grid 
            item 
            xs={6} 
            sm={viewMode === 'list' ? 12 : 6} 
            md={viewMode === 'list' ? 12 : 4} 
            lg={viewMode === 'list' ? 12 : 3} 
            key={product.id}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              images={product.images}
              rating={product.rating}
              reviewCount={product.reviewCount}
              viewMode={viewMode}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryPage; 