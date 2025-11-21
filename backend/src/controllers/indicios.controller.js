const { getPool, sql } = require('../config/database');

// Helper function to verify expediente ownership and status
const verificarPermisoExpediente = async (pool, expedienteID, usuarioID, nombreRol) => {
  const expedienteExistente = await pool
    .request()
    .input('ExpedienteID', sql.Int, parseInt(expedienteID))
    .execute('SP_ObtenerExpediente');

  if (!expedienteExistente.recordset || expedienteExistente.recordset.length === 0) {
    return { error: 'Expediente no encontrado', status: 404 };
  }

  const expediente = expedienteExistente.recordset[0];
  const esAdmin = nombreRol === 'Administrador';
  const esTecnicoDueno = expediente.TecnicoRegistraID === usuarioID;

  if (!esAdmin && !esTecnicoDueno) {
    return { error: 'No tienes permiso para modificar indicios en este expediente', status: 403 };
  }

  if (expediente.EstadoID !== 1) {
    return {
      error: 'Solo se pueden modificar indicios en expedientes en estado Borrador',
      status: 400,
      estadoActual: expediente.NombreEstado,
    };
  }

  return { expediente };
};

// Crear indicio
const crearIndicio = async (req, res) => {
  try {
    const { expedienteID } = req.params;
    const {
      numeroIndicio,
      categoriaID,
      nombreObjeto,
      descripcion,
      color,
      tamanoAlto,
      tamanoAncho,
      tamanoLargo,
      unidadMedida,
      peso,
      unidadPeso,
      ubicacionHallazgo,
      latitudGPS,
      longitudGPS,
      estadoConservacion,
      fechaRecoleccion,
      rutaFotografia,
      observaciones,
    } = req.body;

    const tecnicoRegistraID = req.user.usuarioID;
    const pool = await getPool();

    // Verificar permisos
    const permiso = await verificarPermisoExpediente(
      pool,
      expedienteID,
      tecnicoRegistraID,
      req.user.nombreRol
    );

    if (permiso.error) {
      return res.status(permiso.status).json({
        success: false,
        error: {
          message: permiso.error,
          estadoActual: permiso.estadoActual,
        },
      });
    }

    const result = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(expedienteID))
      .input('NumeroIndicio', sql.NVarChar(50), numeroIndicio)
      .input('CategoriaID', sql.Int, categoriaID || null)
      .input('NombreObjeto', sql.NVarChar(255), nombreObjeto)
      .input('Descripcion', sql.NVarChar(sql.MAX), descripcion || null)
      .input('Color', sql.NVarChar(50), color || null)
      .input('TamanoAlto', sql.Decimal(10, 2), tamanoAlto || null)
      .input('TamanoAncho', sql.Decimal(10, 2), tamanoAncho || null)
      .input('TamanoLargo', sql.Decimal(10, 2), tamanoLargo || null)
      .input('UnidadMedida', sql.NVarChar(10), unidadMedida || 'cm')
      .input('Peso', sql.Decimal(10, 2), peso || null)
      .input('UnidadPeso', sql.NVarChar(10), unidadPeso || 'g')
      .input('UbicacionHallazgo', sql.NVarChar(255), ubicacionHallazgo || null)
      .input('LatitudGPS', sql.Decimal(9, 6), latitudGPS || null)
      .input('LongitudGPS', sql.Decimal(9, 6), longitudGPS || null)
      .input('EstadoConservacion', sql.NVarChar(50), estadoConservacion || null)
      .input('FechaRecoleccion', sql.DateTime, fechaRecoleccion ? new Date(fechaRecoleccion) : null)
      .input('TecnicoRegistraID', sql.Int, tecnicoRegistraID)
      .input('RutaFotografia', sql.NVarChar(500), rutaFotografia || null)
      .input('Observaciones', sql.NVarChar(sql.MAX), observaciones || null)
      .execute('SP_CrearIndicio');

    const indicioID = result.recordset[0].IndicioID;

    // Obtener el indicio completo
    const indicio = await pool
      .request()
      .input('IndicioID', sql.Int, indicioID)
      .execute('SP_ObtenerIndicio');

    res.status(201).json({
      success: true,
      data: indicio.recordset[0],
    });
  } catch (error) {
    console.error('Error en crearIndicio:', error);

    if (error.message.includes('UNIQUE') || error.message.includes('UQ_NumeroIndicio') || error.number === 2627) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El número de indicio ya existe en este expediente',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error al crear indicio',
      },
    });
  }
};

// Listar indicios por expediente
const listarIndicios = async (req, res) => {
  try {
    const { expedienteID } = req.params;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(expedienteID))
      .execute('SP_ListarIndiciosPorExpediente');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en listarIndicios:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al listar indicios',
      },
    });
  }
};

// Obtener indicio por ID
const obtenerIndicio = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('IndicioID', sql.Int, parseInt(id))
      .execute('SP_ObtenerIndicio');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Indicio no encontrado',
        },
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error en obtenerIndicio:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener indicio',
      },
    });
  }
};

// Actualizar indicio
const actualizarIndicio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numeroIndicio,
      categoriaID,
      nombreObjeto,
      descripcion,
      color,
      tamanoAlto,
      tamanoAncho,
      tamanoLargo,
      peso,
      ubicacionHallazgo,
      latitudGPS,
      longitudGPS,
      estadoConservacion,
      fechaRecoleccion,
      rutaFotografia,
      observaciones,
    } = req.body;

    const pool = await getPool();

    // Primero obtener el indicio para saber a qué expediente pertenece
    const indicioExistente = await pool
      .request()
      .input('IndicioID', sql.Int, parseInt(id))
      .execute('SP_ObtenerIndicio');

    if (!indicioExistente.recordset || indicioExistente.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Indicio no encontrado',
        },
      });
    }

    const indicio = indicioExistente.recordset[0];

    // Verificar permisos en el expediente
    const permiso = await verificarPermisoExpediente(
      pool,
      indicio.ExpedienteID,
      req.user.usuarioID,
      req.user.nombreRol
    );

    if (permiso.error) {
      return res.status(permiso.status).json({
        success: false,
        error: {
          message: permiso.error,
          estadoActual: permiso.estadoActual,
        },
      });
    }

    const result = await pool
      .request()
      .input('IndicioID', sql.Int, parseInt(id))
      .input('NumeroIndicio', sql.NVarChar(50), numeroIndicio)
      .input('CategoriaID', sql.Int, categoriaID || null)
      .input('NombreObjeto', sql.NVarChar(255), nombreObjeto)
      .input('Descripcion', sql.NVarChar(sql.MAX), descripcion || null)
      .input('Color', sql.NVarChar(50), color || null)
      .input('TamanoAlto', sql.Decimal(10, 2), tamanoAlto || null)
      .input('TamanoAncho', sql.Decimal(10, 2), tamanoAncho || null)
      .input('TamanoLargo', sql.Decimal(10, 2), tamanoLargo || null)
      .input('Peso', sql.Decimal(10, 2), peso || null)
      .input('UbicacionHallazgo', sql.NVarChar(255), ubicacionHallazgo || null)
      .input('LatitudGPS', sql.Decimal(9, 6), latitudGPS || null)
      .input('LongitudGPS', sql.Decimal(9, 6), longitudGPS || null)
      .input('EstadoConservacion', sql.NVarChar(50), estadoConservacion || null)
      .input('FechaRecoleccion', sql.DateTime, fechaRecoleccion ? new Date(fechaRecoleccion) : null)
      .input('RutaFotografia', sql.NVarChar(500), rutaFotografia || null)
      .input('Observaciones', sql.NVarChar(sql.MAX), observaciones || null)
      .execute('SP_ActualizarIndicio');

    if (result.recordset[0].FilasAfectadas === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Indicio no encontrado',
        },
      });
    }

    // Obtener indicio actualizado
    const indicioActualizado = await pool
      .request()
      .input('IndicioID', sql.Int, parseInt(id))
      .execute('SP_ObtenerIndicio');

    res.json({
      success: true,
      data: indicioActualizado.recordset[0],
    });
  } catch (error) {
    console.error('Error en actualizarIndicio:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar indicio',
      },
    });
  }
};

// Eliminar indicio
const eliminarIndicio = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    // Primero obtener el indicio para saber a qué expediente pertenece
    const indicioExistente = await pool
      .request()
      .input('IndicioID', sql.Int, parseInt(id))
      .execute('SP_ObtenerIndicio');

    if (!indicioExistente.recordset || indicioExistente.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Indicio no encontrado',
        },
      });
    }

    const indicio = indicioExistente.recordset[0];

    // Verificar permisos en el expediente
    const permiso = await verificarPermisoExpediente(
      pool,
      indicio.ExpedienteID,
      req.user.usuarioID,
      req.user.nombreRol
    );

    if (permiso.error) {
      return res.status(permiso.status).json({
        success: false,
        error: {
          message: permiso.error,
          estadoActual: permiso.estadoActual,
        },
      });
    }

    const result = await pool
      .request()
      .input('IndicioID', sql.Int, parseInt(id))
      .execute('SP_EliminarIndicio');

    if (result.recordset[0].FilasAfectadas === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Indicio no encontrado',
        },
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Indicio eliminado correctamente',
      },
    });
  } catch (error) {
    console.error('Error en eliminarIndicio:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al eliminar indicio',
      },
    });
  }
};

module.exports = {
  crearIndicio,
  listarIndicios,
  obtenerIndicio,
  actualizarIndicio,
  eliminarIndicio,
};
