USE DICRI_DB;
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - USUARIOS
-- =============================================

-- Crear Usuario
CREATE OR ALTER PROCEDURE SP_CrearUsuario
    @NombreCompleto NVARCHAR(255),
    @Email NVARCHAR(255),
    @Password NVARCHAR(255),
    @RolID INT,
    @Telefono NVARCHAR(20) = NULL,
    @Cargo NVARCHAR(100) = NULL,
    @Departamento NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Usuarios (NombreCompleto, Email, Password, RolID, Telefono, Cargo, Departamento)
        VALUES (@NombreCompleto, @Email, @Password, @RolID, @Telefono, @Cargo, @Departamento);

        SELECT SCOPE_IDENTITY() AS UsuarioID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- Obtener Usuario por Email
CREATE OR ALTER PROCEDURE SP_ObtenerUsuarioPorEmail
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        u.UsuarioID, u.NombreCompleto, u.Email, u.Password, u.RolID,
        u.Telefono, u.Cargo, u.Departamento, u.FechaCreacion,
        u.UltimoAcceso, u.Activo,
        r.NombreRol
    FROM Usuarios u
    INNER JOIN Roles r ON u.RolID = r.RolID
    WHERE u.Email = @Email AND u.Activo = 1;
END
GO

-- Actualizar último acceso
CREATE OR ALTER PROCEDURE SP_ActualizarUltimoAcceso
    @UsuarioID INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Usuarios SET UltimoAcceso = GETDATE() WHERE UsuarioID = @UsuarioID;
END
GO

-- Listar Usuarios
CREATE OR ALTER PROCEDURE SP_ListarUsuarios
    @RolID INT = NULL,
    @Activo BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        u.UsuarioID, u.NombreCompleto, u.Email, u.RolID,
        u.Telefono, u.Cargo, u.Departamento, u.FechaCreacion,
        u.UltimoAcceso, u.Activo,
        r.NombreRol
    FROM Usuarios u
    INNER JOIN Roles r ON u.RolID = r.RolID
    WHERE (@RolID IS NULL OR u.RolID = @RolID)
      AND (@Activo IS NULL OR u.Activo = @Activo)
    ORDER BY u.NombreCompleto;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - EXPEDIENTES
-- =============================================

-- Crear Expediente
CREATE OR ALTER PROCEDURE SP_CrearExpediente
    @NumeroExpediente NVARCHAR(50),
    @NumeroMP NVARCHAR(50) = NULL,
    @TituloExpediente NVARCHAR(255),
    @Descripcion NVARCHAR(MAX) = NULL,
    @LugarIncidente NVARCHAR(255) = NULL,
    @FechaIncidente DATETIME = NULL,
    @TecnicoRegistraID INT,
    @EstadoID INT = 1,
    @Prioridad NVARCHAR(20) = 'Normal',
    @Observaciones NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Expedientes (
            NumeroExpediente, NumeroMP, TituloExpediente, Descripcion,
            LugarIncidente, FechaIncidente, TecnicoRegistraID, EstadoID,
            Prioridad, Observaciones
        )
        VALUES (
            @NumeroExpediente, @NumeroMP, @TituloExpediente, @Descripcion,
            @LugarIncidente, @FechaIncidente, @TecnicoRegistraID, @EstadoID,
            @Prioridad, @Observaciones
        );

        DECLARE @ExpedienteID INT = SCOPE_IDENTITY();

        -- Registrar en historial
        INSERT INTO HistorialAprobaciones (ExpedienteID, EstadoNuevo, UsuarioID, Accion)
        VALUES (@ExpedienteID, @EstadoID, @TecnicoRegistraID, 'Creación de Expediente');

        SELECT @ExpedienteID AS ExpedienteID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- Obtener Expediente por ID
CREATE OR ALTER PROCEDURE SP_ObtenerExpediente
    @ExpedienteID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        e.*,
        es.NombreEstado, es.Color AS ColorEstado,
        t.NombreCompleto AS NombreTecnico,
        t.Email AS EmailTecnico,
        c.NombreCompleto AS NombreCoordinador,
        (SELECT COUNT(*) FROM Indicios WHERE ExpedienteID = e.ExpedienteID) AS TotalIndicios
    FROM Expedientes e
    LEFT JOIN EstadosExpediente es ON e.EstadoID = es.EstadoID
    LEFT JOIN Usuarios t ON e.TecnicoRegistraID = t.UsuarioID
    LEFT JOIN Usuarios c ON e.CoordinadorAsignadoID = c.UsuarioID
    WHERE e.ExpedienteID = @ExpedienteID;
END
GO

-- Listar Expedientes
CREATE OR ALTER PROCEDURE SP_ListarExpedientes
    @EstadoID INT = NULL,
    @TecnicoID INT = NULL,
    @CoordinadorID INT = NULL,
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL,
    @Prioridad NVARCHAR(20) = NULL,
    @BusquedaTexto NVARCHAR(255) = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    SELECT
        e.ExpedienteID, e.NumeroExpediente, e.NumeroMP, e.TituloExpediente,
        e.Descripcion, e.LugarIncidente, e.FechaIncidente, e.FechaRegistro,
        e.Prioridad, e.FechaRevision, e.FechaAprobacion,
        es.NombreEstado, es.Color AS ColorEstado,
        t.NombreCompleto AS NombreTecnico,
        c.NombreCompleto AS NombreCoordinador,
        (SELECT COUNT(*) FROM Indicios WHERE ExpedienteID = e.ExpedienteID) AS TotalIndicios
    FROM Expedientes e
    LEFT JOIN EstadosExpediente es ON e.EstadoID = es.EstadoID
    LEFT JOIN Usuarios t ON e.TecnicoRegistraID = t.UsuarioID
    LEFT JOIN Usuarios c ON e.CoordinadorAsignadoID = c.UsuarioID
    WHERE (@EstadoID IS NULL OR e.EstadoID = @EstadoID)
      AND (@TecnicoID IS NULL OR e.TecnicoRegistraID = @TecnicoID)
      AND (@CoordinadorID IS NULL OR e.CoordinadorAsignadoID = @CoordinadorID)
      AND (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
      AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)
      AND (@Prioridad IS NULL OR e.Prioridad = @Prioridad)
      AND (@BusquedaTexto IS NULL OR
           e.NumeroExpediente LIKE '%' + @BusquedaTexto + '%' OR
           e.TituloExpediente LIKE '%' + @BusquedaTexto + '%' OR
           e.NumeroMP LIKE '%' + @BusquedaTexto + '%')
    ORDER BY e.FechaRegistro DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    -- Total de registros
    SELECT COUNT(*) AS TotalRegistros
    FROM Expedientes e
    WHERE (@EstadoID IS NULL OR e.EstadoID = @EstadoID)
      AND (@TecnicoID IS NULL OR e.TecnicoRegistraID = @TecnicoID)
      AND (@CoordinadorID IS NULL OR e.CoordinadorAsignadoID = @CoordinadorID)
      AND (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
      AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)
      AND (@Prioridad IS NULL OR e.Prioridad = @Prioridad)
      AND (@BusquedaTexto IS NULL OR
           e.NumeroExpediente LIKE '%' + @BusquedaTexto + '%' OR
           e.TituloExpediente LIKE '%' + @BusquedaTexto + '%');
END
GO

-- Actualizar Expediente
CREATE OR ALTER PROCEDURE SP_ActualizarExpediente
    @ExpedienteID INT,
    @NumeroMP NVARCHAR(50) = NULL,
    @TituloExpediente NVARCHAR(255),
    @Descripcion NVARCHAR(MAX) = NULL,
    @LugarIncidente NVARCHAR(255) = NULL,
    @FechaIncidente DATETIME = NULL,
    @Prioridad NVARCHAR(20) = 'Normal',
    @Observaciones NVARCHAR(MAX) = NULL,
    @UsuarioModificacion INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Expedientes
        SET NumeroMP = @NumeroMP,
            TituloExpediente = @TituloExpediente,
            Descripcion = @Descripcion,
            LugarIncidente = @LugarIncidente,
            FechaIncidente = @FechaIncidente,
            Prioridad = @Prioridad,
            Observaciones = @Observaciones,
            UltimaModificacion = GETDATE(),
            UsuarioModificacion = @UsuarioModificacion
        WHERE ExpedienteID = @ExpedienteID;

        SELECT @@ROWCOUNT AS FilasAfectadas;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- Cambiar Estado de Expediente
CREATE OR ALTER PROCEDURE SP_CambiarEstadoExpediente
    @ExpedienteID INT,
    @NuevoEstadoID INT,
    @UsuarioID INT,
    @Accion NVARCHAR(50),
    @Comentarios NVARCHAR(MAX) = NULL,
    @JustificacionRechazo NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @EstadoAnterior INT;
        SELECT @EstadoAnterior = EstadoID FROM Expedientes WHERE ExpedienteID = @ExpedienteID;

        -- Actualizar estado del expediente
        UPDATE Expedientes
        SET EstadoID = @NuevoEstadoID,
            CoordinadorAsignadoID = CASE
                WHEN @NuevoEstadoID = 2 THEN @UsuarioID -- En Revisión
                ELSE CoordinadorAsignadoID
            END,
            FechaRevision = CASE
                WHEN @NuevoEstadoID = 2 THEN GETDATE()
                ELSE FechaRevision
            END,
            FechaAprobacion = CASE
                WHEN @NuevoEstadoID = 3 THEN GETDATE() -- Aprobado
                ELSE FechaAprobacion
            END,
            JustificacionRechazo = CASE
                WHEN @NuevoEstadoID = 4 THEN @JustificacionRechazo -- Rechazado
                ELSE JustificacionRechazo
            END,
            UltimaModificacion = GETDATE()
        WHERE ExpedienteID = @ExpedienteID;

        -- Registrar en historial
        INSERT INTO HistorialAprobaciones (
            ExpedienteID, EstadoAnterior, EstadoNuevo, UsuarioID, Accion, Comentarios
        )
        VALUES (
            @ExpedienteID, @EstadoAnterior, @NuevoEstadoID, @UsuarioID, @Accion, @Comentarios
        );

        COMMIT TRANSACTION;
        SELECT 1 AS Exito;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Eliminar Expediente
CREATE OR ALTER PROCEDURE SP_EliminarExpediente
    @ExpedienteID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Expedientes WHERE ExpedienteID = @ExpedienteID;
        SELECT @@ROWCOUNT AS FilasAfectadas;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - INDICIOS
-- =============================================

-- Crear Indicio
CREATE OR ALTER PROCEDURE SP_CrearIndicio
    @ExpedienteID INT,
    @NumeroIndicio NVARCHAR(50),
    @CategoriaID INT = NULL,
    @NombreObjeto NVARCHAR(255),
    @Descripcion NVARCHAR(MAX) = NULL,
    @Color NVARCHAR(50) = NULL,
    @TamanoAlto DECIMAL(10, 2) = NULL,
    @TamanoAncho DECIMAL(10, 2) = NULL,
    @TamanoLargo DECIMAL(10, 2) = NULL,
    @UnidadMedida NVARCHAR(20) = 'cm',
    @Peso DECIMAL(10, 2) = NULL,
    @UnidadPeso NVARCHAR(20) = 'g',
    @UbicacionHallazgo NVARCHAR(500) = NULL,
    @LatitudGPS DECIMAL(10, 8) = NULL,
    @LongitudGPS DECIMAL(11, 8) = NULL,
    @EstadoConservacion NVARCHAR(100) = NULL,
    @FechaRecoleccion DATETIME = NULL,
    @TecnicoRegistraID INT,
    @RutaFotografia NVARCHAR(500) = NULL,
    @Observaciones NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Indicios (
            ExpedienteID, NumeroIndicio, CategoriaID, NombreObjeto, Descripcion,
            Color, TamanoAlto, TamanoAncho, TamanoLargo, UnidadMedida,
            Peso, UnidadPeso, UbicacionHallazgo, LatitudGPS, LongitudGPS,
            EstadoConservacion, FechaRecoleccion, TecnicoRegistraID,
            RutaFotografia, Observaciones
        )
        VALUES (
            @ExpedienteID, @NumeroIndicio, @CategoriaID, @NombreObjeto, @Descripcion,
            @Color, @TamanoAlto, @TamanoAncho, @TamanoLargo, @UnidadMedida,
            @Peso, @UnidadPeso, @UbicacionHallazgo, @LatitudGPS, @LongitudGPS,
            @EstadoConservacion, @FechaRecoleccion, @TecnicoRegistraID,
            @RutaFotografia, @Observaciones
        );

        SELECT SCOPE_IDENTITY() AS IndicioID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- Listar Indicios por Expediente
CREATE OR ALTER PROCEDURE SP_ListarIndiciosPorExpediente
    @ExpedienteID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        i.*,
        c.NombreCategoria,
        u.NombreCompleto AS NombreTecnico
    FROM Indicios i
    LEFT JOIN CategoriasIndicios c ON i.CategoriaID = c.CategoriaID
    LEFT JOIN Usuarios u ON i.TecnicoRegistraID = u.UsuarioID
    WHERE i.ExpedienteID = @ExpedienteID
    ORDER BY i.NumeroIndicio;
END
GO

-- Obtener Indicio
CREATE OR ALTER PROCEDURE SP_ObtenerIndicio
    @IndicioID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        i.*,
        c.NombreCategoria,
        u.NombreCompleto AS NombreTecnico,
        e.NumeroExpediente
    FROM Indicios i
    LEFT JOIN CategoriasIndicios c ON i.CategoriaID = c.CategoriaID
    LEFT JOIN Usuarios u ON i.TecnicoRegistraID = u.UsuarioID
    LEFT JOIN Expedientes e ON i.ExpedienteID = e.ExpedienteID
    WHERE i.IndicioID = @IndicioID;
END
GO

-- Actualizar Indicio
CREATE OR ALTER PROCEDURE SP_ActualizarIndicio
    @IndicioID INT,
    @NumeroIndicio NVARCHAR(50),
    @CategoriaID INT = NULL,
    @NombreObjeto NVARCHAR(255),
    @Descripcion NVARCHAR(MAX) = NULL,
    @Color NVARCHAR(50) = NULL,
    @TamanoAlto DECIMAL(10, 2) = NULL,
    @TamanoAncho DECIMAL(10, 2) = NULL,
    @TamanoLargo DECIMAL(10, 2) = NULL,
    @Peso DECIMAL(10, 2) = NULL,
    @UbicacionHallazgo NVARCHAR(500) = NULL,
    @LatitudGPS DECIMAL(10, 8) = NULL,
    @LongitudGPS DECIMAL(11, 8) = NULL,
    @EstadoConservacion NVARCHAR(100) = NULL,
    @FechaRecoleccion DATETIME = NULL,
    @RutaFotografia NVARCHAR(500) = NULL,
    @Observaciones NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Indicios
        SET NumeroIndicio = @NumeroIndicio,
            CategoriaID = @CategoriaID,
            NombreObjeto = @NombreObjeto,
            Descripcion = @Descripcion,
            Color = @Color,
            TamanoAlto = @TamanoAlto,
            TamanoAncho = @TamanoAncho,
            TamanoLargo = @TamanoLargo,
            Peso = @Peso,
            UbicacionHallazgo = @UbicacionHallazgo,
            LatitudGPS = @LatitudGPS,
            LongitudGPS = @LongitudGPS,
            EstadoConservacion = @EstadoConservacion,
            FechaRecoleccion = @FechaRecoleccion,
            RutaFotografia = @RutaFotografia,
            Observaciones = @Observaciones
        WHERE IndicioID = @IndicioID;

        SELECT @@ROWCOUNT AS FilasAfectadas;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- Eliminar Indicio
CREATE OR ALTER PROCEDURE SP_EliminarIndicio
    @IndicioID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Indicios WHERE IndicioID = @IndicioID;
        SELECT @@ROWCOUNT AS FilasAfectadas;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - REPORTES
-- =============================================

-- Estadísticas Generales
CREATE OR ALTER PROCEDURE SP_ObtenerEstadisticasGenerales
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Expedientes por estado
    SELECT
        e.NombreEstado,
        e.Color,
        COUNT(ex.ExpedienteID) AS TotalExpedientes
    FROM EstadosExpediente e
    LEFT JOIN Expedientes ex ON e.EstadoID = ex.EstadoID
        AND (@FechaInicio IS NULL OR ex.FechaRegistro >= @FechaInicio)
        AND (@FechaFin IS NULL OR ex.FechaRegistro <= @FechaFin)
    GROUP BY e.EstadoID, e.NombreEstado, e.Color, e.Orden
    ORDER BY e.Orden;

    -- Expedientes por técnico
    SELECT TOP 10
        u.NombreCompleto,
        COUNT(e.ExpedienteID) AS TotalExpedientes,
        SUM(CASE WHEN e.EstadoID = 3 THEN 1 ELSE 0 END) AS Aprobados,
        SUM(CASE WHEN e.EstadoID = 4 THEN 1 ELSE 0 END) AS Rechazados
    FROM Usuarios u
    LEFT JOIN Expedientes e ON u.UsuarioID = e.TecnicoRegistraID
        AND (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
        AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)
    WHERE u.RolID = 3 -- Técnicos
    GROUP BY u.UsuarioID, u.NombreCompleto
    ORDER BY TotalExpedientes DESC;

    -- Totales generales
    SELECT
        (SELECT COUNT(*) FROM Expedientes
         WHERE (@FechaInicio IS NULL OR FechaRegistro >= @FechaInicio)
           AND (@FechaFin IS NULL OR FechaRegistro <= @FechaFin)) AS TotalExpedientes,
        (SELECT COUNT(*) FROM Indicios i
         INNER JOIN Expedientes e ON i.ExpedienteID = e.ExpedienteID
         WHERE (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
           AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)) AS TotalIndicios,
        (SELECT COUNT(*) FROM Expedientes
         WHERE EstadoID = 2
           AND (@FechaInicio IS NULL OR FechaRegistro >= @FechaInicio)
           AND (@FechaFin IS NULL OR FechaRegistro <= @FechaFin)) AS PendientesRevision,
        (SELECT COUNT(*) FROM Expedientes
         WHERE EstadoID = 3
           AND (@FechaInicio IS NULL OR FechaAprobacion >= @FechaInicio)
           AND (@FechaFin IS NULL OR FechaAprobacion <= @FechaFin)) AS Aprobados;
END
GO

-- Historial de Aprobaciones
CREATE OR ALTER PROCEDURE SP_ObtenerHistorialAprobaciones
    @ExpedienteID INT = NULL,
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        h.*,
        e.NumeroExpediente,
        ea.NombreEstado AS EstadoAnteriorNombre,
        en.NombreEstado AS EstadoNuevoNombre,
        u.NombreCompleto AS NombreUsuario
    FROM HistorialAprobaciones h
    INNER JOIN Expedientes e ON h.ExpedienteID = e.ExpedienteID
    LEFT JOIN EstadosExpediente ea ON h.EstadoAnterior = ea.EstadoID
    INNER JOIN EstadosExpediente en ON h.EstadoNuevo = en.EstadoID
    INNER JOIN Usuarios u ON h.UsuarioID = u.UsuarioID
    WHERE (@ExpedienteID IS NULL OR h.ExpedienteID = @ExpedienteID)
      AND (@FechaInicio IS NULL OR h.FechaAccion >= @FechaInicio)
      AND (@FechaFin IS NULL OR h.FechaAccion <= @FechaFin)
    ORDER BY h.FechaAccion DESC;
END
GO

PRINT '✅ Procedimientos almacenados creados correctamente';
GO
