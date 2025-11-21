const jwt = require('jsonwebtoken');

// Verificar token JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token no proporcionado',
        },
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        message: 'Token inválido',
      },
    });
  }
};

// Verificar rol de usuario
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No autenticado',
        },
      });
    }

    const userRole = req.user.nombreRol;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tiene permisos para realizar esta acción',
          requiredRoles: allowedRoles,
          userRole: userRole,
        },
      });
    }

    next();
  };
};

// Middleware combinado: autenticación + roles
const auth = (...roles) => {
  if (roles.length === 0) {
    return verifyToken;
  }
  return [verifyToken, checkRole(...roles)];
};

module.exports = {
  verifyToken,
  checkRole,
  auth,
};
