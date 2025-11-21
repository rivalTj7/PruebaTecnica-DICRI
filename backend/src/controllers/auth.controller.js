const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await getPool();

    // Obtener usuario
    const result = await pool
      .request()
      .input('Email', email)
      .execute('SP_ObtenerUsuarioPorEmail');

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales inválidas',
        },
      });
    }

    const user = result.recordset[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.Password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales inválidas',
        },
      });
    }

    // Actualizar último acceso
    await pool
      .request()
      .input('UsuarioID', user.UsuarioID)
      .execute('SP_ActualizarUltimoAcceso');

    // Generar tokens
    const accessToken = jwt.sign(
      {
        usuarioID: user.UsuarioID,
        email: user.Email,
        nombreCompleto: user.NombreCompleto,
        rolID: user.RolID,
        nombreRol: user.NombreRol,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const refreshToken = jwt.sign(
      {
        usuarioID: user.UsuarioID,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    // Respuesta (no incluir password)
    delete user.Password;

    res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al iniciar sesión',
      },
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Refresh token requerido',
        },
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const pool = await getPool();

    // Obtener datos actualizados del usuario
    const result = await pool
      .request()
      .input('UsuarioID', decoded.usuarioID)
      .query(`
        SELECT
          u.UsuarioID, u.NombreCompleto, u.Email, u.RolID, u.Activo,
          r.NombreRol
        FROM Usuarios u
        INNER JOIN Roles r ON u.RolID = r.RolID
        WHERE u.UsuarioID = @UsuarioID AND u.Activo = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuario no encontrado o inactivo',
        },
      });
    }

    const user = result.recordset[0];

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      {
        usuarioID: user.UsuarioID,
        email: user.Email,
        nombreCompleto: user.NombreCompleto,
        rolID: user.RolID,
        nombreRol: user.NombreRol,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error('Error en refresh token:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'Token inválido o expirado',
      },
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input('UsuarioID', req.user.usuarioID)
      .query(`
        SELECT
          u.UsuarioID, u.NombreCompleto, u.Email, u.RolID,
          u.Telefono, u.Cargo, u.Departamento,
          u.FechaCreacion, u.UltimoAcceso,
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
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener perfil',
      },
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuarioID = req.user.usuarioID;

    const pool = await getPool();

    // Obtener usuario actual
    const result = await pool
      .request()
      .input('UsuarioID', usuarioID)
      .query('SELECT Password FROM Usuarios WHERE UsuarioID = @UsuarioID');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
        },
      });
    }

    const user = result.recordset[0];

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(currentPassword, user.Password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Contraseña actual incorrecta',
        },
      });
    }

    // Hash de nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await pool
      .request()
      .input('UsuarioID', usuarioID)
      .input('Password', hashedPassword)
      .query('UPDATE Usuarios SET Password = @Password WHERE UsuarioID = @UsuarioID');

    res.json({
      success: true,
      data: {
        message: 'Contraseña actualizada correctamente',
      },
    });
  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al cambiar contraseña',
      },
    });
  }
};

module.exports = {
  login,
  refreshToken,
  getProfile,
  changePassword,
};
