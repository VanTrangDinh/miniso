import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../contexts/FavoriteContext';

const Favorites: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { favorites } = useFavorites();

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontFamily: '"Playfair Display", serif',
          textAlign: 'center',
        }}
      >
        Sản phẩm yêu thích
      </Typography>

      {favorites.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có sản phẩm yêu thích nào
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard {...product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 