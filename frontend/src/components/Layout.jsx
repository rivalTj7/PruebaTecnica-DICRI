import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;
const drawerWidthCollapsed = 75;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: null,
    },
    {
      text: 'Expedientes',
      icon: <FolderIcon />,
      path: '/expedientes',
      roles: null,
    },
    {
      text: 'Aprobaciones',
      icon: <CheckCircleIcon />,
      path: '/aprobaciones',
      roles: ['Coordinador', 'Administrador'],
    },
    {
      text: 'Reportes',
      icon: <AssessmentIcon />,
      path: '/reportes',
      roles: null,
    },
  ];

  const drawer = (collapsed) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header modernizado con gradiente */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: collapsed ? 3 : 4,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        {!collapsed ? (
          <>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                },
              }}
            >
              <Box
                component="img"
                src="/assets/images/MP_logo.png"
                alt="Logo Ministerio Público"
                sx={{
                  width: 70,
                  height: 'auto',
                  display: 'block',
                }}
              />
            </Box>
            <Typography variant="h5" fontWeight="bold" letterSpacing={1}>
              DICRI
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.5 }}>
              Gestión de Evidencias
            </Typography>
            <Chip
              label={user?.NombreRol}
              size="small"
              sx={{
                mt: 1.5,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Box
              component="img"
              src="/assets/images/MP_logo.png"
              alt="Logo MP"
              sx={{
                width: 40,
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        )}
      </Box>

      <Divider />

      {/* Menu items modernizados */}
      <List sx={{ px: collapsed ? 1 : 2, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          if (item.roles && !hasRole(...item.roles)) {
            return null;
          }

          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.text : ''} placement="right" arrow>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: collapsed ? 2 : 2.5,
                    mb: 0.5,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    py: 1.5,
                    ...(isActive
                      ? {
                          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`,
                          color: 'white',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                          transform: 'translateX(4px)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: '0 4px 4px 0',
                          },
                        }
                      : {
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'translateX(4px)',
                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                        }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : theme.palette.primary.main,
                      minWidth: collapsed ? 'auto' : 48,
                      justifyContent: 'center',
                      fontSize: 24,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Footer del sidebar */}
      {!collapsed && (
        <>
          <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />
          <Box
            sx={{
              p: 2.5,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`,
              borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.light, 0.08)} 0%, transparent 70%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Typography variant="caption" color="primary.main" display="block" fontWeight={700}>
              © 2025 DICRI
            </Typography>
            <Typography variant="caption" color="text.primary" display="block" sx={{ mt: 0.5 }} fontWeight={500}>
              Ministerio Público
            </Typography>
            <Divider sx={{ my: 1.5, borderColor: alpha(theme.palette.primary.main, 0.15) }} />
            <Typography variant="caption" color="text.primary" display="block" fontWeight={500}>
              Desarrollado por
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{
                mt: 0.5,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '0.8rem',
              }}
            >
              Rivaldo Alexander Tojín
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontSize: '0.65rem' }}>
              Todos los derechos reservados
            </Typography>
            <Chip
              label="v1.0.0"
              size="small"
              sx={{
                mt: 1.5,
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                color: 'white',
                boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );

  const currentDrawerWidth = sidebarOpen ? drawerWidth : drawerWidthCollapsed;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          color: 'text.primary',
          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          backdropFilter: 'blur(12px)',
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 1,
              display: { sm: 'none' },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Tooltip title={sidebarOpen ? 'Contraer menú' : 'Expandir menú'} arrow>
            <IconButton
              color="primary"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{
                mr: 1,
                display: { xs: 'none', sm: 'flex' },
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
              }}
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', md: 'block' },
              }}
            >
              Ministerio Público de Guatemala
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', md: 'block' },
              }}
            >
              División de Investigación Criminal
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                textAlign: 'right',
                display: { xs: 'none', sm: 'block' },
                pr: 1.5,
                borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {user?.NombreCompleto}
              </Typography>
              <Chip
                label={user?.NombreRol}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mt: 0.5,
                }}
              />
            </Box>
            <Tooltip title="Menú de usuario" arrow>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s',
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    fontWeight: 700,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {user?.NombreCompleto?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                {user?.NombreCompleto}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.NombreRol}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/perfil');
              }}
              sx={{
                py: 1.5,
                gap: 1.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Mi Perfil"
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                gap: 1.5,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar Sesión"
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.3s',
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer(false)}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              transition: 'width 0.3s',
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer(!sidebarOpen)}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>

        {/* Footer modernizado */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: 4,
            px: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 50%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            borderTop: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: `0 -4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at bottom right, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 60%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3,
                mb: 2,
              }}
            >
              {/* Info del sistema */}
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      display: 'flex',
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 24, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    DICRI
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ mt: 1 }}>
                  División de Investigación Criminal
                </Typography>
                <Typography variant="body2" color="primary.main" fontWeight={600}>
                  Ministerio Público de Guatemala
                </Typography>
              </Box>

              {/* Info del desarrollador */}
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'right' },
                  px: { xs: 0, md: 3 },
                  borderLeft: { xs: 'none', md: `2px solid ${alpha(theme.palette.primary.main, 0.2)}` },
                }}
              >
                <Typography variant="body2" color="text.primary" display="block" fontWeight={500}>
                  Desarrollado por
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Rivaldo Alexander Tojín
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  © 2025 - Todos los derechos reservados
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: alpha(theme.palette.primary.main, 0.15) }} />

            {/* Barra inferior */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                Sistema de Gestión de Evidencias - DICRI
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label="v1.0.0"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    color: 'white',
                    boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                />
                <Typography variant="body2" color="primary.main" fontWeight={600}>
                  {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
