-- =============================================
-- DICRI - Sistema de Gestión de Evidencias
-- Base de Datos SQL Server
-- =============================================

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DICRI_DB')
BEGIN
    CREATE DATABASE DICRI_DB;
END
GO

USE DICRI_DB;
GO

-- =============================================
-- Tabla: Roles
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE Roles (
        RolID INT PRIMARY KEY IDENTITY(1,1),
        NombreRol NVARCHAR(50) NOT NULL UNIQUE,
        Descripcion NVARCHAR(255),
        FechaCreacion DATETIME DEFAULT GETDATE(),
        Activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: Usuarios
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        UsuarioID INT PRIMARY KEY IDENTITY(1,1),
        NombreCompleto NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        Password NVARCHAR(255) NOT NULL,
        RolID INT NOT NULL,
        Telefono NVARCHAR(20),
        Cargo NVARCHAR(100),
        Departamento NVARCHAR(100),
        FechaCreacion DATETIME DEFAULT GETDATE(),
        UltimoAcceso DATETIME,
        Activo BIT DEFAULT 1,
        CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (RolID) REFERENCES Roles(RolID)
    );
END
GO

-- =============================================
-- Tabla: Estados de Expediente
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EstadosExpediente')
BEGIN
    CREATE TABLE EstadosExpediente (
        EstadoID INT PRIMARY KEY IDENTITY(1,1),
        NombreEstado NVARCHAR(50) NOT NULL UNIQUE,
        Descripcion NVARCHAR(255),
        Color NVARCHAR(20),
        Orden INT,
        Activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: Expedientes
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Expedientes')
BEGIN
    CREATE TABLE Expedientes (
        ExpedienteID INT PRIMARY KEY IDENTITY(1,1),
        NumeroExpediente NVARCHAR(50) NOT NULL UNIQUE,
        NumeroMP NVARCHAR(50),
        TituloExpediente NVARCHAR(255) NOT NULL,
        Descripcion NVARCHAR(MAX),
        LugarIncidente NVARCHAR(255),
        FechaIncidente DATETIME,
        FechaRegistro DATETIME DEFAULT GETDATE(),
        TecnicoRegistraID INT NOT NULL,
        EstadoID INT NOT NULL,
        CoordinadorAsignadoID INT,
        FechaRevision DATETIME,
        FechaAprobacion DATETIME,
        JustificacionRechazo NVARCHAR(MAX),
        Prioridad NVARCHAR(20) DEFAULT 'Normal',
        Observaciones NVARCHAR(MAX),
        UltimaModificacion DATETIME DEFAULT GETDATE(),
        UsuarioModificacion INT,
        CONSTRAINT FK_Expedientes_Tecnicos FOREIGN KEY (TecnicoRegistraID) REFERENCES Usuarios(UsuarioID),
        CONSTRAINT FK_Expedientes_Estados FOREIGN KEY (EstadoID) REFERENCES EstadosExpediente(EstadoID),
        CONSTRAINT FK_Expedientes_Coordinador FOREIGN KEY (CoordinadorAsignadoID) REFERENCES Usuarios(UsuarioID)
    );
END
GO

-- =============================================
-- Tabla: Categorías de Indicios
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CategoriasIndicios')
BEGIN
    CREATE TABLE CategoriasIndicios (
        CategoriaID INT PRIMARY KEY IDENTITY(1,1),
        NombreCategoria NVARCHAR(100) NOT NULL UNIQUE,
        Descripcion NVARCHAR(255),
        Activo BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: Indicios
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Indicios')
BEGIN
    CREATE TABLE Indicios (
        IndicioID INT PRIMARY KEY IDENTITY(1,1),
        ExpedienteID INT NOT NULL,
        NumeroIndicio NVARCHAR(50) NOT NULL,
        CategoriaID INT,
        NombreObjeto NVARCHAR(255) NOT NULL,
        Descripcion NVARCHAR(MAX),
        Color NVARCHAR(50),
        TamanoAlto DECIMAL(10, 2),
        TamanoAncho DECIMAL(10, 2),
        TamanoLargo DECIMAL(10, 2),
        UnidadMedida NVARCHAR(20) DEFAULT 'cm',
        Peso DECIMAL(10, 2),
        UnidadPeso NVARCHAR(20) DEFAULT 'g',
        UbicacionHallazgo NVARCHAR(500),
        LatitudGPS DECIMAL(10, 8),
        LongitudGPS DECIMAL(11, 8),
        EstadoConservacion NVARCHAR(100),
        FechaRecoleccion DATETIME,
        TecnicoRegistraID INT NOT NULL,
        FechaRegistro DATETIME DEFAULT GETDATE(),
        RutaFotografia NVARCHAR(500),
        Observaciones NVARCHAR(MAX),
        CONSTRAINT FK_Indicios_Expedientes FOREIGN KEY (ExpedienteID) REFERENCES Expedientes(ExpedienteID) ON DELETE CASCADE,
        CONSTRAINT FK_Indicios_Categorias FOREIGN KEY (CategoriaID) REFERENCES CategoriasIndicios(CategoriaID),
        CONSTRAINT FK_Indicios_Tecnicos FOREIGN KEY (TecnicoRegistraID) REFERENCES Usuarios(UsuarioID),
        CONSTRAINT UQ_NumeroIndicio_Expediente UNIQUE (ExpedienteID, NumeroIndicio)
    );
END
GO

-- =============================================
-- Tabla: Historial de Aprobaciones
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HistorialAprobaciones')
BEGIN
    CREATE TABLE HistorialAprobaciones (
        HistorialID INT PRIMARY KEY IDENTITY(1,1),
        ExpedienteID INT NOT NULL,
        EstadoAnterior INT,
        EstadoNuevo INT NOT NULL,
        UsuarioID INT NOT NULL,
        Accion NVARCHAR(50) NOT NULL, -- 'Enviar a Revision', 'Aprobar', 'Rechazar', 'Corregir'
        Comentarios NVARCHAR(MAX),
        FechaAccion DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Historial_Expedientes FOREIGN KEY (ExpedienteID) REFERENCES Expedientes(ExpedienteID) ON DELETE CASCADE,
        CONSTRAINT FK_Historial_Estados_Anterior FOREIGN KEY (EstadoAnterior) REFERENCES EstadosExpediente(EstadoID),
        CONSTRAINT FK_Historial_Estados_Nuevo FOREIGN KEY (EstadoNuevo) REFERENCES EstadosExpediente(EstadoID),
        CONSTRAINT FK_Historial_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
    );
END
GO

-- =============================================
-- Tabla: Auditoría de Cambios
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditoriaCambios')
BEGIN
    CREATE TABLE AuditoriaCambios (
        AuditoriaID INT PRIMARY KEY IDENTITY(1,1),
        NombreTabla NVARCHAR(100) NOT NULL,
        RegistroID INT NOT NULL,
        TipoOperacion NVARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
        UsuarioID INT,
        CamposModificados NVARCHAR(MAX),
        ValoresAnteriores NVARCHAR(MAX),
        ValoresNuevos NVARCHAR(MAX),
        FechaOperacion DATETIME DEFAULT GETDATE(),
        DireccionIP NVARCHAR(45)
    );
END
GO

-- =============================================
-- Tabla: Configuraciones del Sistema
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ConfiguracionSistema')
BEGIN
    CREATE TABLE ConfiguracionSistema (
        ConfigID INT PRIMARY KEY IDENTITY(1,1),
        Clave NVARCHAR(100) NOT NULL UNIQUE,
        Valor NVARCHAR(MAX),
        Descripcion NVARCHAR(255),
        TipoDato NVARCHAR(50) DEFAULT 'string',
        FechaModificacion DATETIME DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Indices para optimizar rendimiento
-- =============================================

-- Indices en Usuarios
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuarios_Email')
    CREATE INDEX IX_Usuarios_Email ON Usuarios(Email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuarios_RolID')
    CREATE INDEX IX_Usuarios_RolID ON Usuarios(RolID);

-- Indices en Expedientes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Expedientes_NumeroExpediente')
    CREATE INDEX IX_Expedientes_NumeroExpediente ON Expedientes(NumeroExpediente);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Expedientes_EstadoID')
    CREATE INDEX IX_Expedientes_EstadoID ON Expedientes(EstadoID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Expedientes_TecnicoRegistraID')
    CREATE INDEX IX_Expedientes_TecnicoRegistraID ON Expedientes(TecnicoRegistraID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Expedientes_FechaRegistro')
    CREATE INDEX IX_Expedientes_FechaRegistro ON Expedientes(FechaRegistro);

-- Indices en Indicios
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Indicios_ExpedienteID')
    CREATE INDEX IX_Indicios_ExpedienteID ON Indicios(ExpedienteID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Indicios_NumeroIndicio')
    CREATE INDEX IX_Indicios_NumeroIndicio ON Indicios(NumeroIndicio);

-- Indices en Historial
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Historial_ExpedienteID')
    CREATE INDEX IX_Historial_ExpedienteID ON HistorialAprobaciones(ExpedienteID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Historial_FechaAccion')
    CREATE INDEX IX_Historial_FechaAccion ON HistorialAprobaciones(FechaAccion);

PRINT '✅ Esquema de base de datos creado correctamente';
GO
