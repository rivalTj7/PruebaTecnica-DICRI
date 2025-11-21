import api from './api';

const usuariosService = {
  listar: async (params = {}) => {
    const response = await api.get('/usuarios', { params });
    return response.data;
  },

  obtener: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  crear: async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  actualizar: async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  listarRoles: async () => {
    const response = await api.get('/usuarios/catalogos/roles');
    return response.data;
  },

  listarCategorias: async () => {
    const response = await api.get('/usuarios/catalogos/categorias');
    return response.data;
  },

  listarEstados: async () => {
    const response = await api.get('/usuarios/catalogos/estados');
    return response.data;
  },
};

export default usuariosService;
