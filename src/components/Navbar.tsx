import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const pages = [
    { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { name: 'Items', path: '/items', icon: <InventoryIcon /> }
  ];

  const drawer = (
    <List>
      {pages.map((item) => (
        <ListItem
          button
          key={item.name}
          onClick={() => {
            navigate(item.path);
            if (isMobile) handleDrawerToggle();
          }}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {location.pathname !== '/login' && location.pathname !== '/register' && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AK Store
          </Typography>
          {location.pathname !== '/login' && location.pathname !== '/register' && (
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              position: isMobile ? 'absolute' : 'relative',
              height: isMobile ? '100%' : 'calc(100vh - 64px)',
              marginTop: isMobile ? 0 : '64px',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navbar; 