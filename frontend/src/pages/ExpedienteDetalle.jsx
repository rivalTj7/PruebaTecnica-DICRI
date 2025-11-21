import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
  Stack,
  Card,
  CardContent,
  Tooltip as MuiTooltip,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack,
  Send,
  Add,
  Edit,
  Delete,
  Folder,
  Fingerprint,
  Person,
  CalendarToday,
  LocationOn,
  Description,
  Flag,
  Badge,
  NavigateNext,
  CheckCircle,
  Schedule,
  Info,
  Palette,
  Place,
} from '@mui/icons-material';
import expedientesService from '../services/expedientes.service';
import indiciosService from '../services/indicios.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const InfoCard = ({ icon, label, value, color = 'primary.main' }) => (
  <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'all 0.2s' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}`,
            display: 'flex',
            alignItems: 'center',
            opacity: 0.9,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 28, color: 'white' } })}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            {label}
          </Typography>
          <Typography variant="body1" fontWeight="600" noWrap>
            {value || 'N/A'}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ExpedienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expediente, setExpediente] = useState(null);
  const [indicios, setIndicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndicio, setOpenIndicio] = useState(false);
  const [nuevoIndicio, setNuevoIndicio] = useState({
    numeroIndicio: '',
    nombreObjeto: '',
    descripcion: '',
    color: '',
    ubicacionHallazgo: '',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [expRes, indRes] = await Promise.all([
        expedientesService.obtener(id),
        indiciosService.listarPorExpediente(id),
      ]);

      if (expRes.success) setExpediente(expRes.data);
      if (indRes.success) setIndicios(indRes.data);
    } catch (error) {
      toast.error('Error al cargar datos del expediente');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarRevision = async () => {
    try {
      await expedientesService.enviarARevision(id);
      toast.success('¡Expediente enviado a revisión exitosamente!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Error al enviar a revisión');
    }
  };

  const handleCrearIndicio = async () => {
    if (!nuevoIndicio.numeroIndicio || !nuevoIndicio.nombreObjeto) {
      toast.warning('Por favor completa los campos requeridos');
      return;
    }

    try {
      await indiciosService.crear(id, nuevoIndicio);
      toast.success('¡Indicio agregado exitosamente!');
      setOpenIndicio(false);
      loadData();
      setNuevoIndicio({
        numeroIndicio: '',
        nombreObjeto: '',
        descripcion: '',
        color: '',
        ubicacionHallazgo: '',
      });
    } catch (error) {
      toast.error('Error al crear indicio');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!expediente) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Folder sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Expediente no encontrado
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/expedientes')}
          sx={{ mt: 2 }}
        >
          Volver a Expedientes
        </Button>
      </Box>
    );
  }

  const esBorrador = expediente.EstadoID === 1;
  const esAdmin = user?.NombreRol === 'Administrador';
  const esTecnicoDueno = expediente.TecnicoRegistraID === user?.UsuarioID;
  const puedeEditar = (esBorrador && esTecnicoDueno) || esAdmin;

  return (
    <Box>
      {/* Breadcrumbs */}
      <Fade in timeout={300}>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/expedientes');
              }}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Folder sx={{ mr: 0.5, fontSize: 20 }} />
              Expedientes
            </Link>
            <Typography color="text.primary" fontWeight="600">
              {expediente.NumeroExpediente}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Fade>

      {/* Header con Acciones */}
      <Fade in timeout={400}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
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
                <Folder sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  {expediente.NumeroExpediente}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
                  {expediente.TituloExpediente}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={expediente.NombreEstado}
                    size="small"
                    sx={{
                      bgcolor: expediente.ColorEstado,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={expediente.Prioridad}
                    size="small"
                    color={getPrioridadColor(expediente.Prioridad)}
                  />
                  <Chip
                    icon={<Fingerprint />}
                    label={`${indicios.length} Indicios`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/expedientes')}
              >
                Volver
              </Button>
              {puedeEditar && (
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleEnviarRevision}
                  disabled={indicios.length === 0}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                    },
                  }}
                >
                  Enviar a Revisión
                </Button>
              )}
            </Stack>
          </Stack>
          {puedeEditar && indicios.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Atención:</strong> Debes agregar al menos un indicio antes de enviar el
                expediente a revisión.
              </Typography>
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Información del Expediente */}
      <Fade in timeout={600}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Info sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Información del Expediente
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {/* Cards de Información */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <InfoCard
                icon={<Badge />}
                label="Número MP"
                value={expediente.NumeroMP}
                color="linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard
                icon={<Person />}
                label="Técnico Asignado"
                value={expediente.NombreTecnico}
                color="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard
                icon={<CalendarToday />}
                label="Fecha de Registro"
                value={
                  expediente.FechaRegistro &&
                  format(new Date(expediente.FechaRegistro), "dd 'de' MMMM, yyyy HH:mm", {
                    locale: es,
                  })
                }
                color="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard
                icon={<CalendarToday />}
                label="Fecha del Incidente"
                value={
                  expediente.FechaIncidente
                    ? format(new Date(expediente.FechaIncidente), "dd 'de' MMMM, yyyy", {
                        locale: es,
                      })
                    : 'No especificada'
                }
                color="linear-gradient(135deg, #F44336 0%, #D32F2F 100%)"
              />
            </Grid>
          </Grid>

          {/* Descripción y Detalles */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Description sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="700" color="text.secondary">
                    DESCRIPCIÓN DEL CASO
                  </Typography>
                </Stack>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {expediente.Descripcion || 'Sin descripción'}
                  </Typography>
                </Paper>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn sx={{ color: 'error.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="700" color="text.secondary">
                    LUGAR DEL INCIDENTE
                  </Typography>
                </Stack>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}
                >
                  <Typography variant="body1">
                    {expediente.LugarIncidente || 'No especificado'}
                  </Typography>
                </Paper>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Description sx={{ color: 'info.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="700" color="text.secondary">
                    OBSERVACIONES
                  </Typography>
                </Stack>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}
                >
                  <Typography variant="body1">
                    {expediente.Observaciones || 'Sin observaciones'}
                  </Typography>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Indicios */}
      <Fade in timeout={800}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Fingerprint sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Indicios Recolectados
              </Typography>
              <Chip label={indicios.length} color="primary" size="small" />
            </Stack>
            {puedeEditar && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenIndicio(true)}
                sx={{
                  background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #002952 0%, #003D82 100%)',
                  },
                }}
              >
                Agregar Indicio
              </Button>
            )}
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {indicios.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Fingerprint sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay indicios registrados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {puedeEditar
                  ? 'Agrega indicios para completar la documentación del expediente'
                  : 'Este expediente aún no tiene indicios registrados'}
              </Typography>
              {puedeEditar && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenIndicio(true)}
                >
                  Agregar Primer Indicio
                </Button>
              )}
            </Box>
          ) : (
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
                        Objeto
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Descripción
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight="bold">
                        Color
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Ubicación del Hallazgo
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {indicios.map((indicio, index) => (
                    <TableRow
                      key={indicio.IndicioID}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 61, 130, 0.04)',
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={indicio.NumeroIndicio}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {indicio.NombreObjeto}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {indicio.Descripcion || 'Sin descripción'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {indicio.Color ? (
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                            <Palette sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">{indicio.Color}</Typography>
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Place sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">
                            {indicio.UbicacionHallazgo || 'No especificada'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Fade>

      {/* Dialog para Agregar Indicio */}
      <Dialog
        open={openIndicio}
        onClose={() => setOpenIndicio(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Fingerprint sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Agregar Nuevo Indicio
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Número de Indicio"
                value={nuevoIndicio.numeroIndicio}
                onChange={(e) =>
                  setNuevoIndicio({ ...nuevoIndicio, numeroIndicio: e.target.value })
                }
                placeholder="Ej: IND-001"
                helperText="Identificador único del indicio"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nombre del Objeto"
                value={nuevoIndicio.nombreObjeto}
                onChange={(e) =>
                  setNuevoIndicio({ ...nuevoIndicio, nombreObjeto: e.target.value })
                }
                placeholder="Ej: Arma blanca"
                helperText="Tipo de objeto encontrado"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción Detallada"
                value={nuevoIndicio.descripcion}
                onChange={(e) =>
                  setNuevoIndicio({ ...nuevoIndicio, descripcion: e.target.value })
                }
                placeholder="Describe las características del indicio..."
                helperText="Detalles físicos y relevantes del objeto"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Color Predominante"
                value={nuevoIndicio.color}
                onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, color: e.target.value })}
                placeholder="Ej: Negro, plateado"
                InputProps={{
                  startAdornment: <Palette sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ubicación del Hallazgo"
                value={nuevoIndicio.ubicacionHallazgo}
                onChange={(e) =>
                  setNuevoIndicio({ ...nuevoIndicio, ubicacionHallazgo: e.target.value })
                }
                placeholder="Ej: Sala principal"
                InputProps={{
                  startAdornment: <Place sx={{ mr: 1, color: 'error.main' }} />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenIndicio(false)} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleCrearIndicio}
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
            }}
          >
            Guardar Indicio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpedienteDetalle;
