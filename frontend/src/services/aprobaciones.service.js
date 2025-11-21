import api from './api';

const aprobacionesService = {
  listarPendientes: async (params = {}) => {
    const response = await api.get('/aprobaciones/pendientes', { params });
    return response.data;
  },

  aprobar: async (id, comentarios = '') => {
    const response = await api.post(`/aprobaciones/${id}/aprobar`, { comentarios });
    return response.data;
  },

  rechazar: async (id, justificacionRechazo, comentarios = '') => {
    const response = await api.post(`/aprobaciones/${id}/rechazar`, {
      justificacionRechazo,
      comentarios,
    });
    return response.data;
  },

  devolverABorrador: async (id, comentarios = '') => {
    const response = await api.post(`/aprobaciones/${id}/devolver`, { comentarios });
    return response.data;
  },

  obtenerHistorial: async (params = {}) => {
    const response = await api.get('/aprobaciones/historial', { params });
    return response.data;
  },
};

export default aprobacionesService;
