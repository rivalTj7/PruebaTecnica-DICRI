-- Script de diagnóstico para verificar el estado de la base de datos
USE DICRI_DB;
GO

PRINT '=== VERIFICACIÓN DE TABLAS ===';

-- Verificar que existan las tablas necesarias
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'EstadosExpediente')
    PRINT '✅ Tabla EstadosExpediente existe';
ELSE
    PRINT '❌ Tabla EstadosExpediente NO existe';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Expedientes')
    PRINT '✅ Tabla Expedientes existe';
ELSE
    PRINT '❌ Tabla Expedientes NO existe';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'HistorialAprobaciones')
    PRINT '✅ Tabla HistorialAprobaciones existe';
ELSE
    PRINT '❌ Tabla HistorialAprobaciones NO existe';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
    PRINT '✅ Tabla Usuarios existe';
ELSE
    PRINT '❌ Tabla Usuarios NO existe';

PRINT '';
PRINT '=== VERIFICACIÓN DE ESTADOS ===';

-- Verificar estados de expediente
SELECT
    EstadoID,
    NombreEstado,
    Color
FROM EstadosExpediente
ORDER BY EstadoID;

PRINT '';
PRINT '=== VERIFICACIÓN DE USUARIOS ===';

-- Verificar usuarios
SELECT
    UsuarioID,
    NombreCompleto,
    Email,
    (SELECT NombreRol FROM Roles WHERE RolID = u.RolID) AS Rol
FROM Usuarios u
WHERE Activo = 1;

PRINT '';
PRINT '=== VERIFICACIÓN DE STORED PROCEDURES ===';

-- Verificar que exista el SP
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_CrearExpediente')
    PRINT '✅ SP_CrearExpediente existe';
ELSE
    PRINT '❌ SP_CrearExpediente NO existe';

PRINT '';
PRINT '=== PRUEBA DE CREACIÓN (SIMULACIÓN) ===';

-- Ver qué pasaría con los parámetros del usuario
DECLARE @TestResult TABLE (ExpedienteID INT);

BEGIN TRY
    DECLARE @TestExpedienteID INT;

    -- Simular inserción
    INSERT INTO Expedientes (
        NumeroExpediente, NumeroMP, TituloExpediente, Descripcion,
        LugarIncidente, FechaIncidente, TecnicoRegistraID, EstadoID,
        Prioridad, Observaciones
    )
    VALUES (
        'TEST-DIAGNOSTIC-001',
        'MP-TEST-001',
        'Test Diagnóstico',
        'Prueba de diagnóstico',
        'Zona de prueba',
        CONVERT(DATETIME, '2025-11-21T06:00:00', 126),
        (SELECT TOP 1 UsuarioID FROM Usuarios WHERE RolID = 3 AND Activo = 1),
        1,
        'Alta',
        'Observaciones de prueba'
    );

    SET @TestExpedienteID = SCOPE_IDENTITY();

    PRINT '✅ Inserción en Expedientes: EXITOSA';
    PRINT 'ExpedienteID generado: ' + CAST(@TestExpedienteID AS VARCHAR);

    -- Intentar insertar en historial
    INSERT INTO HistorialAprobaciones (ExpedienteID, EstadoNuevo, UsuarioID, Accion)
    VALUES (
        @TestExpedienteID,
        1,
        (SELECT TOP 1 UsuarioID FROM Usuarios WHERE RolID = 3 AND Activo = 1),
        'Creación de Expediente'
    );

    PRINT '✅ Inserción en HistorialAprobaciones: EXITOSA';

    -- Limpiar datos de prueba
    DELETE FROM HistorialAprobaciones WHERE ExpedienteID = @TestExpedienteID;
    DELETE FROM Expedientes WHERE ExpedienteID = @TestExpedienteID;

    PRINT '✅ Limpieza completada';
    PRINT '';
    PRINT '🎉 DIAGNÓSTICO: Todo parece estar bien';

END TRY
BEGIN CATCH
    PRINT '❌ ERROR EN LA PRUEBA:';
    PRINT 'Mensaje: ' + ERROR_MESSAGE();
    PRINT 'Línea: ' + CAST(ERROR_LINE() AS VARCHAR);
    PRINT 'Procedimiento: ' + ISNULL(ERROR_PROCEDURE(), 'N/A');

    -- Intentar limpiar si algo quedó
    IF EXISTS (SELECT * FROM Expedientes WHERE NumeroExpediente = 'TEST-DIAGNOSTIC-001')
    BEGIN
        DELETE FROM Expedientes WHERE NumeroExpediente = 'TEST-DIAGNOSTIC-001';
    END
END CATCH;
GO
