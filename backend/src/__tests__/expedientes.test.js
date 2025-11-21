const request = require('supertest');
const app = require('../index');

describe('Expedientes API', () => {
  let token;
  let expedienteID;

  beforeAll(async () => {
    // Autenticarse como técnico
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tecnico@mp.gob.gt',
        password: 'Password123!',
      });

    token = res.body.data.accessToken;
  });

  describe('POST /api/expedientes', () => {
    it('debería crear un nuevo expediente', async () => {
      const res = await request(app)
        .post('/api/expedientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          numeroExpediente: 'TEST-2024-00001',
          numeroMP: 'MP-TEST-2024-001',
          tituloExpediente: 'Expediente de Prueba',
          descripcion: 'Este es un expediente de prueba',
          lugarIncidente: 'Guatemala, Guatemala',
          fechaIncidente: '2024-01-01',
          prioridad: 'Normal',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('ExpedienteID');

      expedienteID = res.body.data.ExpedienteID;
    });

    it('debería validar campos requeridos', async () => {
      const res = await request(app)
        .post('/api/expedientes')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('debería rechazar número de expediente duplicado', async () => {
      const res = await request(app)
        .post('/api/expedientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          numeroExpediente: 'TEST-2024-00001',
          tituloExpediente: 'Otro Expediente',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/expedientes', () => {
    it('debería listar expedientes', async () => {
      const res = await request(app)
        .get('/api/expedientes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('expedientes');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.expedientes)).toBe(true);
    });

    it('debería filtrar por estado', async () => {
      const res = await request(app)
        .get('/api/expedientes?estadoID=1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('debería soportar paginación', async () => {
      const res = await request(app)
        .get('/api/expedientes?page=1&pageSize=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.pageSize).toBe(10);
    });
  });

  describe('GET /api/expedientes/:id', () => {
    it('debería obtener un expediente por ID', async () => {
      const res = await request(app)
        .get(`/api/expedientes/${expedienteID}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ExpedienteID).toBe(expedienteID);
    });

    it('debería retornar 404 para expediente inexistente', async () => {
      const res = await request(app)
        .get('/api/expedientes/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/expedientes/:id', () => {
    it('debería actualizar un expediente', async () => {
      const res = await request(app)
        .put(`/api/expedientes/${expedienteID}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          numeroMP: 'MP-TEST-2024-001-UPDATED',
          tituloExpediente: 'Expediente de Prueba Actualizado',
          prioridad: 'Alta',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TituloExpediente).toBe('Expediente de Prueba Actualizado');
    });
  });

  describe('Authorization', () => {
    it('debería rechazar acceso sin token', async () => {
      const res = await request(app).get('/api/expedientes');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
