import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = {
    'Về MINISO': ['Giới thiệu', 'Tin tức', 'Tuyển dụng', 'Hệ thống cửa hàng'],
    'Hỗ trợ khách hàng': ['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Chính sách bảo hành', 'FAQ'],
    'Dịch vụ': ['Chăm sóc khách hàng', 'Thanh toán', 'Vận chuyển', 'Quà tặng'],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontFamily: '"Playfair Display", serif',
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              MINISO
            </Typography>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: isMobile ? '1.2rem' : '1.4rem' }} />
                <Typography variant="body2">
                  123 Đường ABC, Quận XYZ, TP.HCM
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: isMobile ? '1.2rem' : '1.4rem' }} />
                <Typography variant="body2">
                  1900 xxxx
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: isMobile ? '1.2rem' : '1.4rem' }} />
                <Typography variant="body2">
                  support@miniso.vn
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Instagram, Twitter, YouTube].map((Icon, index) => (
                <IconButton
                  key={index}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Icon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={12} sm={6} md={2} key={title}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                {title}
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                }}
              >
                {links.map((link) => (
                  <Box
                    component="li"
                    key={link}
                    sx={{ mb: 1 }}
                  >
                    <Link
                      href="#"
                      underline="hover"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            © {new Date().getFullYear()} MINISO. Tất cả các quyền được bảo lưu.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Cookie'].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 