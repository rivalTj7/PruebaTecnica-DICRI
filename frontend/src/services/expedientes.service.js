import api from './api';

const expedientesService = {
  listar: async (params = {}) => {
    const response = await api.get('/expedientes', { params });
    return response.data;
  },

  obtener: async (id) => {
    const response = await api.get(`/expedientes/${id}`);
    return response.data;
  },

  crear: async (expediente) => {
    const response = await api.post('/expedientes', expediente);
    return response.data;
  },

  actualizar: async (id, expediente) => {
    const response = await api.put(`/expedientes/${id}`, expediente);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/expedientes/${id}`);
    return response.data;
  },

  enviarARevision: async (id) => {
    const response = await api.post(`/expedientes/${id}/enviar-revision`);
    return response.data;
  },
};

export default expedientesService;
