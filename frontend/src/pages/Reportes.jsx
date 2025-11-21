import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Assessment,
  Person,
  CalendarToday,
  CheckCircle,
  Cancel,
  Warning,
} from '@mui/icons-material';
import reportesService from '../services/reportes.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Reportes = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [productividad, setProductividad] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  // Verificar si el usuario puede ver reportes de productividad
  const canViewProductivity = hasRole('Coordinador', 'Administrador');

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    setLoading(true);
    try {
      const promises = [
        reportesService.obtenerEstadisticas({ fechaInicio, fechaFin }),
        reportesService.reporteTendencias(),
      ];

      // Solo cargar productividad si tiene permisos
      if (canViewProductivity) {
        promises.push(reportesService.reporteProductividad({ fechaInicio, fechaFin }));
      }

      const results = await Promise.allSettled(promises);

      // Estadísticas (índice 0)
      if (results[0].status === 'fulfilled' && results[0].value.success) {
        setEstadisticas(results[0].value.data);
      }

      // Tendencias (índice 1)
      if (results[1].status === 'fulfilled' && results[1].value.success) {
        setTendencias(results[1].value.data);
      }

      // Productividad (índice 2, solo si tiene permisos)
      if (canViewProductivity && results[2]) {
        if (results[2].status === 'fulfilled' && results[2].value.success) {
          setProductividad(results[2].value.data);
        }
      }

      toast.success('Reportes cargados correctamente');
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      toast.error('Error al cargar algunos reportes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight="bold">
              Reportes y Estadísticas
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Análisis detallado de expedientes e indicios del sistema
          </Typography>
        </Box>

        {/* Filtros de Fecha */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, rgba(0, 61, 130, 0.02) 0%, rgba(0, 61, 130, 0.05) 100%)',
            borderLeft: '4px solid',
            borderColor: 'primary.main',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <CalendarToday sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Filtros de Búsqueda
            </Typography>
          </Stack>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="medium"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="medium"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={loadReportes}
                size="large"
                startIcon={<TrendingUp />}
                sx={{ height: '56px' }}
              >
                Generar Reporte
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Estadísticas Generales */}
        {estadisticas && (
          <Fade in timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                📊 Resumen General
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Total Expedientes
                          </Typography>
                          <Typography variant="h3" fontWeight="bold">
                            {estadisticas.TotalExpedientes || 0}
                          </Typography>
                        </Box>
                        <Assessment sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Aprobados
                          </Typography>
                          <Typography variant="h3" fontWeight="bold">
                            {estadisticas.Aprobados || 0}
                          </Typography>
                        </Box>
                        <CheckCircle sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Rechazados
                          </Typography>
                          <Typography variant="h3" fontWeight="bold">
                            {estadisticas.Rechazados || 0}
                          </Typography>
                        </Box>
                        <Cancel sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            En Revisión
                          </Typography>
                          <Typography variant="h3" fontWeight="bold">
                            {estadisticas.EnRevision || 0}
                          </Typography>
                        </Box>
                        <Warning sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Gráficos */}
        <Grid container spacing={3}>
          {/* Tendencias Mensuales */}
          <Grid item xs={12} lg={canViewProductivity ? 6 : 12}>
            <Fade in timeout={1000}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <TrendingUp sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Tendencias Mensuales
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                {tendencias && tendencias.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={tendencias}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="NombreMes"
                        tick={{ fill: '#666' }}
                        style={{ fontSize: '0.875rem' }}
                      />
                      <YAxis tick={{ fill: '#666' }} style={{ fontSize: '0.875rem' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Line
                        type="monotone"
                        dataKey="TotalExpedientes"
                        stroke="#2196F3"
                        strokeWidth={3}
                        name="Total Expedientes"
                        dot={{ fill: '#2196F3', r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Aprobados"
                        stroke="#4CAF50"
                        strokeWidth={3}
                        name="Aprobados"
                        dot={{ fill: '#4CAF50', r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Rechazados"
                        stroke="#F44336"
                        strokeWidth={3}
                        name="Rechazados"
                        dot={{ fill: '#F44336', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay datos de tendencias disponibles
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>

          {/* Productividad por Técnico (Solo Coordinadores/Admin) */}
          {canViewProductivity && (
            <Grid item xs={12} lg={6}>
              <Fade in timeout={1200}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Person sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Productividad por Técnico
                      </Typography>
                    </Stack>
                    <Chip
                      label="Admin/Coordinador"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  {productividad && productividad.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Técnico
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2" fontWeight="bold">
                                Total
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2" fontWeight="bold">
                                Aprobados
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2" fontWeight="bold">
                                Rechazados
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productividad.slice(0, 10).map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 61, 130, 0.04)',
                                },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight="500">
                                  {item.NombreCompleto}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={item.TotalExpedientes}
                                  size="small"
                                  color="info"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={item.Aprobados}
                                  size="small"
                                  color="success"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={item.Rechazados}
                                  size="small"
                                  color="error"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="body2" color="text.secondary">
                        No hay datos de productividad disponibles
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Fade>
            </Grid>
          )}
        </Grid>

        {/* Mensaje informativo para técnicos */}
        {!canViewProductivity && (
          <Fade in timeout={1400}>
            <Alert
              severity="info"
              icon={<Person />}
              sx={{ mt: 3, borderRadius: 2 }}
            >
              <Typography variant="body2">
                <strong>Información:</strong> Como técnico, tienes acceso a estadísticas
                generales. Los reportes de productividad están disponibles para
                Coordinadores y Administradores.
              </Typography>
            </Alert>
          </Fade>
        )}
      </Box>
    </Fade>
  );
};

export default Reportes;
