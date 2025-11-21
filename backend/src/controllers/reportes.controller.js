const { getPool } = require('../config/database');

// Obtener estadísticas generales
const obtenerEstadisticas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('FechaInicio', fechaInicio || null)
      .input('FechaFin', fechaFin || null)
      .execute('SP_ObtenerEstadisticasGenerales');

    res.json({
      success: true,
      data: {
        porEstado: result.recordsets[0],
        porTecnico: result.recordsets[1],
        totales: result.recordsets[2][0],
      },
    });
  } catch (error) {
    console.error('Error en obtenerEstadisticas:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener estadísticas',
      },
    });
  }
};

// Reporte de expedientes con filtros
const reporteExpedientes = async (req, res) => {
  try {
    const {
      estadoID,
      tecnicoID,
      coordinadorID,
      fechaInicio,
      fechaFin,
      prioridad,
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
      .input('BusquedaTexto', null)
      .input('PageNumber', 1)
      .input('PageSize', 10000) // Sin límite para reportes
      .execute('SP_ListarExpedientes');

    const expedientes = result.recordsets[0];

    res.json({
      success: true,
      data: expedientes,
    });
  } catch (error) {
    console.error('Error en reporteExpedientes:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al generar reporte de expedientes',
      },
    });
  }
};

// Dashboard: métricas principales
const obtenerDashboard = async (req, res) => {
  try {
    const pool = await getPool();

    // Estadísticas de hoy
    const hoy = new Date().toISOString().split('T')[0];

    // Totales generales
    const totales = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Expedientes) AS TotalExpedientes,
        (SELECT COUNT(*) FROM Indicios) AS TotalIndicios,
        (SELECT COUNT(*) FROM Expedientes WHERE EstadoID = 1) AS EnBorrador,
        (SELECT COUNT(*) FROM Expedientes WHERE EstadoID = 2) AS EnRevision,
        (SELECT COUNT(*) FROM Expedientes WHERE EstadoID = 3) AS Aprobados,
        (SELECT COUNT(*) FROM Expedientes WHERE EstadoID = 4) AS Rechazados,
        (SELECT COUNT(*) FROM Expedientes WHERE CAST(FechaRegistro AS DATE) = '${hoy}') AS ExpedientesHoy
    `);

    // Expedientes recientes
    const recientes = await pool.request().query(`
      SELECT TOP 10
        e.ExpedienteID, e.NumeroExpediente, e.TituloExpediente,
        e.FechaRegistro, e.Prioridad,
        es.NombreEstado, es.Color AS ColorEstado,
        u.NombreCompleto AS NombreTecnico
      FROM Expedientes e
      LEFT JOIN EstadosExpediente es ON e.EstadoID = es.EstadoID
      LEFT JOIN Usuarios u ON e.TecnicoRegistraID = u.UsuarioID
      ORDER BY e.FechaRegistro DESC
    `);

    // Expedientes por prioridad
    const porPrioridad = await pool.request().query(`
      SELECT
        Prioridad,
        COUNT(*) AS Total
      FROM Expedientes
      GROUP BY Prioridad
      ORDER BY
        CASE Prioridad
          WHEN 'Crítica' THEN 1
          WHEN 'Alta' THEN 2
          WHEN 'Normal' THEN 3
          WHEN 'Baja' THEN 4
          ELSE 5
        END
    `);

    // Actividad reciente (últimas 20 acciones)
    const actividad = await pool.request().query(`
      SELECT TOP 20
        h.HistorialID, h.FechaAccion, h.Accion, h.Comentarios,
        e.NumeroExpediente,
        u.NombreCompleto AS Usuario,
        es.NombreEstado AS Estado
      FROM HistorialAprobaciones h
      INNER JOIN Expedientes e ON h.ExpedienteID = e.ExpedienteID
      INNER JOIN Usuarios u ON h.UsuarioID = u.UsuarioID
      INNER JOIN EstadosExpediente es ON h.EstadoNuevo = es.EstadoID
      ORDER BY h.FechaAccion DESC
    `);

    res.json({
      success: true,
      data: {
        totales: totales.recordset[0],
        recientes: recientes.recordset,
        porPrioridad: porPrioridad.recordset,
        actividad: actividad.recordset,
      },
    });
  } catch (error) {
    console.error('Error en obtenerDashboard:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener dashboard',
      },
    });
  }
};

// Reporte de productividad por técnico
const reporteProductividad = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const pool = await getPool();

    let query = `
      SELECT
        u.UsuarioID,
        u.NombreCompleto,
        u.Departamento,
        COUNT(DISTINCT e.ExpedienteID) AS TotalExpedientes,
        COUNT(DISTINCT i.IndicioID) AS TotalIndicios,
        SUM(CASE WHEN e.EstadoID = 3 THEN 1 ELSE 0 END) AS Aprobados,
        SUM(CASE WHEN e.EstadoID = 4 THEN 1 ELSE 0 END) AS Rechazados,
        SUM(CASE WHEN e.EstadoID = 2 THEN 1 ELSE 0 END) AS EnRevision,
        AVG(CASE
          WHEN e.EstadoID = 3 AND e.FechaAprobacion IS NOT NULL
          THEN DATEDIFF(day, e.FechaRegistro, e.FechaAprobacion)
          ELSE NULL
        END) AS PromedioTiempoAprobacion
      FROM Usuarios u
      LEFT JOIN Expedientes e ON u.UsuarioID = e.TecnicoRegistraID
    `;

    if (fechaInicio || fechaFin) {
      if (fechaInicio) {
        query += ` AND e.FechaRegistro >= '${fechaInicio}'`;
      }
      if (fechaFin) {
        query += ` AND e.FechaRegistro <= '${fechaFin}'`;
      }
    }

    query += `
      LEFT JOIN Indicios i ON e.ExpedienteID = i.ExpedienteID
      WHERE u.RolID = 3
      GROUP BY u.UsuarioID, u.NombreCompleto, u.Departamento
      ORDER BY TotalExpedientes DESC
    `;

    const result = await pool.request().query(query);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en reporteProductividad:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al generar reporte de productividad',
      },
    });
  }
};

// Reporte de tendencias (por mes)
const reporteTendencias = async (req, res) => {
  try {
    const { anio } = req.query;
    const anioActual = anio || new Date().getFullYear();
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        MONTH(FechaRegistro) AS Mes,
        DATENAME(month, FechaRegistro) AS NombreMes,
        COUNT(*) AS TotalExpedientes,
        SUM(CASE WHEN EstadoID = 3 THEN 1 ELSE 0 END) AS Aprobados,
        SUM(CASE WHEN EstadoID = 4 THEN 1 ELSE 0 END) AS Rechazados
      FROM Expedientes
      WHERE YEAR(FechaRegistro) = ${anioActual}
      GROUP BY MONTH(FechaRegistro), DATENAME(month, FechaRegistro)
      ORDER BY Mes
    `);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error en reporteTendencias:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al generar reporte de tendencias',
      },
    });
  }
};

module.exports = {
  obtenerEstadisticas,
  reporteExpedientes,
  obtenerDashboard,
  reporteProductividad,
  reporteTendencias,
};
