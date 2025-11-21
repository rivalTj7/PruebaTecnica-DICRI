import api from './api';

const reportesService = {
  obtenerDashboard: async () => {
    const response = await api.get('/reportes/dashboard');
    return response.data;
  },

  obtenerEstadisticas: async (params = {}) => {
    const response = await api.get('/reportes/estadisticas', { params });
    return response.data;
  },

  reporteExpedientes: async (params = {}) => {
    const response = await api.get('/reportes/expedientes', { params });
    return response.data;
  },

  reporteProductividad: async (params = {}) => {
    const response = await api.get('/reportes/productividad', { params });
    return response.data;
  },

  reporteTendencias: async (params = {}) => {
    const response = await api.get('/reportes/tendencias', { params });
    return response.data;
  },
};

export default reportesService;
