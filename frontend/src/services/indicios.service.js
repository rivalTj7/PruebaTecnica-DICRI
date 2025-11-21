import api from './api';

const indiciosService = {
  listarPorExpediente: async (expedienteID) => {
    const response = await api.get(`/indicios/expediente/${expedienteID}`);
    return response.data;
  },

  obtener: async (id) => {
    const response = await api.get(`/indicios/${id}`);
    return response.data;
  },

  crear: async (expedienteID, indicio) => {
    const response = await api.post(`/indicios/expediente/${expedienteID}`, indicio);
    return response.data;
  },

  actualizar: async (id, indicio) => {
    const response = await api.put(`/indicios/${id}`, indicio);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/indicios/${id}`);
    return response.data;
  },
};

export default indiciosService;
