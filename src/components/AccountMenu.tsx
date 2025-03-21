import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';

const AccountMenu = () => {
  const handleClose = (path: string) => {
    // Implement the logic to close the menu and navigate to the specified path
  };

  return (
    <>
      <MenuItem onClick={() => handleClose('/my-orders')}>
        <ListItemIcon>
          <ShoppingBag fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Đơn hàng của tôi" />
      </MenuItem>
    </>
  );
};

export default AccountMenu; 