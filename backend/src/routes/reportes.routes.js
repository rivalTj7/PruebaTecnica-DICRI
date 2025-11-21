const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const {
  obtenerEstadisticas,
  reporteExpedientes,
  obtenerDashboard,
  reporteProductividad,
  reporteTendencias,
} = require('../controllers/reportes.controller');

const router = express.Router();

/**
 * @swagger
 * /api/reportes/dashboard:
 *   get:
 *     summary: Obtener datos del dashboard principal
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard
 */
router.get('/dashboard', auth(), obtenerDashboard);

/**
 * @swagger
 * /api/reportes/estadisticas:
 *   get:
 *     summary: Obtener estadísticas generales
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Estadísticas generales
 */
router.get('/estadisticas', auth(), obtenerEstadisticas);

/**
 * @swagger
 * /api/reportes/expedientes:
 *   get:
 *     summary: Generar reporte de expedientes con filtros
 *     tags: [Reportes]
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
 *         name: coordinadorID
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
 *         name: prioridad
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte de expedientes
 */
router.get('/expedientes', auth(), reporteExpedientes);

/**
 * @swagger
 * /api/reportes/productividad:
 *   get:
 *     summary: Reporte de productividad por técnico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Reporte de productividad
 */
router.get('/productividad', auth('Coordinador', 'Administrador'), reporteProductividad);

/**
 * @swagger
 * /api/reportes/tendencias:
 *   get:
 *     summary: Reporte de tendencias por mes
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de tendencias
 */
router.get('/tendencias', auth(), reporteTendencias);

module.exports = router;
