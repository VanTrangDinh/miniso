import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Divider, 
  useTheme, 
  useMediaQuery,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  FacebookOutlined, 
  Instagram, 
  YouTube, 
  Twitter,
  ExpandMore,
} from '@mui/icons-material';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State cho form liên hệ
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  
  // Danh sách các cửa hàng
  const storeLocations = [
    {
      name: 'MINISO Aeon Mall Hà Đông',
      address: 'Tầng 1, AEON Mall Hà Đông, Phường Dương Nội, Hà Đông, Hà Nội',
      phone: '024 6666 7777',
      hours: '09:00 - 22:00'
    },
    {
      name: 'MINISO Vincom Center Bà Triệu',
      address: 'Tầng B1, Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
      phone: '024 8888 9999',
      hours: '10:00 - 22:00'
    },
    {
      name: 'MINISO Times City',
      address: 'Tầng B1, TTTM Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội',
      phone: '024 7777 8888',
      hours: '09:30 - 22:00'
    },
    {
      name: 'MINISO Aeon Mall Tân Phú',
      address: 'Tầng 1, AEON Mall Tân Phú, 30 Bờ Bao Tân Thắng, Quận Tân Phú, TPHCM',
      phone: '028 6666 7777',
      hours: '09:00 - 22:00'
    }
  ];
  
  // Danh sách FAQ
  const faqs = [
    {
      question: 'Chính sách đổi trả sản phẩm của MINISO như thế nào?',
      answer: 'MINISO áp dụng chính sách đổi trả trong vòng 7 ngày kể từ ngày mua hàng. Sản phẩm đổi trả phải còn nguyên tem, nhãn mác và hóa đơn mua hàng. Một số sản phẩm như mỹ phẩm, đồ lót, phụ kiện nhỏ sẽ không được áp dụng đổi trả vì lý do vệ sinh.'
    },
    {
      question: 'MINISO có ship hàng toàn quốc không?',
      answer: 'Có, MINISO cung cấp dịch vụ giao hàng toàn quốc cho các đơn hàng online. Thời gian giao hàng từ 2-5 ngày tùy vào khu vực. Đơn hàng trên 500.000đ sẽ được miễn phí vận chuyển.'
    },
    {
      question: 'Làm thế nào để trở thành thành viên của MINISO?',
      answer: 'Bạn có thể đăng ký thành viên trực tiếp tại cửa hàng MINISO hoặc thông qua ứng dụng MINISO Vietnam. Thành viên sẽ nhận được điểm thưởng cho mỗi lần mua sắm, ưu đãi sinh nhật và các chương trình khuyến mãi đặc biệt.'
    },
    {
      question: 'MINISO có cung cấp dịch vụ quà tặng doanh nghiệp không?',
      answer: 'Có, MINISO cung cấp dịch vụ quà tặng doanh nghiệp với nhiều lựa chọn sản phẩm và mức giá phù hợp. Chúng tôi có thể cung cấp giải pháp quà tặng theo yêu cầu riêng với số lượng lớn. Vui lòng liên hệ phòng kinh doanh để được tư vấn chi tiết.'
    },
    {
      question: 'Sản phẩm MINISO có xuất xứ từ đâu?',
      answer: 'Sản phẩm MINISO được thiết kế và sản xuất tại nhiều quốc gia khác nhau bao gồm Trung Quốc, Nhật Bản, Hàn Quốc và một số nước Đông Nam Á. Mỗi sản phẩm đều được kiểm soát chất lượng nghiêm ngặt theo tiêu chuẩn quốc tế trước khi đến tay người tiêu dùng.'
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi form (trong thực tế sẽ gửi API)
    console.log({ name, email, phone, subject, message });
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    // Hiển thị thông báo thành công
    setAlertOpen(true);
  };
  
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Banner */}
      <Box 
        sx={{ 
          height: isMobile ? '180px' : '250px',
          backgroundImage: 'url(/images/contact-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 2
          }
        }}
      >
        <Typography 
          variant={isMobile ? "h4" : "h2"} 
          color="white" 
          align="center"
          sx={{ 
            fontWeight: 700, 
            position: 'relative',
            zIndex: 1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Liên Hệ Với Chúng Tôi
        </Typography>
      </Box>

      {/* Thông tin liên hệ và Form */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Thông tin liên hệ */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Thông Tin Liên Hệ
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <LocationOn color="primary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Văn phòng chính
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tòa nhà Vinhomes Central Park, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Phone color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Hotline
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1900 1234 (8:00 - 20:00)
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Email color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  support@miniso.vn
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Kết nối với chúng tôi
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <IconButton color="primary" sx={{ backgroundColor: 'action.hover' }}>
                <FacebookOutlined />
              </IconButton>
              <IconButton color="primary" sx={{ backgroundColor: 'action.hover' }}>
                <Instagram />
              </IconButton>
              <IconButton color="primary" sx={{ backgroundColor: 'action.hover' }}>
                <YouTube />
              </IconButton>
              <IconButton color="primary" sx={{ backgroundColor: 'action.hover' }}>
                <Twitter />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        
        {/* Form liên hệ */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Gửi Tin Nhắn Cho Chúng Tôi
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ tên"
                    variant="outlined"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      label="Chủ đề"
                    >
                      <MenuItem value="Thắc mắc sản phẩm">Thắc mắc sản phẩm</MenuItem>
                      <MenuItem value="Góp ý dịch vụ">Góp ý dịch vụ</MenuItem>
                      <MenuItem value="Tư vấn mua hàng">Tư vấn mua hàng</MenuItem>
                      <MenuItem value="Đặt hàng số lượng lớn">Đặt hàng số lượng lớn</MenuItem>
                      <MenuItem value="Hợp tác kinh doanh">Hợp tác kinh doanh</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nội dung"
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    fullWidth={isMobile}
                    sx={{ mt: 2, px: 4 }}
                  >
                    Gửi tin nhắn
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Cửa hàng */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Hệ Thống Cửa Hàng
        </Typography>
        
        <Grid container spacing={3}>
          {storeLocations.map((store, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  {store.name}
                </Typography>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <LocationOn fontSize="small" color="action" sx={{ mr: 1, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    {store.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Phone fontSize="small" color="action" sx={{ mr: 1, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    {store.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Giờ mở cửa:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {store.hours}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button 
            variant="outlined" 
            color="primary"
            endIcon={<ExpandMore />}
          >
            Xem tất cả cửa hàng
          </Button>
        </Box>
      </Box>

      {/* Bản đồ */}
      <Paper elevation={1} sx={{ p: 0, mb: 6, borderRadius: 2, height: 400, overflow: 'hidden' }}>
        <Typography sx={{ p: 2, backgroundColor: 'primary.main', color: 'white', fontWeight: 600 }}>
          Bản đồ cửa hàng
        </Typography>
        <Box 
          component="iframe" 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2891388661406!2d106.7007588759516!3d10.789454489362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cda6db542f%3A0x1499d9c8aa5fc0ac!2sVinhomes%20Central%20Park!5e0!3m2!1sen!2s!4v1689500132661!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Paper>

      {/* FAQs */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Câu Hỏi Thường Gặp
        </Typography>
        
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          {faqs.map((faq, index) => (
            <Accordion key={index} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ 
                  backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
      
      {/* Alert thông báo */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" variant="filled">
          Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 