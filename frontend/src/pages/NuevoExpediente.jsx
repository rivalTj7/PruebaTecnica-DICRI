import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Fade,
  Stack,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Save,
  Cancel,
  FolderOpen,
  Description,
  LocationOn,
  CalendarToday,
  Flag,
  Notes,
  Badge,
} from '@mui/icons-material';
import expedientesService from '../services/expedientes.service';
import { toast } from 'react-toastify';

const NuevoExpediente = () => {
  const [formData, setFormData] = useState({
    numeroExpediente: '',
    numeroMP: '',
    tituloExpediente: '',
    descripcion: '',
    lugarIncidente: '',
    fechaIncidente: '',
    prioridad: 'Normal',
    observaciones: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.numeroExpediente.trim()) {
      newErrors.numeroExpediente = 'El número de expediente es requerido';
    }

    if (!formData.tituloExpediente.trim()) {
      newErrors.tituloExpediente = 'El título es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const response = await expedientesService.crear(formData);
      if (response.success) {
        toast.success('¡Expediente creado exitosamente!');
        navigate(`/expedientes/${response.data.ExpedienteID}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Error al crear expediente');
    } finally {
      setLoading(false);
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

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={400}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
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
              <FolderOpen sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Nuevo Expediente
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completa la información para registrar un nuevo expediente DICRI
              </Typography>
            </Box>
          </Stack>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Importante:</strong> Los campos marcados con * son obligatorios.
              El expediente se creará en estado "Borrador" y podrás agregar indicios posteriormente.
            </Typography>
          </Alert>
        </Box>
      </Fade>

      {/* Formulario */}
      <Fade in timeout={600}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 249, 250, 1) 100%)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Información Básica */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Badge sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Información Básica
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Número de Expediente"
                      name="numeroExpediente"
                      value={formData.numeroExpediente}
                      onChange={handleChange}
                      error={!!errors.numeroExpediente}
                      helperText={errors.numeroExpediente || 'Ej: EXP-2024-001'}
                      placeholder="Ingresa el número único del expediente"
                      InputProps={{
                        startAdornment: <Badge sx={{ mr: 1, color: 'primary.main' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Número MP"
                      name="numeroMP"
                      value={formData.numeroMP}
                      onChange={handleChange}
                      helperText="Número asignado por el Ministerio Público"
                      placeholder="Ej: MP-001-2024-12345"
                      InputProps={{
                        startAdornment: <Description sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Título del Expediente"
                      name="tituloExpediente"
                      value={formData.tituloExpediente}
                      onChange={handleChange}
                      error={!!errors.tituloExpediente}
                      helperText={errors.tituloExpediente || 'Título descriptivo del caso'}
                      placeholder="Describe brevemente el caso"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Descripción del Caso */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Description sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Descripción del Caso
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Descripción Detallada"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      helperText="Proporciona una descripción completa del caso y los hechos relevantes"
                      placeholder="Describe los detalles del caso, circunstancias y contexto..."
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Detalles del Incidente */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <LocationOn sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Detalles del Incidente
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Lugar del Incidente"
                      name="lugarIncidente"
                      value={formData.lugarIncidente}
                      onChange={handleChange}
                      helperText="Ubicación donde ocurrió el incidente"
                      placeholder="Ej: Zona 1, Ciudad de Guatemala"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'error.main' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Fecha y Hora del Incidente"
                      name="fechaIncidente"
                      value={formData.fechaIncidente}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      helperText="Fecha estimada del incidente"
                      InputProps={{
                        startAdornment: <CalendarToday sx={{ mr: 1, color: 'info.main' }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Prioridad y Observaciones */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Flag sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Prioridad y Observaciones
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Nivel de Prioridad"
                      name="prioridad"
                      value={formData.prioridad}
                      onChange={handleChange}
                      helperText="Define la urgencia del caso"
                      InputProps={{
                        startAdornment: <Flag sx={{ mr: 1, color: 'warning.main' }} />,
                      }}
                    >
                      <MenuItem value="Baja">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip label="Baja" size="small" color="default" />
                          <Typography variant="body2">Baja prioridad</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="Normal">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip label="Normal" size="small" color="info" />
                          <Typography variant="body2">Prioridad normal</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="Alta">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip label="Alta" size="small" color="warning" />
                          <Typography variant="body2">Alta prioridad</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="Crítica">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip label="Crítica" size="small" color="error" />
                          <Typography variant="body2">Urgente y crítica</Typography>
                        </Stack>
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip
                          label={formData.prioridad}
                          color={getPrioridadColor(formData.prioridad)}
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formData.prioridad === 'Crítica' && 'Requiere atención inmediata'}
                          {formData.prioridad === 'Alta' && 'Debe ser procesado con prioridad'}
                          {formData.prioridad === 'Normal' && 'Procesamiento en tiempo regular'}
                          {formData.prioridad === 'Baja' && 'Puede ser procesado sin urgencia'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observaciones Adicionales"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      helperText="Agrega notas, comentarios o información adicional relevante"
                      placeholder="Observaciones especiales, consideraciones, o notas importantes..."
                      InputProps={{
                        startAdornment: (
                          <Notes sx={{ mr: 1, mt: 1, color: 'text.secondary', alignSelf: 'flex-start' }} />
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Botones de Acción */}
              <Box>
                <Divider sx={{ mb: 3 }} />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Cancel />}
                    onClick={() => navigate('/expedientes')}
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{
                      minWidth: 200,
                      background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #002952 0%, #003D82 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.3)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {loading ? 'Guardando Expediente...' : 'Guardar Expediente'}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};

export default NuevoExpediente;
