import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <div>
      {/* Lịch sử đơn hàng -> Đơn hàng của tôi */}
      <MenuItem component={Link} to="/my-orders">
        Đơn hàng của tôi
      </MenuItem>
    </div>
  );
};

export default Navbar; 