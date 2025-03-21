import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Avatar 
} from '@mui/material';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Đội ngũ lãnh đạo giả định
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      position: 'Giám đốc điều hành',
      avatar: '/images/team/avatar1.jpg',
      bio: 'Hơn 15 năm kinh nghiệm trong ngành bán lẻ và quản lý chuỗi cửa hàng quốc tế.'
    },
    {
      name: 'Trần Thị B',
      position: 'Giám đốc sáng tạo',
      avatar: '/images/team/avatar2.jpg',
      bio: 'Chuyên gia thiết kế sản phẩm với nhiều giải thưởng thiết kế trong và ngoài nước.'
    },
    {
      name: 'Lê Văn C',
      position: 'Giám đốc vận hành',
      avatar: '/images/team/avatar3.jpg',
      bio: 'Quản lý chuỗi cung ứng và hệ thống vận hành cho hơn 50 cửa hàng trên toàn quốc.'
    },
    {
      name: 'Phạm Thị D',
      position: 'Giám đốc marketing',
      avatar: '/images/team/avatar4.jpg',
      bio: 'Chiến lược gia marketing với kinh nghiệm phát triển thương hiệu quốc tế tại Việt Nam.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Banner */}
      <Box 
        sx={{ 
          height: isMobile ? '200px' : '300px',
          backgroundImage: 'url(/images/about-banner.jpg)',
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
            backgroundColor: 'rgba(0,0,0,0.4)',
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
          Về MINISO
        </Typography>
      </Box>

      {/* Giới thiệu */}
      <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 600 }}>
          Câu chuyện của chúng tôi
        </Typography>
        <Divider sx={{ mb: 3, width: '80px', margin: '0 auto', borderWidth: 2, borderColor: 'primary.main' }} />
        
        <Typography variant="body1" paragraph>
          MINISO là thương hiệu bán lẻ hàng đầu thế giới, được thành lập vào năm 2013 bởi nhà thiết kế Nhật Bản Miyake Junya và doanh nhân Trung Quốc Ye Guofu. 
          Lấy cảm hứng từ triết lý thiết kế Nhật Bản, MINISO cam kết cung cấp những sản phẩm chất lượng cao với giá cả hợp lý, 
          đáp ứng nhu cầu mua sắm hàng ngày của người tiêu dùng trên toàn thế giới.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Tại Việt Nam, MINISO đã trở thành thương hiệu được yêu thích với hơn 50 cửa hàng trên toàn quốc. 
          Chúng tôi mang đến hàng ngàn sản phẩm đa dạng từ đồ dùng gia đình, văn phòng phẩm, mỹ phẩm, phụ kiện thời trang 
          đến đồ chơi và quà tặng, tất cả đều được thiết kế với sự tinh tế, đơn giản và thân thiện với môi trường.
        </Typography>
      </Paper>

      {/* Giá trị cốt lõi */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600, mb: 3 }}>
          Giá trị cốt lõi
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 8
                }
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Chất lượng
              </Typography>
              <Typography variant="body2">
                Chúng tôi cam kết cung cấp những sản phẩm với chất lượng vượt trội vượt xa mức giá, 
                đáp ứng nhu cầu sử dụng hàng ngày của khách hàng. Mỗi sản phẩm đều trải qua quy trình 
                kiểm định nghiêm ngặt trước khi đến tay người tiêu dùng.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 8
                }
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Thiết kế
              </Typography>
              <Typography variant="body2">
                Thiết kế đơn giản, tinh tế và thân thiện với môi trường là kim chỉ nam trong mọi sản phẩm của MINISO. 
                Chúng tôi tin rằng vẻ đẹp nằm trong sự đơn giản, và những sản phẩm đẹp có thể làm cho cuộc sống 
                hàng ngày trở nên tốt đẹp hơn.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 8
                }
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Sáng tạo
              </Typography>
              <Typography variant="body2">
                MINISO không ngừng đổi mới và sáng tạo, mang đến những sản phẩm mới mẻ và thú vị mỗi tháng. 
                Chúng tôi hợp tác với các nhà thiết kế tài năng và các thương hiệu nổi tiếng trên toàn cầu 
                để tạo ra những dòng sản phẩm độc đáo và phù hợp với xu hướng hiện đại.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Tiêu chí kinh doanh */}
      <Box sx={{ mb: 5, backgroundColor: theme.palette.primary.light, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
          Triết lý kinh doanh
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Tầm nhìn
              </Typography>
              <Typography variant="body2">
                Trở thành thương hiệu bán lẻ hàng đầu, mang đến những sản phẩm chất lượng cao với giá cả hợp lý, 
                nâng cao chất lượng cuộc sống hàng ngày cho mọi người tiêu dùng.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Sứ mệnh
              </Typography>
              <Typography variant="body2">
                Mang đến cho khách hàng những trải nghiệm mua sắm thú vị với các sản phẩm đa dạng, 
                chất lượng và giá cả phải chăng, đồng thời khuyến khích lối sống bền vững và thân thiện với môi trường.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Đội ngũ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600, mb: 3 }}>
          Đội ngũ lãnh đạo
        </Typography>
        
        <Grid container spacing={3}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Avatar 
                  src={member.avatar} 
                  alt={member.name}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    margin: '0 auto 16px',
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary" gutterBottom>
                  {member.position}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {member.bio}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Con số ấn tượng */}
      <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600, mb: 4 }}>
          MINISO trong con số
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                5,000+
              </Typography>
              <Typography variant="body1">
                Cửa hàng trên toàn cầu
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                100+
              </Typography>
              <Typography variant="body1">
                Quốc gia và vùng lãnh thổ
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                50+
              </Typography>
              <Typography variant="body1">
                Cửa hàng tại Việt Nam
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                10,000+
              </Typography>
              <Typography variant="body1">
                Sản phẩm đa dạng
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage; 