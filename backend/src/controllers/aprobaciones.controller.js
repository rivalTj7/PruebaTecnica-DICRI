const { getPool } = require('../config/database');

// Listar expedientes pendientes de revisión
const listarPendientes = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const pool = await getPool();

    // Listar expedientes en estado "En Revisión" (Estado 2)
    const result = await pool
      .request()
      .input('EstadoID', 2)
      .input('PageNumber', parseInt(page))
      .input('PageSize', parseInt(pageSize))
      .execute('SP_ListarExpedientes');

    const expedientes = result.recordsets[0];
    const totalRegistros = result.recordsets[1][0].TotalRegistros;

    res.json({
      success: true,
      data: {
        expedientes,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalRegistros,
          totalPages: Math.ceil(totalRegistros / parseInt(pageSize)),
        },
      },
    });
  } catch (error) {
    console.error('Error en listarPendientes:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar expedientes pendientes',
      },
    });
  }
};

// Aprobar expediente
const aprobarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;
    const pool = await getPool();

    // Cambiar estado a "Aprobado" (Estado 3)
    await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .input('NuevoEstadoID', 3)
      .input('UsuarioID', req.user.usuarioID)
      .input('Accion', 'Aprobar')
      .input('Comentarios', comentarios || 'Expediente aprobado')
      .execute('SP_CambiarEstadoExpediente');

    // Obtener expediente actualizado
    const expediente = await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .execute('SP_ObtenerExpediente');

    res.json({
      success: true,
      data: {
        message: 'Expediente aprobado correctamente',
        expediente: expediente.recordset[0],
      },
    });
  } catch (error) {
    console.error('Error en aprobarExpediente:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al aprobar expediente',
      },
    });
  }
};

// Rechazar expediente
const rechazarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { justificacionRechazo, comentarios } = req.body;

    if (!justificacionRechazo) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'La justificación del rechazo es requerida',
        },
      });
    }

    const pool = await getPool();

    // Cambiar estado a "Rechazado" (Estado 4)
    await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .input('NuevoEstadoID', 4)
      .input('UsuarioID', req.user.usuarioID)
      .input('Accion', 'Rechazar')
      .input('Comentarios', comentarios || 'Expediente rechazado')
      .input('JustificacionRechazo', justificacionRechazo)
      .execute('SP_CambiarEstadoExpediente');

    // Obtener expediente actualizado
    const expediente = await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .execute('SP_ObtenerExpediente');

    res.json({
      success: true,
      data: {
        message: 'Expediente rechazado correctamente',
        expediente: expediente.recordset[0],
      },
    });
  } catch (error) {
    console.error('Error en rechazarExpediente:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al rechazar expediente',
      },
    });
  }
};

// Obtener historial de aprobaciones
const obtenerHistorial = async (req, res) => {
  try {
    const { expedienteID, fechaInicio, fechaFin } = req.query;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('ExpedienteID', expedienteID ? parseInt(expedienteID) : null)
      .input('FechaInicio', fechaInicio || null)
      .input('FechaFin', fechaFin || null)
      .execute('SP_ObtenerHistorialAprobaciones');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en obtenerHistorial:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener historial de aprobaciones',
      },
    });
  }
};

// Devolver expediente a borrador para correcciones
const devolverABorrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;
    const pool = await getPool();

    // Cambiar estado a "Borrador" (Estado 1)
    await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .input('NuevoEstadoID', 1)
      .input('UsuarioID', req.user.usuarioID)
      .input('Accion', 'Devolver a Borrador')
      .input('Comentarios', comentarios || 'Expediente devuelto para correcciones')
      .execute('SP_CambiarEstadoExpediente');

    // Obtener expediente actualizado
    const expediente = await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .execute('SP_ObtenerExpediente');

    res.json({
      success: true,
      data: {
        message: 'Expediente devuelto a borrador correctamente',
        expediente: expediente.recordset[0],
      },
    });
  } catch (error) {
    console.error('Error en devolverABorrador:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al devolver expediente a borrador',
      },
    });
  }
};

module.exports = {
  listarPendientes,
  aprobarExpediente,
  rechazarExpediente,
  obtenerHistorial,
  devolverABorrador,
};
