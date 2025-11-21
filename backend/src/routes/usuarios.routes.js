const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { auth } = require('../middleware/auth.middleware');
const {
  listarUsuarios,
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  listarRoles,
  listarCategorias,
  listarEstados,
} = require('../controllers/usuarios.controller');

const router = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rolID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: activo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', auth('Administrador'), listarUsuarios);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCompleto
 *               - email
 *               - password
 *               - rolID
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rolID:
 *                 type: integer
 *               telefono:
 *                 type: string
 *               cargo:
 *                 type: string
 *               departamento:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post(
  '/',
  auth('Administrador'),
  [
    body('nombreCompleto').notEmpty().withMessage('Nombre completo requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rolID').isInt().withMessage('Rol requerido'),
    validate,
  ],
  crearUsuario
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
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
 *         description: Datos del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', auth('Administrador'), obtenerUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
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
 *               - nombreCompleto
 *               - email
 *               - rolID
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put(
  '/:id',
  auth('Administrador'),
  [
    body('nombreCompleto').notEmpty().withMessage('Nombre completo requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('rolID').isInt().withMessage('Rol requerido'),
    validate,
  ],
  actualizarUsuario
);

/**
 * @swagger
 * /api/usuarios/catalogos/roles:
 *   get:
 *     summary: Listar roles disponibles
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get('/catalogos/roles', auth(), listarRoles);

/**
 * @swagger
 * /api/usuarios/catalogos/categorias:
 *   get:
 *     summary: Listar categorías de indicios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/catalogos/categorias', auth(), listarCategorias);

/**
 * @swagger
 * /api/usuarios/catalogos/estados:
 *   get:
 *     summary: Listar estados de expediente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados
 */
router.get('/catalogos/estados', auth(), listarEstados);

module.exports = router;
