import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu = ({ onClose }: MobileMenuProps) => {
  return (
    <div>
      <ListItem
        button
        component={Link}
        to="/my-orders"
        onClick={onClose}
      >
        <ListItemIcon>
          <ShoppingBag />
        </ListItemIcon>
        <ListItemText primary="Đơn hàng của tôi" />
      </ListItem>
    </div>
  );
};

export default MobileMenu; 