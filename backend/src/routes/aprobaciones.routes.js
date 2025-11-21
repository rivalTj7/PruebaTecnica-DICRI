const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { auth } = require('../middleware/auth.middleware');
const {
  listarPendientes,
  aprobarExpediente,
  rechazarExpediente,
  obtenerHistorial,
  devolverABorrador,
} = require('../controllers/aprobaciones.controller');

const router = express.Router();

/**
 * @swagger
 * /api/aprobaciones/pendientes:
 *   get:
 *     summary: Listar expedientes pendientes de revisión
 *     tags: [Aprobaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Lista de expedientes pendientes
 */
router.get('/pendientes', auth('Coordinador', 'Administrador'), listarPendientes);

/**
 * @swagger
 * /api/aprobaciones/{id}/aprobar:
 *   post:
 *     summary: Aprobar un expediente
 *     tags: [Aprobaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentarios:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expediente aprobado
 */
router.post('/:id/aprobar', auth('Coordinador', 'Administrador'), aprobarExpediente);

/**
 * @swagger
 * /api/aprobaciones/{id}/rechazar:
 *   post:
 *     summary: Rechazar un expediente
 *     tags: [Aprobaciones]
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
 *               - justificacionRechazo
 *             properties:
 *               justificacionRechazo:
 *                 type: string
 *               comentarios:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expediente rechazado
 *       400:
 *         description: Justificación requerida
 */
router.post(
  '/:id/rechazar',
  auth('Coordinador', 'Administrador'),
  [
    body('justificacionRechazo')
      .notEmpty()
      .withMessage('La justificación del rechazo es requerida'),
    validate,
  ],
  rechazarExpediente
);

/**
 * @swagger
 * /api/aprobaciones/{id}/devolver:
 *   post:
 *     summary: Devolver expediente a borrador para correcciones
 *     tags: [Aprobaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentarios:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expediente devuelto a borrador
 */
router.post('/:id/devolver', auth('Coordinador', 'Administrador'), devolverABorrador);

/**
 * @swagger
 * /api/aprobaciones/historial:
 *   get:
 *     summary: Obtener historial de aprobaciones
 *     tags: [Aprobaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: expedienteID
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
 *     responses:
 *       200:
 *         description: Historial de aprobaciones
 */
router.get('/historial', auth(), obtenerHistorial);

module.exports = router;
