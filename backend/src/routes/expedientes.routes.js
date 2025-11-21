const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { auth } = require('../middleware/auth.middleware');
const {
  crearExpediente,
  listarExpedientes,
  obtenerExpediente,
  actualizarExpediente,
  eliminarExpediente,
  enviarARevision,
} = require('../controllers/expedientes.controller');

const router = express.Router();

/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     summary: Crear un nuevo expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroExpediente
 *               - tituloExpediente
 *             properties:
 *               numeroExpediente:
 *                 type: string
 *               numeroMP:
 *                 type: string
 *               tituloExpediente:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               lugarIncidente:
 *                 type: string
 *               fechaIncidente:
 *                 type: string
 *                 format: date-time
 *               prioridad:
 *                 type: string
 *                 enum: [Baja, Normal, Alta, Crítica]
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Expediente creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 */
router.post(
  '/',
  auth('Técnico', 'Administrador'),
  [
    body('numeroExpediente').notEmpty().withMessage('Número de expediente requerido'),
    body('tituloExpediente').notEmpty().withMessage('Título requerido'),
    validate,
  ],
  crearExpediente
);

/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     summary: Listar expedientes con filtros
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estadoID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tecnicoID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de expedientes
 */
router.get('/', auth(), listarExpedientes);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   get:
 *     summary: Obtener expediente por ID
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del expediente
 *       404:
 *         description: Expediente no encontrado
 */
router.get('/:id', auth(), obtenerExpediente);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   put:
 *     summary: Actualizar expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tituloExpediente
 *     responses:
 *       200:
 *         description: Expediente actualizado
 *       404:
 *         description: Expediente no encontrado
 */
router.put(
  '/:id',
  auth('Técnico', 'Administrador'),
  [
    body('tituloExpediente').notEmpty().withMessage('Título requerido'),
    validate,
  ],
  actualizarExpediente
);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   delete:
 *     summary: Eliminar expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expediente eliminado
 *       404:
 *         description: Expediente no encontrado
 */
router.delete('/:id', auth('Administrador'), eliminarExpediente);

/**
 * @swagger
 * /api/expedientes/{id}/enviar-revision:
 *   post:
 *     summary: Enviar expediente a revisión
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expediente enviado a revisión
 *       400:
 *         description: El expediente debe tener al menos un indicio
 */
router.post('/:id/enviar-revision', auth('Técnico', 'Administrador'), enviarARevision);

module.exports = router;
