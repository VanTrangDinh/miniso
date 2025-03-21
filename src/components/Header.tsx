import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Favorite,
  Search,
  Close,
  LocalShipping,
  Receipt,
  Settings,
  Logout,
  ShoppingBag,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const pages = [
  { title: 'Trang chủ', path: '/' },
  { title: 'Sản phẩm', path: '/products' },
  { title: 'Về chúng tôi', path: '/about' },
  { title: 'Liên hệ', path: '/contact' },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state: cartState } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // User menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate('/login');
    }
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const drawer = (
    <List>
      {pages.map((page) => (
        <ListItem
          button
          key={page.title}
          onClick={() => {
            navigate(page.path);
            setMobileMenuOpen(false);
          }}
        >
          <ListItemText primary={page.title} />
        </ListItem>
      ))}
      <Divider />
      {!isAuthenticated ? (
        <>
          <ListItem 
            button 
            onClick={() => {
              navigate('/login');
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <Login fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Đăng nhập" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => {
              navigate('/register');
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Đăng ký" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem 
            button 
            onClick={() => {
              navigate('/account/settings');
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cài đặt tài khoản" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => {
              navigate('/orders');
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <ShoppingBag fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Đơn hàng của tôi" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontFamily: '"Playfair Display", serif',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
          >
            MINISO
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {pages.map((page) => (
                <Button
                  key={page.path}
                  component={Link}
                  to={page.path}
                  sx={{
                    color: 'inherit',
                    display: 'block',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
            <IconButton color="inherit" size={isMobile ? "small" : "medium"}>
              <Search />
            </IconButton>
            
            <IconButton
              color="inherit"
              onClick={() => navigate('/account/favorites')}
              sx={{
                '&:hover': {
                  color: 'error.main',
                },
              }}
            >
              <Badge badgeContent={favorites.length} color="error">
                <Favorite />
              </Badge>
            </IconButton>
            
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <Badge badgeContent={cartState.items.length} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            
            {/* User menu */}
            {isAuthenticated ? (
              <Tooltip title={user?.name || 'Tài khoản'}>
                <IconButton
                  onClick={handleUserClick}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ ml: 0.5 }}
                >
                  {user?.avatar ? (
                    <Avatar 
                      src={user.avatar} 
                      alt={user.name}
                      sx={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36 }}
                    />
                  ) : (
                    <Avatar 
                      sx={{ 
                        width: isMobile ? 32 : 36, 
                        height: isMobile ? 32 : 36,
                        bgcolor: 'primary.main'
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : <Person />}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isMobile && (
                  <Button
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    onClick={() => navigate('/login')}
                    startIcon={<Login />}
                    sx={{ 
                      mr: 1,
                      borderRadius: '4px',
                      textTransform: 'none'
                    }}
                  >
                    Đăng nhập
                  </Button>
                )}
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/register')}
                  size={isMobile ? 'small' : 'medium'}
                >
                  <PersonAdd />
                </IconButton>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: '300px',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ bgcolor: 'primary.main' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" noWrap sx={{ maxWidth: '180px' }}>
                {user.name}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif' }}>
              Menu
            </Typography>
          )}
          <IconButton onClick={handleMobileMenuToggle}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        {drawer}
      </Drawer>

      {/* Menu cho người dùng đã đăng nhập */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 220,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated ? (
          <>
            <MenuItem onClick={() => handleMenuItemClick('/account/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Cài đặt tài khoản
            </MenuItem>
            
            <MenuItem onClick={() => handleMenuItemClick('/account/orders')}>
              <ListItemIcon>
                <ShoppingBag fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đơn hàng của tôi</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Đăng xuất
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleMenuItemClick('/login')}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Đăng nhập
            </MenuItem>
            
            <MenuItem onClick={() => handleMenuItemClick('/register')}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Đăng ký
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header; 