const bcrypt = require('bcryptjs');
const { getPool } = require('../config/database');

// Listar usuarios
const listarUsuarios = async (req, res) => {
  try {
    const { rolID, activo } = req.query;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('RolID', rolID ? parseInt(rolID) : null)
      .input('Activo', activo !== undefined ? parseInt(activo) : 1)
      .execute('SP_ListarUsuarios');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en listarUsuarios:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar usuarios',
      },
    });
  }
};

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const {
      nombreCompleto,
      email,
      password,
      rolID,
      telefono,
      cargo,
      departamento,
    } = req.body;

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await getPool();

    const result = await pool
      .request()
      .input('NombreCompleto', nombreCompleto)
      .input('Email', email)
      .input('Password', hashedPassword)
      .input('RolID', rolID)
      .input('Telefono', telefono || null)
      .input('Cargo', cargo || null)
      .input('Departamento', departamento || null)
      .execute('SP_CrearUsuario');

    const usuarioID = result.recordset[0].UsuarioID;

    // Obtener usuario creado (sin password)
    const usuario = await pool
      .request()
      .input('UsuarioID', usuarioID)
      .query(`
        SELECT
          u.UsuarioID, u.NombreCompleto, u.Email, u.RolID,
          u.Telefono, u.Cargo, u.Departamento,
          u.FechaCreacion, u.Activo,
          r.NombreRol
        FROM Usuarios u
        INNER JOIN Roles r ON u.RolID = r.RolID
        WHERE u.UsuarioID = @UsuarioID
      `);

    res.status(201).json({
      success: true,
      data: usuario.recordset[0],
    });
  } catch (error) {
    console.error('Error en crearUsuario:', error);

    if (error.message.includes('UNIQUE') || error.message.includes('duplicate')) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El email ya está registrado',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error al crear usuario',
      },
    });
  }
};

// Obtener usuario por ID
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('UsuarioID', parseInt(id))
      .query(`
        SELECT
          u.UsuarioID, u.NombreCompleto, u.Email, u.RolID,
          u.Telefono, u.Cargo, u.Departamento,
          u.FechaCreacion, u.UltimoAcceso, u.Activo,
          r.NombreRol, r.Descripcion AS DescripcionRol
        FROM Usuarios u
        INNER JOIN Roles r ON u.RolID = r.RolID
        WHERE u.UsuarioID = @UsuarioID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
        },
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error en obtenerUsuario:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener usuario',
      },
    });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombreCompleto,
      email,
      rolID,
      telefono,
      cargo,
      departamento,
      activo,
    } = req.body;

    const pool = await getPool();

    await pool
      .request()
      .input('UsuarioID', parseInt(id))
      .input('NombreCompleto', nombreCompleto)
      .input('Email', email)
      .input('RolID', rolID)
      .input('Telefono', telefono || null)
      .input('Cargo', cargo || null)
      .input('Departamento', departamento || null)
      .input('Activo', activo !== undefined ? activo : 1)
      .query(`
        UPDATE Usuarios
        SET NombreCompleto = @NombreCompleto,
            Email = @Email,
            RolID = @RolID,
            Telefono = @Telefono,
            Cargo = @Cargo,
            Departamento = @Departamento,
            Activo = @Activo
        WHERE UsuarioID = @UsuarioID
      `);

    // Obtener usuario actualizado
    const usuario = await pool
      .request()
      .input('UsuarioID', parseInt(id))
      .query(`
        SELECT
          u.UsuarioID, u.NombreCompleto, u.Email, u.RolID,
          u.Telefono, u.Cargo, u.Departamento,
          u.FechaCreacion, u.Activo,
          r.NombreRol
        FROM Usuarios u
        INNER JOIN Roles r ON u.RolID = r.RolID
        WHERE u.UsuarioID = @UsuarioID
      `);

    res.json({
      success: true,
      data: usuario.recordset[0],
    });
  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar usuario',
      },
    });
  }
};

// Listar roles
const listarRoles = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .query('SELECT * FROM Roles WHERE Activo = 1 ORDER BY NombreRol');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en listarRoles:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar roles',
      },
    });
  }
};

// Listar categorías de indicios
const listarCategorias = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .query('SELECT * FROM CategoriasIndicios WHERE Activo = 1 ORDER BY NombreCategoria');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en listarCategorias:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar categorías',
      },
    });
  }
};

// Listar estados de expediente
const listarEstados = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .query('SELECT * FROM EstadosExpediente WHERE Activo = 1 ORDER BY Orden');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en listarEstados:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar estados',
      },
    });
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  listarRoles,
  listarCategorias,
  listarEstados,
};
