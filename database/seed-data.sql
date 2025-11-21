USE DICRI_DB;
GO

-- =============================================
-- DATOS INICIALES - ROLES
-- =============================================

IF NOT EXISTS (SELECT * FROM Roles WHERE RolID = 1)
BEGIN
    SET IDENTITY_INSERT Roles ON;
    INSERT INTO Roles (RolID, NombreRol, Descripcion) VALUES
    (1, 'Administrador', 'Acceso completo al sistema'),
    (2, 'Coordinador', 'Revisión y aprobación de expedientes'),
    (3, 'Técnico', 'Registro de expedientes e indicios');
    SET IDENTITY_INSERT Roles OFF;
    PRINT '✅ Roles insertados correctamente';
END
ELSE
BEGIN
    PRINT '⚠️  Roles ya existen';
END
GO

-- =============================================
-- DATOS INICIALES - ESTADOS DE EXPEDIENTE
-- =============================================

IF NOT EXISTS (SELECT * FROM EstadosExpediente WHERE EstadoID = 1)
BEGIN
    SET IDENTITY_INSERT EstadosExpediente ON;
    INSERT INTO EstadosExpediente (EstadoID, NombreEstado, Descripcion, Color, Orden) VALUES
    (1, 'Borrador', 'Expediente en proceso de creación', '#9E9E9E', 1),
    (2, 'En Revisión', 'Expediente enviado para revisión del coordinador', '#2196F3', 2),
    (3, 'Aprobado', 'Expediente aprobado y finalizado', '#4CAF50', 3),
    (4, 'Rechazado', 'Expediente rechazado, requiere correcciones', '#F44336', 4);
    SET IDENTITY_INSERT EstadosExpediente OFF;
    PRINT '✅ Estados de expediente insertados correctamente';
END
ELSE
BEGIN
    PRINT '⚠️  Estados de expediente ya existen';
END
GO

-- =============================================
-- DATOS INICIALES - CATEGORÍAS DE INDICIOS
-- =============================================

IF NOT EXISTS (SELECT * FROM CategoriasIndicios)
BEGIN
    INSERT INTO CategoriasIndicios (NombreCategoria, Descripcion) VALUES
    ('Arma de Fuego', 'Armas de fuego y municiones'),
    ('Arma Blanca', 'Cuchillos, navajas y objetos cortantes'),
    ('Documentos', 'Documentos, papeles y escritos'),
    ('Electrónica', 'Dispositivos electrónicos y digitales'),
    ('Vehículo', 'Vehículos y partes vehiculares'),
    ('Biológico', 'Muestras biológicas y orgánicas'),
    ('Químico', 'Sustancias y compuestos químicos'),
    ('Textil', 'Prendas de vestir y textiles'),
    ('Valor', 'Objetos de valor, joyas y dinero'),
    ('Otros', 'Otros tipos de evidencia');
    PRINT '✅ Categorías de indicios insertadas correctamente';
END
ELSE
BEGIN
    PRINT '⚠️  Categorías de indicios ya existen';
END
GO

-- =============================================
-- DATOS INICIALES - USUARIOS DE PRUEBA
-- =============================================

-- Nota: Las contraseñas están hasheadas con bcrypt
-- Password original para todos: "Password123!"
-- Hash bcrypt: $2a$10$YourHashedPasswordHere

IF NOT EXISTS (SELECT * FROM Usuarios WHERE Email = 'admin@mp.gob.gt')
BEGIN
    INSERT INTO Usuarios (NombreCompleto, Email, Password, RolID, Telefono, Cargo, Departamento) VALUES
    (
        'Juan Carlos Administrador',
        'admin@mp.gob.gt',
        '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.', -- Password123!
        1,
        '2316-0001',
        'Administrador del Sistema',
        'Informática'
    );
    PRINT '✅ Usuario Administrador creado';
END
GO

IF NOT EXISTS (SELECT * FROM Usuarios WHERE Email = 'coordinador@mp.gob.gt')
BEGIN
    INSERT INTO Usuarios (NombreCompleto, Email, Password, RolID, Telefono, Cargo, Departamento) VALUES
    (
        'María Elena Coordinadora',
        'coordinador@mp.gob.gt',
        '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.', -- Password123!
        2,
        '2316-0002',
        'Coordinador DICRI',
        'Investigación Criminalística'
    );
    PRINT '✅ Usuario Coordinador creado';
END
GO

IF NOT EXISTS (SELECT * FROM Usuarios WHERE Email = 'tecnico@mp.gob.gt')
BEGIN
    INSERT INTO Usuarios (NombreCompleto, Email, Password, RolID, Telefono, Cargo, Departamento) VALUES
    (
        'Pedro José Técnico',
        'tecnico@mp.gob.gt',
        '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.', -- Password123!
        3,
        '2316-0003',
        'Técnico Criminalístico',
        'Investigación Criminalística'
    );
    PRINT '✅ Usuario Técnico creado';
END
GO

-- Insertar más técnicos de prueba
IF NOT EXISTS (SELECT * FROM Usuarios WHERE Email = 'tecnico2@mp.gob.gt')
BEGIN
    INSERT INTO Usuarios (NombreCompleto, Email, Password, RolID, Telefono, Cargo, Departamento) VALUES
    (
        'Ana Lucía Investigadora',
        'tecnico2@mp.gob.gt',
        '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.',
        3,
        '2316-0004',
        'Técnico Criminalístico',
        'Investigación Criminalística'
    );
    PRINT '✅ Usuario Técnico 2 creado';
END
GO

IF NOT EXISTS (SELECT * FROM Usuarios WHERE Email = 'tecnico3@mp.gob.gt')
BEGIN
    INSERT INTO Usuarios (NombreCompleto, Email, Password, RolID, Telefono, Cargo, Departamento) VALUES
    (
        'Carlos Alberto Perito',
        'tecnico3@mp.gob.gt',
        '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.',
        3,
        '2316-0005',
        'Técnico Criminalístico',
        'Investigación Criminalística'
    );
    PRINT '✅ Usuario Técnico 3 creado';
END
GO

-- =============================================
-- CONFIGURACIONES DEL SISTEMA
-- =============================================

IF NOT EXISTS (SELECT * FROM ConfiguracionSistema)
BEGIN
    INSERT INTO ConfiguracionSistema (Clave, Valor, Descripcion, TipoDato) VALUES
    ('PREFIJO_EXPEDIENTE', 'DICRI', 'Prefijo para número de expediente', 'string'),
    ('YEAR_FORMAT', 'YYYY', 'Formato de año para expedientes', 'string'),
    ('ENABLE_GPS', 'true', 'Habilitar captura de GPS en indicios', 'boolean'),
    ('MAX_INDICIOS', '1000', 'Máximo de indicios por expediente', 'number'),
    ('DIAS_ALERTA_REVISION', '3', 'Días para alerta de expedientes sin revisar', 'number'),
    ('EMAIL_NOTIFICACIONES', 'true', 'Habilitar notificaciones por email', 'boolean');
    PRINT '✅ Configuraciones del sistema insertadas';
END
GO

-- =============================================
-- EXPEDIENTES DE PRUEBA
-- =============================================

-- Expediente de ejemplo 1
DECLARE @ExpID1 INT;
IF NOT EXISTS (SELECT * FROM Expedientes WHERE NumeroExpediente = 'DICRI-2024-00001')
BEGIN
    EXEC SP_CrearExpediente
        @NumeroExpediente = 'DICRI-2024-00001',
        @NumeroMP = 'MP001-2024-12345',
        @TituloExpediente = 'Investigación de Robo Agravado - Zona 1',
        @Descripcion = 'Investigación de robo agravado ocurrido en establecimiento comercial',
        @LugarIncidente = 'Zona 1, Ciudad de Guatemala',
        @FechaIncidente = '2024-01-15 14:30:00',
        @TecnicoRegistraID = 3,
        @EstadoID = 1,
        @Prioridad = 'Alta',
        @Observaciones = 'Caso requiere atención prioritaria';

    -- Get the ExpedienteID that was just created
    SET @ExpID1 = (SELECT ExpedienteID FROM Expedientes WHERE NumeroExpediente = 'DICRI-2024-00001');

    -- Indicios del expediente 1
    EXEC SP_CrearIndicio
        @ExpedienteID = @ExpID1,
        @NumeroIndicio = 'IND-001',
        @CategoriaID = 2,
        @NombreObjeto = 'Cuchillo',
        @Descripcion = 'Cuchillo de cocina con mango negro',
        @Color = 'Negro/Plateado',
        @TamanoLargo = 25.5,
        @Peso = 150,
        @UbicacionHallazgo = 'Cocina del establecimiento',
        @EstadoConservacion = 'Bueno',
        @FechaRecoleccion = '2024-01-15 16:00:00',
        @TecnicoRegistraID = 3;

    EXEC SP_CrearIndicio
        @ExpedienteID = @ExpID1,
        @NumeroIndicio = 'IND-002',
        @CategoriaID = 3,
        @NombreObjeto = 'Documento de Identidad',
        @Descripcion = 'DPI encontrado en la escena',
        @UbicacionHallazgo = 'Entrada del establecimiento',
        @EstadoConservacion = 'Regular',
        @FechaRecoleccion = '2024-01-15 16:15:00',
        @TecnicoRegistraID = 3;

    PRINT '✅ Expediente de prueba 1 creado con indicios';
END
GO

-- Expediente de ejemplo 2
DECLARE @ExpID2 INT;
IF NOT EXISTS (SELECT * FROM Expedientes WHERE NumeroExpediente = 'DICRI-2024-00002')
BEGIN
    EXEC SP_CrearExpediente
        @NumeroExpediente = 'DICRI-2024-00002',
        @NumeroMP = 'MP001-2024-12346',
        @TituloExpediente = 'Homicidio - Zona 18',
        @Descripcion = 'Investigación de homicidio con arma de fuego',
        @LugarIncidente = 'Zona 18, Ciudad de Guatemala',
        @FechaIncidente = '2024-01-20 22:00:00',
        @TecnicoRegistraID = 4,
        @EstadoID = 2,
        @Prioridad = 'Crítica';

    -- Get the ExpedienteID that was just created
    SET @ExpID2 = (SELECT ExpedienteID FROM Expedientes WHERE NumeroExpediente = 'DICRI-2024-00002');

    -- Cambiar a estado "En Revisión"
    EXEC SP_CambiarEstadoExpediente
        @ExpedienteID = @ExpID2,
        @NuevoEstadoID = 2,
        @UsuarioID = 4,
        @Accion = 'Enviar a Revisión';

    PRINT '✅ Expediente de prueba 2 creado';
END
GO

PRINT '========================================';
PRINT '✅ DATOS INICIALES CARGADOS EXITOSAMENTE';
PRINT '========================================';
PRINT '';
PRINT 'Usuarios de prueba creados:';
PRINT '  Admin:       admin@mp.gob.gt / Password123!';
PRINT '  Coordinador: coordinador@mp.gob.gt / Password123!';
PRINT '  Técnico:     tecnico@mp.gob.gt / Password123!';
PRINT '';
GO
