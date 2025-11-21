import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Avatar,
  Fade,
  Stack,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person,
  Lock,
  Email,
  Phone,
  Work,
  Business,
  Visibility,
  VisibilityOff,
  Save,
  Badge as BadgeIcon,
  Shield,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth.service';
import { toast } from 'react-toastify';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
      {React.cloneElement(icon, { sx: { fontSize: 18, color: 'primary.main' } })}
      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
        {label}
      </Typography>
    </Stack>
    <Typography variant="body1" fontWeight="500" sx={{ pl: 3.5 }}>
      {value || 'No especificado'}
    </Typography>
  </Box>
);

const Perfil = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleCancelPassword = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('¡Contraseña actualizada exitosamente!');
      handleCancelPassword(); // Resetea todos los campos y estados
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'Administrador':
        return 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)';
      case 'Coordinador':
        return 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
      case 'Técnico':
        return 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
      default:
        return 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={400}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0px 4px 12px rgba(0, 61, 130, 0.2)',
              }}
            >
              <Person sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Mi Perfil
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Información personal y configuración de seguridad
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {/* Columna Izquierda - Card de Usuario */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={600}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: getRolColor(user?.NombreRol),
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    background: 'white',
                    color: 'primary.main',
                    fontSize: 48,
                    fontWeight: 'bold',
                    border: '4px solid white',
                    boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.2)',
                  }}
                >
                  {getInitials(user?.NombreCompleto)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {user?.NombreCompleto}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                  <Card
                    sx={{
                      background: getRolColor(user?.NombreRol),
                      color: 'white',
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Shield sx={{ fontSize: 18 }} />
                      <Typography variant="body2" fontWeight="600">
                        {user?.NombreRol}
                      </Typography>
                    </Stack>
                  </Card>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {user?.Email}
                </Typography>

                <Alert
                  severity="info"
                  sx={{
                    textAlign: 'left',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  <Typography variant="caption">
                    <strong>Cuenta verificada</strong>
                    <br />
                    Usuario activo desde {new Date().getFullYear()}
                  </Typography>
                </Alert>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Columna Derecha - Información y Cambio de Contraseña */}
        <Grid item xs={12} md={8}>
          {/* Información Personal */}
          <Fade in timeout={800}>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <BadgeIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Información Personal
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    icon={<Person />}
                    label="Nombre Completo"
                    value={user?.NombreCompleto}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow icon={<Email />} label="Correo Electrónico" value={user?.Email} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    icon={<Shield />}
                    label="Rol en el Sistema"
                    value={user?.NombreRol}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    icon={<Phone />}
                    label="Teléfono"
                    value={user?.Telefono || 'No especificado'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow icon={<Work />} label="Cargo" value={user?.Cargo || 'No especificado'} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    icon={<Business />}
                    label="Departamento"
                    value={user?.Departamento || 'No especificado'}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Cambiar Contraseña */}
          <Fade in timeout={1000}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 249, 250, 1) 100%)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Lock sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Cambiar Contraseña
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Actualiza tu contraseña para mantener tu cuenta segura
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleChangePassword}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type={showPasswords.current ? 'text' : 'password'}
                      label="Contraseña Actual *"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                      placeholder="Ingresa tu contraseña actual"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  current: !showPasswords.current,
                                })
                              }
                              edge="end"
                            >
                              {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type={showPasswords.new ? 'text' : 'password'}
                      label="Nueva Contraseña *"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                      placeholder="Mínimo 6 caracteres"
                      helperText="Usa una contraseña fuerte y única"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'success.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                              }
                              edge="end"
                            >
                              {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type={showPasswords.confirm ? 'text' : 'password'}
                      label="Confirmar Contraseña *"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                      placeholder="Repite la nueva contraseña"
                      error={
                        passwordData.confirmPassword !== '' &&
                        passwordData.newPassword !== passwordData.confirmPassword
                      }
                      helperText={
                        passwordData.confirmPassword !== '' &&
                        passwordData.newPassword !== passwordData.confirmPassword
                          ? 'Las contraseñas no coinciden'
                          : 'Debe coincidir con la nueva contraseña'
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock
                              sx={{
                                color:
                                  passwordData.confirmPassword !== '' &&
                                  passwordData.newPassword === passwordData.confirmPassword
                                    ? 'success.main'
                                    : 'text.secondary',
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  confirm: !showPasswords.confirm,
                                })
                              }
                              edge="end"
                            >
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2">
                        <strong>Importante:</strong> Al cambiar tu contraseña, se cerrarán todas las
                        sesiones activas excepto la actual por seguridad.
                      </Typography>
                    </Alert>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleCancelPassword}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={
                          loading ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          passwordData.newPassword !== passwordData.confirmPassword
                        }
                        sx={{
                          background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #002952 0%, #003D82 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.3)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Perfil;
