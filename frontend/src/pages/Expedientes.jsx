import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Grid,
  Fade,
  Stack,
  Divider,
  Tooltip as MuiTooltip,
  Skeleton,
} from '@mui/material';
import {
  Add,
  Visibility,
  Search,
  FilterList,
  Folder,
  CalendarToday,
  ArrowForward,
} from '@mui/icons-material';
import expedientesService from '../services/expedientes.service';
import usuariosService from '../services/usuarios.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [estados, setEstados] = useState([]);
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    loadEstados();
  }, []);

  useEffect(() => {
    loadExpedientes();
  }, [page, rowsPerPage, busqueda, estadoFiltro]);

  const loadEstados = async () => {
    try {
      const response = await usuariosService.listarEstados();
      if (response.success) {
        setEstados(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estados:', error);
    }
  };

  const loadExpedientes = async () => {
    try {
      setLoading(true);
      const response = await expedientesService.listar({
        page: page + 1,
        pageSize: rowsPerPage,
        busqueda,
        estadoID: estadoFiltro || undefined,
      });

      if (response.success) {
        setExpedientes(response.data.expedientes);
        setTotalRegistros(response.data.pagination.totalRegistros);
      }
    } catch (error) {
      console.error('Error al cargar expedientes:', error);
      toast.error('Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
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
                <Folder sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  Expedientes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {totalRegistros} expedientes registrados en el sistema
                </Typography>
              </Box>
            </Stack>
            {hasRole('Técnico', 'Administrador') && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate('/expedientes/nuevo')}
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
                Nuevo Expediente
              </Button>
            )}
          </Stack>
        </Box>
      </Fade>

      {/* Filtros */}
      <Fade in timeout={600}>
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
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Search sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Búsqueda y Filtros
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por número o título del expediente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Filtrar por Estado"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                size="medium"
              >
                <MenuItem value="">
                  <em>Todos los estados</em>
                </MenuItem>
                {estados.map((estado) => (
                  <MenuItem key={estado.EstadoID} value={estado.EstadoID}>
                    {estado.NombreEstado}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Chip
                icon={<FilterList />}
                label={`${totalRegistros} resultados`}
                color="primary"
                variant="outlined"
                sx={{ height: '56px', width: '100%', fontSize: '0.95rem' }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Tabla de Expedientes */}
      <Fade in timeout={800}>
        <Paper elevation={3}>
          {loading ? (
            <Box sx={{ p: 4 }}>
              <Stack spacing={2}>
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                ))}
              </Stack>
            </Box>
          ) : expedientes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Folder sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron expedientes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {busqueda || estadoFiltro
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : hasRole('Técnico', 'Administrador')
                  ? 'Comienza creando tu primer expediente'
                  : 'No hay expedientes disponibles'}
              </Typography>
              {!busqueda && !estadoFiltro && hasRole('Técnico', 'Administrador') && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/expedientes/nuevo')}
                  sx={{
                    background: 'linear-gradient(135deg, #003D82 0%, #336ba3 100%)',
                  }}
                >
                  Crear Primer Expediente
                </Button>
              )}
            </Box>
          ) : (
            <>
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
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight="bold">
                          Indicios
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Fecha Registro
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
                    {expedientes.map((expediente) => (
                      <TableRow
                        key={expediente.ExpedienteID}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 61, 130, 0.04)',
                            cursor: 'pointer',
                          },
                          transition: 'background-color 0.2s',
                        }}
                        onClick={() => navigate(`/expedientes/${expediente.ExpedienteID}`)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color="primary">
                            {expediente.NumeroExpediente}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                            {expediente.TituloExpediente}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {expediente.NombreTecnico}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={expediente.NombreEstado}
                            size="small"
                            sx={{
                              bgcolor: expediente.ColorEstado,
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={expediente.Prioridad}
                            size="small"
                            color={getPrioridadColor(expediente.Prioridad)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={expediente.TotalIndicios || 0}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {expediente.FechaRegistro &&
                                format(new Date(expediente.FechaRegistro), 'dd/MM/yyyy HH:mm', {
                                  locale: es,
                                })}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <MuiTooltip title="Ver detalles del expediente">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/expedientes/${expediente.ExpedienteID}`);
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
              <Divider />
              <TablePagination
                component="div"
                count={totalRegistros}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default Expedientes;
