const { getPool, sql } = require('../config/database');

// Crear expediente
const crearExpediente = async (req, res) => {
  try {
    const {
      numeroExpediente,
      numeroMP,
      tituloExpediente,
      descripcion,
      lugarIncidente,
      fechaIncidente,
      prioridad,
      observaciones,
    } = req.body;

    const tecnicoRegistraID = req.user.usuarioID;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('NumeroExpediente', sql.NVarChar(50), numeroExpediente)
      .input('NumeroMP', sql.NVarChar(50), numeroMP || null)
      .input('TituloExpediente', sql.NVarChar(255), tituloExpediente)
      .input('Descripcion', sql.NVarChar(sql.MAX), descripcion || null)
      .input('LugarIncidente', sql.NVarChar(255), lugarIncidente || null)
      .input('FechaIncidente', sql.DateTime, fechaIncidente ? new Date(fechaIncidente) : null)
      .input('TecnicoRegistraID', sql.Int, tecnicoRegistraID)
      .input('EstadoID', sql.Int, 1) // Borrador
      .input('Prioridad', sql.NVarChar(20), prioridad || 'Normal')
      .input('Observaciones', sql.NVarChar(sql.MAX), observaciones || null)
      .execute('SP_CrearExpediente');

    const expedienteID = result.recordset[0].ExpedienteID;

    // Obtener el expediente completo
    const expediente = await pool
      .request()
      .input('ExpedienteID', sql.Int, expedienteID)
      .execute('SP_ObtenerExpediente');

    res.status(201).json({
      success: true,
      data: expediente.recordset[0],
    });
  } catch (error) {
    console.error('Error en crearExpediente:', error);

    if (error.message.includes('UNIQUE') || error.number === 2627) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El número de expediente ya existe',
        },
      });
    }

    // En desarrollo, mostrar el error completo
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error.message
      : 'Error al crear expediente';

    res.status(500).json({
      success: false,
      error: {
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
    });
  }
};

// Listar expedientes
const listarExpedientes = async (req, res) => {
  try {
    const {
      estadoID,
      tecnicoID,
      coordinadorID,
      fechaInicio,
      fechaFin,
      prioridad,
      busqueda,
      page = 1,
      pageSize = 20,
    } = req.query;

    const pool = await getPool();

    const result = await pool
      .request()
      .input('EstadoID', estadoID ? parseInt(estadoID) : null)
      .input('TecnicoID', tecnicoID ? parseInt(tecnicoID) : null)
      .input('CoordinadorID', coordinadorID ? parseInt(coordinadorID) : null)
      .input('FechaInicio', fechaInicio || null)
      .input('FechaFin', fechaFin || null)
      .input('Prioridad', prioridad || null)
      .input('BusquedaTexto', busqueda || null)
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
    console.error('Error en listarExpedientes:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar expedientes',
      },
    });
  }
};

// Obtener expediente por ID
const obtenerExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .execute('SP_ObtenerExpediente');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expediente no encontrado',
        },
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error en obtenerExpediente:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener expediente',
      },
    });
  }
};

// Actualizar expediente
const actualizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numeroMP,
      tituloExpediente,
      descripcion,
      lugarIncidente,
      fechaIncidente,
      prioridad,
      observaciones,
    } = req.body;

    const usuarioModificacion = req.user.usuarioID;
    const pool = await getPool();

    // Verificar que el expediente existe y obtener su información
    const expedienteExistente = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    if (!expedienteExistente.recordset || expedienteExistente.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expediente no encontrado',
        },
      });
    }

    const expediente = expedienteExistente.recordset[0];

    // Validación de permisos según rol
    const esAdmin = req.user.nombreRol === 'Administrador';
    const esTecnicoDueno = expediente.TecnicoRegistraID === usuarioModificacion;
    const esBorrador = expediente.EstadoID === 1;

    // Solo el técnico dueño puede editar SU expediente en Borrador, o Administrador puede editar cualquiera
    if (!esAdmin && (!esTecnicoDueno || !esBorrador)) {
      return res.status(403).json({
        success: false,
        error: {
          message: esTecnicoDueno
            ? 'Solo puedes editar expedientes en estado Borrador'
            : 'No tienes permiso para editar este expediente',
          estado: expediente.NombreEstado,
        },
      });
    }

    const result = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .input('NumeroMP', sql.NVarChar(50), numeroMP || null)
      .input('TituloExpediente', sql.NVarChar(255), tituloExpediente)
      .input('Descripcion', sql.NVarChar(sql.MAX), descripcion || null)
      .input('LugarIncidente', sql.NVarChar(255), lugarIncidente || null)
      .input('FechaIncidente', sql.DateTime, fechaIncidente ? new Date(fechaIncidente) : null)
      .input('Prioridad', sql.NVarChar(20), prioridad || 'Normal')
      .input('Observaciones', sql.NVarChar(sql.MAX), observaciones || null)
      .input('UsuarioModificacion', sql.Int, usuarioModificacion)
      .execute('SP_ActualizarExpediente');

    if (result.recordset[0].FilasAfectadas === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expediente no encontrado',
        },
      });
    }

    // Obtener expediente actualizado
    const expediente_updated = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    res.json({
      success: true,
      data: expediente_updated.recordset[0],
    });
  } catch (error) {
    console.error('Error en actualizarExpediente:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar expediente',
      },
    });
  }
};

// Eliminar expediente
const eliminarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('ExpedienteID', parseInt(id))
      .execute('SP_EliminarExpediente');

    if (result.recordset[0].FilasAfectadas === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expediente no encontrado',
        },
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Expediente eliminado correctamente',
      },
    });
  } catch (error) {
    console.error('Error en eliminarExpediente:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al eliminar expediente',
      },
    });
  }
};

// Enviar expediente a revisión
const enviarARevision = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    // Verificar que el expediente existe
    const expedienteExistente = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    if (!expedienteExistente.recordset || expedienteExistente.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expediente no encontrado',
        },
      });
    }

    const expediente = expedienteExistente.recordset[0];

    // Validación de permisos: solo el técnico dueño o Admin puede enviar a revisión
    const esAdmin = req.user.nombreRol === 'Administrador';
    const esTecnicoDueno = expediente.TecnicoRegistraID === req.user.usuarioID;

    if (!esAdmin && !esTecnicoDueno) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Solo puedes enviar a revisión tus propios expedientes',
        },
      });
    }

    // Validación de estado: solo se puede enviar desde Borrador
    if (expediente.EstadoID !== 1) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Solo se pueden enviar a revisión expedientes en estado Borrador',
          estadoActual: expediente.NombreEstado,
        },
      });
    }

    // Verificar que tenga al menos un indicio
    const indicios = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ListarIndiciosPorExpediente');

    if (indicios.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El expediente debe tener al menos un indicio registrado',
        },
      });
    }

    // Cambiar estado a "En Revisión" (Estado 2)
    await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .input('NuevoEstadoID', sql.Int, 2)
      .input('UsuarioID', sql.Int, req.user.usuarioID)
      .input('Accion', sql.NVarChar(50), 'Enviar a Revisión')
      .input('Comentarios', sql.NVarChar(sql.MAX), 'Expediente enviado a revisión por el técnico')
      .execute('SP_CambiarEstadoExpediente');

    // Obtener expediente actualizado
    const expediente_updated = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    res.json({
      success: true,
      data: expediente_updated.recordset[0],
    });
  } catch (error) {
    console.error('Error en enviarARevision:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al enviar expediente a revisión',
      },
    });
  }
};

module.exports = {
  crearExpediente,
  listarExpedientes,
  obtenerExpediente,
  actualizarExpediente,
  eliminarExpediente,
  enviarARevision,
};
