USE DICRI_DB;
GO

-- Actualizar contraseñas de todos los usuarios con el hash correcto de 'Password123!'
UPDATE Usuarios
SET Password = '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.'
WHERE Email IN (
    'admin@mp.gob.gt',
    'coordinador@mp.gob.gt',
    'tecnico@mp.gob.gt',
    'tecnico2@mp.gob.gt',
    'tecnico3@mp.gob.gt'
);

-- Verificar que se actualizaron
SELECT
    UsuarioID,
    NombreCompleto,
    Email,
    CASE
        WHEN Password = '$2a$10$Pl/1eXPqDAqIlKtElDORUuFI8vvJ/FVCoJFAl48srZfOvWLY30K1.'
        THEN 'Contraseña actualizada correctamente'
        ELSE 'Error: Contraseña no coincide'
    END AS Estado
FROM Usuarios
WHERE Email IN (
    'admin@mp.gob.gt',
    'coordinador@mp.gob.gt',
    'tecnico@mp.gob.gt',
    'tecnico2@mp.gob.gt',
    'tecnico3@mp.gob.gt'
);

PRINT '✅ Contraseñas actualizadas exitosamente';
PRINT '';
PRINT 'Credenciales de acceso:';
PRINT '  Admin:       admin@mp.gob.gt / Password123!';
PRINT '  Coordinador: coordinador@mp.gob.gt / Password123!';
PRINT '  Técnico:     tecnico@mp.gob.gt / Password123!';
PRINT '  Técnico 2:   tecnico2@mp.gob.gt / Password123!';
PRINT '  Técnico 3:   tecnico3@mp.gob.gt / Password123!';
GO
