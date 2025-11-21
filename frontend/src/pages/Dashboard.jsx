import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip as MuiTooltip,
  Divider,
} from '@mui/material';
import {
  Folder,
  Fingerprint,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  TrendingUp,
  Dashboard as DashboardIcon,
  WavingHand,
  Visibility,
  ArrowForward,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import reportesService from '../services/reportes.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ title, value, icon, gradient, subtitle, delay = 0 }) => (
  <Fade in timeout={600 + delay}>
    <Card
      sx={{
        background: gradient,
        color: 'white',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ zIndex: 1 }}>
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}
              >
                {title}
              </Typography>
              <Typography variant="h2" fontWeight="bold">
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 40 } })}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  </Fade>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await reportesService.obtenerDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const totales = data?.totales || {};
  const recientes = data?.recientes || [];
  const porPrioridad = data?.porPrioridad || [];

  const estadosData = [
    { name: 'Borrador', value: totales.EnBorrador || 0, color: '#9E9E9E' },
    { name: 'En Revisión', value: totales.EnRevision || 0, color: '#2196F3' },
    { name: 'Aprobados', value: totales.Aprobados || 0, color: '#4CAF50' },
    { name: 'Rechazados', value: totales.Rechazados || 0, color: '#F44336' },
  ];

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Crítica':
        return 'error';
      case 'Alta':
        return 'warning';
      case 'Normal':
        return 'info';
      case 'Baja':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPrioridadProgress = (item) => {
    const max = Math.max(...porPrioridad.map((p) => p.Total));
    return (item.Total / max) * 100;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <Box>
      {/* Header con Bienvenida */}
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
              <DashboardIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h3" fontWeight="bold">
                  {getGreeting()}
                </Typography>
                <WavingHand sx={{ fontSize: 32, color: '#FFB300' }} />
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {user?.NombreCompleto} - {user?.NombreRol}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Aquí encontrarás un resumen general del sistema de gestión de evidencias
          </Typography>
        </Box>
      </Fade>

      {/* Estadísticas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expedientes"
            value={totales.TotalExpedientes || 0}
            icon={<Folder />}
            gradient="linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
            subtitle={`${totales.ExpedientesHoy || 0} registrados hoy`}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Indicios"
            value={totales.TotalIndicios || 0}
            icon={<Fingerprint />}
            gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
            subtitle="Evidencias recolectadas"
            delay={100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pendientes Revisión"
            value={totales.EnRevision || 0}
            icon={<HourglassEmpty />}
            gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
            subtitle="Requieren aprobación"
            delay={200}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aprobados"
            value={totales.Aprobados || 0}
            icon={<CheckCircle />}
            gradient="linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)"
            subtitle="Expedientes finalizados"
            delay={300}
          />
        </Grid>
      </Grid>

      {/* Gráficos y Estadísticas */}
      <Grid container spacing={3}>
        {/* Gráfico de Estados */}
        <Grid item xs={12} lg={5}>
          <Fade in timeout={800}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <TrendingUp sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Distribución por Estado
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={estadosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {estadosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Fade>
        </Grid>

        {/* Prioridades */}
        <Grid item xs={12} lg={7}>
          <Fade in timeout={1000}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <TrendingUp sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Expedientes por Prioridad
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                {porPrioridad.map((item, index) => (
                  <Box key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Chip
                          label={item.Prioridad}
                          color={getPrioridadColor(item.Prioridad)}
                          size="small"
                          sx={{ fontWeight: 600, minWidth: 80 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.Total} expedientes
                        </Typography>
                      </Stack>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {getPrioridadProgress(item).toFixed(0)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={getPrioridadProgress(item)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background:
                            item.Prioridad === 'Crítica'
                              ? 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)'
                              : item.Prioridad === 'Alta'
                              ? 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)'
                              : item.Prioridad === 'Normal'
                              ? 'linear-gradient(90deg, #2196f3 0%, #03a9f4 100%)'
                              : 'linear-gradient(90deg, #9e9e9e 0%, #757575 100%)',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Fade>
        </Grid>

        {/* Tabla de Expedientes Recientes */}
        <Grid item xs={12}>
          <Fade in timeout={1200}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Folder sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Expedientes Recientes
                  </Typography>
                </Stack>
                <Chip
                  label={`${recientes.length} registros`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
              <Divider sx={{ mb: 3 }} />
              {recientes.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Número
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Título
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Técnico
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Estado
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Prioridad
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Fecha
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Acción
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recientes.slice(0, 8).map((exp) => (
                        <TableRow
                          key={exp.ExpedienteID}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 61, 130, 0.04)',
                              cursor: 'pointer',
                            },
                            transition: 'background-color 0.2s',
                          }}
                          onClick={() => navigate(`/expedientes/${exp.ExpedienteID}`)}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="600" color="primary">
                              {exp.NumeroExpediente}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                              {exp.TituloExpediente}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {exp.NombreTecnico}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={exp.NombreEstado}
                              size="small"
                              sx={{
                                bgcolor: exp.ColorEstado,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={exp.Prioridad}
                              size="small"
                              color={getPrioridadColor(exp.Prioridad)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {exp.FechaRegistro &&
                                format(new Date(exp.FechaRegistro), 'dd/MM/yyyy HH:mm', {
                                  locale: es,
                                })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <MuiTooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/expedientes/${exp.ExpedienteID}`);
                                }}
                              >
                                <ArrowForward fontSize="small" />
                              </IconButton>
                            </MuiTooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Folder sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay expedientes recientes
                  </Typography>
                </Box>
              )}
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
