import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Divider,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountBalance,
  Security,
  Gavel,
  VerifiedUser,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success('¡Bienvenido al sistema DICRI!');
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.response?.data?.error?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #003D82 0%, #002952 50%, #001633 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 15s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(20px)',
          },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0px 24px 48px rgba(0, 61, 130, 0.2)',
            }}
          >
            {/* Header con Logo */}
            <Slide in direction="down" timeout={600}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                    boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.25)',
                    mb: 3,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.25)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 12px 32px rgba(0, 61, 130, 0.35)',
                      },
                    },
                  }}
                >
                  <AccountBalance sx={{ fontSize: 56, color: 'white' }} />
                </Box>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  gutterBottom
                >
                  DICRI
                </Typography>
                <Typography
                  variant="h6"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Sistema de Gestión de Evidencias
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Ministerio Público de Guatemala
                </Typography>
              </Box>
            </Slide>

            <Divider sx={{ mb: 3 }}>
              <Security sx={{ color: 'primary.main', fontSize: 20 }} />
            </Divider>

            {/* Formulario */}
            <Slide in direction="up" timeout={800}>
              <Box>
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      animation: 'shake 0.5s',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '25%': { transform: 'translateX(-10px)' },
                        '75%': { transform: 'translateX(10px)' },
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    sx={{ mb: 2.5 }}
                    placeholder="usuario@mp.gob.gt"
                  />

                  <TextField
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 3.5 }}
                    placeholder="Ingrese su contraseña"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.75,
                      mb: 3,
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #002952 0%, #003D82 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.3)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {loading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
                  </Button>

                  {/* Features Info */}
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    sx={{ mb: 3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Security sx={{ color: 'success.main', fontSize: 24, mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        Acceso Seguro
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Gavel sx={{ color: 'primary.main', fontSize: 24, mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        Sistema Legal
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <VerifiedUser sx={{ color: 'info.main', fontSize: 24, mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        Certificado
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  {/* Usuarios de prueba */}
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      👤 Usuarios de Prueba
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Técnico:</strong> tecnico@mp.gob.gt / Password123!
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Coordinador:</strong> coordinador@mp.gob.gt / Password123!
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Admin:</strong> admin@mp.gob.gt / Password123!
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Slide>
          </Paper>
        </Fade>

        {/* Footer */}
        <Fade in timeout={1200}>
          <Typography
            variant="caption"
            color="white"
            align="center"
            display="block"
            sx={{
              mt: 3,
              textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            © 2024 Ministerio Público de Guatemala - DICRI
            <br />
            Dirección de Investigación Criminalística
          </Typography>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
