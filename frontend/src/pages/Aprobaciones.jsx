import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Fade,
  Stack,
  Divider,
  Alert,
  Card,
  CardContent,
  Grid,
  Tooltip as MuiTooltip,
  Skeleton,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Assessment,
  HourglassEmpty,
  Warning,
  CheckCircleOutline,
  CancelOutlined,
  ArrowForward,
  Fingerprint,
  CalendarToday,
} from '@mui/icons-material';
import aprobacionesService from '../services/aprobaciones.service';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ title, value, icon, gradient, subtitle }) => (
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
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
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
);

const Aprobaciones = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accion, setAccion] = useState('');
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const [justificacion, setJustificacion] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadExpedientes();
  }, []);

  const loadExpedientes = async () => {
    try {
      const response = await aprobacionesService.listarPendientes();
      if (response.success) {
        setExpedientes(response.data.expedientes);
      }
    } catch (error) {
      toast.error('Error al cargar expedientes pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (exp, accion) => {
    setExpedienteSeleccionado(exp);
    setAccion(accion);
    setDialogOpen(true);
    setJustificacion('');
    setComentarios('');
  };

  const handleAccion = async () => {
    if (accion === 'rechazar' && !justificacion.trim()) {
      toast.warning('La justificación es obligatoria para rechazar un expediente');
      return;
    }

    setSubmitting(true);
    try {
      if (accion === 'aprobar') {
        await aprobacionesService.aprobar(expedienteSeleccionado.ExpedienteID, comentarios);
        toast.success('¡Expediente aprobado exitosamente!');
      } else {
        await aprobacionesService.rechazar(
          expedienteSeleccionado.ExpedienteID,
          justificacion,
          comentarios
        );
        toast.success('Expediente rechazado correctamente');
      }
      setDialogOpen(false);
      loadExpedientes();
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || 'Error al procesar la solicitud'
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={80} sx={{ mb: 3, borderRadius: 2 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  const totalPendientes = expedientes.length;
  const prioridadCritica = expedientes.filter((e) => e.Prioridad === 'Crítica').length;
  const prioridadAlta = expedientes.filter((e) => e.Prioridad === 'Alta').length;

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
              <Assessment sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Aprobaciones
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestión de expedientes pendientes de revisión y aprobación
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Fade>

      {/* Estadísticas */}
      <Fade in timeout={600}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Pendientes de Revisión"
              value={totalPendientes}
              icon={<HourglassEmpty />}
              gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
              subtitle="Expedientes en espera"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Prioridad Crítica"
              value={prioridadCritica}
              icon={<Warning />}
              gradient="linear-gradient(135deg, #F44336 0%, #D32F2F 100%)"
              subtitle="Requieren atención urgente"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Prioridad Alta"
              value={prioridadAlta}
              icon={<Warning />}
              gradient="linear-gradient(135deg, #FF5722 0%, #E64A19 100%)"
              subtitle="Revisar con prontitud"
            />
          </Grid>
        </Grid>
      </Fade>

      {/* Tabla de Expedientes Pendientes */}
      <Fade in timeout={800}>
        <Paper elevation={3}>
          {expedientes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay expedientes pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Todos los expedientes han sido procesados
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <HourglassEmpty sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Expedientes Pendientes
                    </Typography>
                    <Chip label={totalPendientes} color="primary" size="small" />
                  </Stack>
                </Stack>
                <Divider />
              </Box>
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
                          Prioridad
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight="bold">
                          Indicios
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Fecha Envío
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight="bold">
                          Acciones
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expedientes.map((exp) => (
                      <TableRow
                        key={exp.ExpedienteID}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 61, 130, 0.04)',
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color="primary">
                            {exp.NumeroExpediente}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
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
                            label={exp.Prioridad}
                            size="small"
                            color={getPrioridadColor(exp.Prioridad)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                            justifyContent="center"
                          >
                            <Fingerprint sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="body2" fontWeight="600">
                              {exp.TotalIndicios || 0}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {exp.FechaRevision &&
                                format(new Date(exp.FechaRevision), 'dd/MM/yyyy HH:mm', {
                                  locale: es,
                                })}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <MuiTooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/expedientes/${exp.ExpedienteID}`)}
                              >
                                <ArrowForward fontSize="small" />
                              </IconButton>
                            </MuiTooltip>
                            <MuiTooltip title="Aprobar expediente">
                              <IconButton
                                size="small"
                                sx={{
                                  color: 'success.main',
                                  '&:hover': {
                                    backgroundColor: 'success.light',
                                    color: 'success.dark',
                                  },
                                }}
                                onClick={() => handleOpenDialog(exp, 'aprobar')}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </MuiTooltip>
                            <MuiTooltip title="Rechazar expediente">
                              <IconButton
                                size="small"
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'error.dark',
                                  },
                                }}
                                onClick={() => handleOpenDialog(exp, 'rechazar')}
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </MuiTooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Fade>

      {/* Dialog de Aprobación/Rechazo */}
      <Dialog
        open={dialogOpen}
        onClose={() => !submitting && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            {accion === 'aprobar' ? (
              <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
            ) : (
              <Cancel sx={{ color: 'error.main', fontSize: 28 }} />
            )}
            <Typography variant="h6" fontWeight="bold">
              {accion === 'aprobar' ? 'Aprobar Expediente' : 'Rechazar Expediente'}
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Alert
            severity={accion === 'aprobar' ? 'success' : 'warning'}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="body2">
              <strong>Expediente:</strong> {expedienteSeleccionado?.NumeroExpediente}
              <br />
              <strong>Título:</strong> {expedienteSeleccionado?.TituloExpediente}
            </Typography>
          </Alert>

          {accion === 'rechazar' && (
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Justificación del Rechazo *"
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              placeholder="Explica detalladamente las razones del rechazo..."
              required
              error={!justificacion.trim()}
              helperText={
                !justificacion.trim()
                  ? 'La justificación es obligatoria para rechazar'
                  : 'Proporciona una explicación clara y detallada'
              }
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comentarios Adicionales"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Agrega comentarios o recomendaciones (opcional)..."
            helperText="Comentarios que serán visibles para el técnico"
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleAccion}
            variant="contained"
            color={accion === 'aprobar' ? 'success' : 'error'}
            disabled={submitting || (accion === 'rechazar' && !justificacion.trim())}
            startIcon={
              accion === 'aprobar' ? <CheckCircleOutline /> : <CancelOutlined />
            }
          >
            {submitting
              ? 'Procesando...'
              : accion === 'aprobar'
              ? 'Confirmar Aprobación'
              : 'Confirmar Rechazo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Aprobaciones;
