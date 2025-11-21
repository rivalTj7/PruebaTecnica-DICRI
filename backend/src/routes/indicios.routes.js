const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { auth } = require('../middleware/auth.middleware');
const {
  crearIndicio,
  listarIndicios,
  obtenerIndicio,
  actualizarIndicio,
  eliminarIndicio,
} = require('../controllers/indicios.controller');

const router = express.Router();

/**
 * @swagger
 * /api/indicios/expediente/{expedienteID}:
 *   post:
 *     summary: Crear un nuevo indicio en un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expedienteID
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
 *               - numeroIndicio
 *               - nombreObjeto
 *             properties:
 *               numeroIndicio:
 *                 type: string
 *               categoriaID:
 *                 type: integer
 *               nombreObjeto:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               tamanoAlto:
 *                 type: number
 *               tamanoAncho:
 *                 type: number
 *               tamanoLargo:
 *                 type: number
 *               peso:
 *                 type: number
 *               ubicacionHallazgo:
 *                 type: string
 *               latitudGPS:
 *                 type: number
 *               longitudGPS:
 *                 type: number
 *               estadoConservacion:
 *                 type: string
 *               fechaRecoleccion:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Indicio creado
 */
router.post(
  '/expediente/:expedienteID',
  auth('Técnico', 'Administrador'),
  [
    body('numeroIndicio').notEmpty().withMessage('Número de indicio requerido'),
    body('nombreObjeto').notEmpty().withMessage('Nombre del objeto requerido'),
    validate,
  ],
  crearIndicio
);

/**
 * @swagger
 * /api/indicios/expediente/{expedienteID}:
 *   get:
 *     summary: Listar indicios de un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expedienteID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de indicios
 */
router.get('/expediente/:expedienteID', auth(), listarIndicios);

/**
 * @swagger
 * /api/indicios/{id}:
 *   get:
 *     summary: Obtener indicio por ID
 *     tags: [Indicios]
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
 *         description: Datos del indicio
 *       404:
 *         description: Indicio no encontrado
 */
router.get('/:id', auth(), obtenerIndicio);

/**
 * @swagger
 * /api/indicios/{id}:
 *   put:
 *     summary: Actualizar indicio
 *     tags: [Indicios]
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
 *               - numeroIndicio
 *               - nombreObjeto
 *     responses:
 *       200:
 *         description: Indicio actualizado
 */
router.put(
  '/:id',
  auth('Técnico', 'Administrador'),
  [
    body('numeroIndicio').notEmpty().withMessage('Número de indicio requerido'),
    body('nombreObjeto').notEmpty().withMessage('Nombre del objeto requerido'),
    validate,
  ],
  actualizarIndicio
);

/**
 * @swagger
 * /api/indicios/{id}:
 *   delete:
 *     summary: Eliminar indicio
 *     tags: [Indicios]
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
 *         description: Indicio eliminado
 */
router.delete('/:id', auth('Técnico', 'Administrador'), eliminarIndicio);

module.exports = router;
