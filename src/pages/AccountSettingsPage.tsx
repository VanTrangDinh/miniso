import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
  Avatar,
  FormControlLabel,
  Switch,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Edit,
  Visibility,
  VisibilityOff,
  LocationOn,
  Add,
  Delete,
  Check,
  Close,
  Save,
  Lock,
  Home,
  Phone,
  Email,
  PhotoCamera,
  CreditCard,
  Notifications
} from '@mui/icons-material';
import { useSnackbar } from '../components/GlobalSnackbarProvider';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ marginTop: '20px' }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// Địa chỉ mẫu
const sampleAddresses = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: true
  },
  {
    id: 2,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    address: '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: false
  }
];

const AccountSettingsPage: React.FC = () => {
  const { user, updateUserInfo, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addresses, setAddresses] = useState(sampleAddresses);
  
  // Sử dụng custom hook thay vì state riêng lẻ
  const { showSuccess, showError } = useSnackbar();

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthday: user?.birthday || '',
    address: user?.address || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    isDefault: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    priceDrops: true
  });

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account/settings' } } });
    }
  }, [isAuthenticated, loading, navigate]);

  // Update profile form data when user state changes
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTogglePassword = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewAddress({
      ...newAddress,
      [e.target.name]: value
    });
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city) {
      showError('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    const newAddressItem = {
      id: Date.now(),
      ...newAddress
    };

    // Nếu địa chỉ mới là mặc định, cập nhật các địa chỉ khác thành không mặc định
    let updatedAddresses = addresses;
    if (newAddress.isDefault) {
      updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }

    setAddresses([...updatedAddresses, newAddressItem]);
    setNewAddress({
      name: '',
      phone: '',
      address: '',
      city: '',
      isDefault: false
    });
    showSuccess('Thêm địa chỉ mới thành công');
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    showSuccess('Đã xóa địa chỉ');
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showSuccess('Đã cập nhật địa chỉ mặc định');
  };

  const handleSavePersonalInfo = () => {
    // Thực tế sẽ gửi API cập nhật thông tin
    showSuccess('Đã cập nhật thông tin cá nhân');
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showError('Vui lòng điền đầy đủ thông tin mật khẩu');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Mật khẩu mới không khớp');
      return;
    }

    // Thực tế sẽ gửi API đổi mật khẩu
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    showSuccess('Đã cập nhật mật khẩu');
  };

  const handleSaveNotifications = () => {
    // Thực tế sẽ gửi API cập nhật cài đặt thông báo
    showSuccess('Đã cập nhật cài đặt thông báo');
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form if canceling edit
      setPersonalInfo({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthday: user?.birthday || '',
        address: user?.address || '',
      });
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }
  
  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Person fontSize="large" /> Cài đặt tài khoản
      </Typography>
      
      <Grid container spacing={4}>
        {/* Sidebar với avatar và tabs trên desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: theme.palette.primary.main
                }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {personalInfo.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {personalInfo.email}
              </Typography>
              <Button
                startIcon={<Edit />}
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Đổi ảnh
              </Button>
            </Paper>

            <Paper sx={{ borderRadius: 2 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    py: 2
                  }
                }}
              >
                <Tab label="Thông tin cá nhân" />
                <Tab label="Địa chỉ giao hàng" />
                <Tab label="Đổi mật khẩu" />
                <Tab label="Cài đặt thông báo" />
              </Tabs>
            </Paper>
          </Grid>
        )}

        {/* Tabs responsive cho mobile */}
        {isMobile && (
          <Grid item xs={12}>
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Thông tin" />
                <Tab label="Địa chỉ" />
                <Tab label="Mật khẩu" />
                <Tab label="Thông báo" />
              </Tabs>
            </Paper>
          </Grid>
        )}

        {/* Tab content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Thông tin cá nhân
                </Typography>
                <Button
                  startIcon={isEditing ? <Save /> : <Edit />}
                  onClick={toggleEditMode}
                  variant={isEditing ? "contained" : "outlined"}
                >
                  {isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
                </Button>
              </Box>
              
              <form onSubmit={handleSavePersonalInfo}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                        readOnly: !isEditing,
                      }}
                      variant={isEditing ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                        readOnly: true, // Email không thể thay đổi
                      }}
                      variant="filled"
                      helperText="Email không thể thay đổi"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                        readOnly: !isEditing,
                      }}
                      variant={isEditing ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      type="date"
                      name="birthday"
                      value={personalInfo.birthday}
                      onChange={handlePersonalInfoChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      InputProps={{
                        startAdornment: <Home sx={{ mr: 1, color: 'text.secondary' }} />,
                        readOnly: !isEditing,
                      }}
                      variant={isEditing ? "outlined" : "filled"}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  {isEditing && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant="outlined" onClick={toggleEditMode}>
                          Hủy
                        </Button>
                        <Button variant="contained" type="submit">
                          Lưu thay đổi
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Địa chỉ giao hàng
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Danh sách địa chỉ */}
              <List sx={{ mb: 4 }}>
                {addresses.map((address) => (
                  <Paper
                    key={address.id}
                    elevation={1}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: address.isDefault ? `1px solid ${theme.palette.primary.main}` : 'none',
                      borderRadius: 2,
                      position: 'relative',
                      '&::before': address.isDefault ? {
                        content: '"Mặc định"',
                        position: 'absolute',
                        top: -10,
                        right: 20,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      } : {}
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {address.name} | {address.phone}
                      </Typography>
                      <Box>
                        {!address.isDefault && (
                          <IconButton
                            size="small"
                            onClick={() => handleSetDefaultAddress(address.id)}
                            color="primary"
                          >
                            <Check fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAddress(address.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {address.address}, {address.city}
                    </Typography>
                  </Paper>
                ))}
              </List>

              {/* Form thêm địa chỉ mới */}
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Thêm địa chỉ mới
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ tên"
                      name="name"
                      value={newAddress.name}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={newAddress.phone}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={newAddress.address}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tỉnh/Thành phố"
                      name="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newAddress.isDefault}
                          onChange={handleNewAddressChange}
                          name="isDefault"
                          color="primary"
                        />
                      }
                      label="Đặt làm địa chỉ mặc định"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAddress}
                    startIcon={<Add />}
                  >
                    Thêm địa chỉ
                  </Button>
                </Box>
              </Paper>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Đổi mật khẩu
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleChangePassword}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    type={passwordVisible.currentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => handleTogglePassword('currentPassword')}>
                          {passwordVisible.currentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    name="newPassword"
                    type={passwordVisible.newPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => handleTogglePassword('newPassword')}>
                          {passwordVisible.newPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type={passwordVisible.confirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => handleTogglePassword('confirmPassword')}>
                          {passwordVisible.confirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    sx={{ alignSelf: 'flex-start', mt: 2 }}
                  >
                    Cập nhật mật khẩu
                  </Button>
                </Stack>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Cài đặt thông báo
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Cập nhật đơn hàng"
                    secondary="Thông báo về trạng thái đơn hàng, giao hàng và hoàn tiền"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notificationSettings.orderUpdates}
                      onChange={handleNotificationChange}
                      name="orderUpdates"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Khuyến mãi"
                    secondary="Thông báo về các chương trình khuyến mãi, giảm giá và mã voucher"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notificationSettings.promotions}
                      onChange={handleNotificationChange}
                      name="promotions"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Sản phẩm mới"
                    secondary="Thông báo khi có sản phẩm mới ra mắt"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notificationSettings.newArrivals}
                      onChange={handleNotificationChange}
                      name="newArrivals"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Giảm giá sản phẩm"
                    secondary="Thông báo khi sản phẩm trong danh sách yêu thích giảm giá"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notificationSettings.priceDrops}
                      onChange={handleNotificationChange}
                      name="priceDrops"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveNotifications}
                >
                  Lưu cài đặt
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountSettingsPage; 