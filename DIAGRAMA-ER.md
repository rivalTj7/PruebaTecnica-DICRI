# Diagrama Entidad-Relación (ER) - DICRI

## Modelo Conceptual

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BASE DE DATOS DICRI_DB                            │
└─────────────────────────────────────────────────────────────────────────┘


                    ┌──────────────────┐
                    │      Roles       │
                    ├──────────────────┤
                    │ PK RolID         │
                    │    NombreRol     │
                    │    Descripcion   │
                    │    FechaCreacion │
                    │    Activo        │
                    └────────┬─────────┘
                             │
                             │ 1
                             │
                             │ N
                    ┌────────▼─────────┐
                    │    Usuarios      │
                    ├──────────────────┤
                    │ PK UsuarioID     │
                    │    NombreCompleto│
                    │    Email         │
                    │    Password      │
                    │ FK RolID         │
                    │    Telefono      │
                    │    Cargo         │
                    │    Departamento  │
                    │    FechaCreacion │
                    │    UltimoAcceso  │
                    │    Activo        │
                    └─────┬────┬───────┘
                          │    │
      ┌───────────────────┘    └───────────────────┐
      │ (TecnicoRegistraID)              (CoordinadorAsignadoID)
      │ N                                          N │
      │                                              │
┌─────▼──────────────────┐                          │
│  Expedientes           │◄─────────────────────────┘
├────────────────────────┤
│ PK ExpedienteID        │
│    NumeroExpediente    │
│    NumeroMP            │
│    TituloExpediente    │
│    Descripcion         │
│    LugarIncidente      │
│    FechaIncidente      │
│    FechaRegistro       │
│ FK TecnicoRegistraID   │
│ FK EstadoID            │
│ FK CoordinadorAsignadoID│
│    FechaRevision       │
│    FechaAprobacion     │
│    JustificacionRechazo│
│    Prioridad           │
│    Observaciones       │
│    UltimaModificacion  │
│    UsuarioModificacion │
└───┬────────────────┬───┘
    │                │
    │ 1              │ N
    │                └────────────────────────┐
    │ N                                       │
    │                                         │
┌───▼────────────────┐              ┌────────▼──────────────┐
│EstadosExpediente   │              │HistorialAprobaciones  │
├────────────────────┤              ├───────────────────────┤
│ PK EstadoID        │              │ PK HistorialID        │
│    NombreEstado    │              │ FK ExpedienteID       │
│    Descripcion     │              │ FK EstadoAnterior     │
│    Color           │              │ FK EstadoNuevo        │
│    Orden           │              │ FK UsuarioID          │
│    Activo          │              │    Accion             │
└────────────────────┘              │    Comentarios        │
                                    │    FechaAccion        │
                                    └───────────────────────┘
                                              │
                                              │ N
                                              │
                                              │ 1
                                    ┌─────────▼──────────┐
                                    │    Usuarios        │
                                    │    (FK)            │
                                    └────────────────────┘


┌─────────────────────┐
│  Expedientes        │
│  (PK ExpedienteID)  │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
      ┌────▼──────────────────┐
      │     Indicios          │
      ├───────────────────────┤
      │ PK IndicioID          │
      │ FK ExpedienteID       │
      │    NumeroIndicio      │
      │ FK CategoriaID        │
      │    NombreObjeto       │
      │    Descripcion        │
      │    Color              │
      │    TamanoAlto         │
      │    TamanoAncho        │
      │    TamanoLargo        │
      │    UnidadMedida       │
      │    Peso               │
      │    UnidadPeso         │
      │    UbicacionHallazgo  │
      │    LatitudGPS         │
      │    LongitudGPS        │
      │    EstadoConservacion │
      │    FechaRecoleccion   │
      │ FK TecnicoRegistraID  │
      │    FechaRegistro      │
      │    RutaFotografia     │
      │    Observaciones      │
      └───────┬───────────────┘
              │
              │ N
              │
              │ 1
     ┌────────▼────────────────┐
     │ CategoriasIndicios      │
     ├─────────────────────────┤
     │ PK CategoriaID          │
     │    NombreCategoria      │
     │    Descripcion          │
     │    Activo               │
     └─────────────────────────┘


┌─────────────────────────────┐
│   AuditoriaCambios          │
├─────────────────────────────┤
│ PK AuditoriaID              │
│    NombreTabla              │
│    RegistroID               │
│    TipoOperacion            │
│    UsuarioID                │
│    CamposModificados        │
│    ValoresAnteriores        │
│    ValoresNuevos            │
│    FechaOperacion           │
│    DireccionIP              │
└─────────────────────────────┘


┌─────────────────────────────┐
│  ConfiguracionSistema       │
├─────────────────────────────┤
│ PK ConfigID                 │
│    Clave                    │
│    Valor                    │
│    Descripcion              │
│    TipoDato                 │
│    FechaCreacion            │
│    UltimaModificacion       │
└─────────────────────────────┘
```

## Descripción Detallada de Entidades

### 1. **Roles**
Define los tipos de usuarios en el sistema.

**Atributos:**
- `RolID` (PK): Identificador único del rol
- `NombreRol`: Nombre del rol (Admin, Coordinador, Técnico)
- `Descripcion`: Descripción de permisos y responsabilidades
- `FechaCreacion`: Fecha de creación del registro
- `Activo`: Estado del rol (activo/inactivo)

**Relaciones:**
- 1:N con Usuarios

**Valores de ejemplo:**
- ID 1: Administrador
- ID 2: Coordinador
- ID 3: Técnico

---

### 2. **Usuarios**
Almacena información de los usuarios del sistema.

**Atributos:**
- `UsuarioID` (PK): Identificador único
- `NombreCompleto`: Nombre completo del usuario
- `Email`: Correo electrónico (único)
- `Password`: Contraseña hasheada con bcrypt
- `RolID` (FK): Referencia al rol
- `Telefono`: Número de contacto
- `Cargo`: Puesto del usuario
- `Departamento`: Área de trabajo
- `FechaCreacion`: Fecha de registro
- `UltimoAcceso`: Última sesión
- `Activo`: Estado del usuario

**Relaciones:**
- N:1 con Roles
- 1:N con Expedientes (como técnico registrador)
- 1:N con Expedientes (como coordinador asignado)
- 1:N con Indicios (como técnico registrador)
- 1:N con HistorialAprobaciones

---

### 3. **EstadosExpediente**
Catálogo de estados en el flujo de aprobación.

**Atributos:**
- `EstadoID` (PK): Identificador único
- `NombreEstado`: Nombre del estado
- `Descripcion`: Descripción del estado
- `Color`: Color hex para UI (#RRGGBB)
- `Orden`: Orden en el flujo
- `Activo`: Si está disponible

**Relaciones:**
- 1:N con Expedientes
- 1:N con HistorialAprobaciones (EstadoAnterior)
- 1:N con HistorialAprobaciones (EstadoNuevo)

**Estados definidos:**
1. Borrador (#9E9E9E) - Expediente en creación
2. En Revisión (#2196F3) - Enviado a coordinador
3. Aprobado (#4CAF50) - Finalizado exitosamente
4. Rechazado (#F44336) - Requiere correcciones

---

### 4. **Expedientes**
Entidad central que representa un caso de investigación.

**Atributos:**
- `ExpedienteID` (PK): Identificador único
- `NumeroExpediente`: Código único (ej: DICRI-2024-00001)
- `NumeroMP`: Número del Ministerio Público
- `TituloExpediente`: Título del caso
- `Descripcion`: Descripción detallada
- `LugarIncidente`: Ubicación del incidente
- `FechaIncidente`: Cuándo ocurrió
- `FechaRegistro`: Cuándo se registró
- `TecnicoRegistraID` (FK): Técnico que lo crea
- `EstadoID` (FK): Estado actual
- `CoordinadorAsignadoID` (FK): Coordinador revisor
- `FechaRevision`: Cuándo se revisó
- `FechaAprobacion`: Cuándo se aprobó
- `JustificacionRechazo`: Razón del rechazo (si aplica)
- `Prioridad`: Alta, Normal, Baja
- `Observaciones`: Notas adicionales
- `UltimaModificacion`: Timestamp de cambio
- `UsuarioModificacion`: Quién modificó

**Relaciones:**
- N:1 con Usuarios (TecnicoRegistraID)
- N:1 con Usuarios (CoordinadorAsignadoID)
- N:1 con EstadosExpediente
- 1:N con Indicios (CASCADE DELETE)
- 1:N con HistorialAprobaciones (CASCADE DELETE)

**Reglas de negocio:**
- NumeroExpediente debe ser único
- Solo puede cambiar de estado mediante SPs
- Requiere justificación si es rechazado

---

### 5. **CategoriasIndicios**
Clasificación de tipos de evidencia.

**Atributos:**
- `CategoriaID` (PK): Identificador único
- `NombreCategoria`: Nombre de la categoría (único)
- `Descripcion`: Descripción del tipo
- `Activo`: Si está disponible

**Relaciones:**
- 1:N con Indicios

**Categorías definidas:**
- Arma de Fuego
- Arma Blanca
- Documentos
- Electrónica
- Vehículo
- Biológico
- Químico
- Textil
- Valor
- Otros

---

### 6. **Indicios**
Evidencias recolectadas en un expediente.

**Atributos:**
- `IndicioID` (PK): Identificador único
- `ExpedienteID` (FK): Expediente al que pertenece
- `NumeroIndicio`: Código único dentro del expediente
- `CategoriaID` (FK): Tipo de evidencia
- `NombreObjeto`: Nombre descriptivo
- `Descripcion`: Descripción detallada
- `Color`: Color del objeto
- `TamanoAlto/Ancho/Largo`: Dimensiones
- `UnidadMedida`: cm por defecto
- `Peso`: Peso del objeto
- `UnidadPeso`: g por defecto
- `UbicacionHallazgo`: Dónde se encontró
- `LatitudGPS/LongitudGPS`: Coordenadas GPS
- `EstadoConservacion`: Bueno, Regular, Malo
- `FechaRecoleccion`: Cuándo se recolectó
- `TecnicoRegistraID` (FK): Técnico que registró
- `FechaRegistro`: Timestamp de creación
- `RutaFotografia`: Path a la imagen
- `Observaciones`: Notas adicionales

**Relaciones:**
- N:1 con Expedientes (CASCADE DELETE)
- N:1 con CategoriasIndicios
- N:1 con Usuarios (TecnicoRegistraID)

**Constraints:**
- UNIQUE(ExpedienteID, NumeroIndicio) - No puede repetirse el número de indicio en el mismo expediente

---

### 7. **HistorialAprobaciones**
Auditoría del flujo de estados de expedientes.

**Atributos:**
- `HistorialID` (PK): Identificador único
- `ExpedienteID` (FK): Expediente modificado
- `EstadoAnterior` (FK): Estado previo (puede ser NULL)
- `EstadoNuevo` (FK): Estado nuevo
- `UsuarioID` (FK): Usuario que realizó la acción
- `Accion`: Tipo de acción (Crear, Enviar a Revisión, Aprobar, Rechazar, Corregir)
- `Comentarios`: Observaciones del usuario
- `FechaAccion`: Timestamp de la acción

**Relaciones:**
- N:1 con Expedientes (CASCADE DELETE)
- N:1 con EstadosExpediente (EstadoAnterior)
- N:1 con EstadosExpediente (EstadoNuevo)
- N:1 con Usuarios

**Propósito:**
- Trazabilidad completa de cambios de estado
- Registro de quién aprobó/rechazó
- Justificaciones de rechazo

---

### 8. **AuditoriaCambios**
Registro de todas las operaciones en la base de datos.

**Atributos:**
- `AuditoriaID` (PK): Identificador único
- `NombreTabla`: Tabla afectada
- `RegistroID`: ID del registro modificado
- `TipoOperacion`: INSERT, UPDATE, DELETE
- `UsuarioID`: Usuario que realizó la acción
- `CamposModificados`: JSON con campos cambiados
- `ValoresAnteriores`: JSON con valores previos
- `ValoresNuevos`: JSON con valores nuevos
- `FechaOperacion`: Timestamp
- `DireccionIP`: IP del cliente

**Relaciones:**
- Ninguna (tabla independiente de auditoría)

**Propósito:**
- Cumplimiento normativo
- Seguridad y trazabilidad
- Recuperación de datos

---

### 9. **ConfiguracionSistema**
Parámetros configurables del sistema.

**Atributos:**
- `ConfigID` (PK): Identificador único
- `Clave`: Nombre de la configuración (único)
- `Valor`: Valor actual
- `Descripcion`: Descripción de la config
- `TipoDato`: string, number, boolean
- `FechaCreacion`: Timestamp de creación
- `UltimaModificacion`: Timestamp de cambio

**Relaciones:**
- Ninguna

**Configuraciones ejemplo:**
- PREFIJO_EXPEDIENTE: 'DICRI'
- ENABLE_GPS: 'true'
- MAX_INDICIOS: '1000'
- DIAS_ALERTA_REVISION: '3'

---

## Cardinalidades

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| Roles → Usuarios | 1:N | Un rol puede tener muchos usuarios |
| Usuarios → Expedientes (Técnico) | 1:N | Un técnico puede crear muchos expedientes |
| Usuarios → Expedientes (Coordinador) | 1:N | Un coordinador puede revisar muchos expedientes |
| EstadosExpediente → Expedientes | 1:N | Un estado puede tener muchos expedientes |
| Expedientes → Indicios | 1:N | Un expediente puede tener muchos indicios |
| CategoriasIndicios → Indicios | 1:N | Una categoría puede clasificar muchos indicios |
| Usuarios → Indicios | 1:N | Un técnico puede registrar muchos indicios |
| Expedientes → HistorialAprobaciones | 1:N | Un expediente tiene múltiples registros de historial |
| Usuarios → HistorialAprobaciones | 1:N | Un usuario puede realizar múltiples acciones |
| EstadosExpediente → HistorialAprobaciones | 1:N | Un estado puede aparecer en muchos registros |

---

## Índices para Optimización

### Índices Recomendados

```sql
-- Usuarios
CREATE INDEX IX_Usuarios_Email ON Usuarios(Email);
CREATE INDEX IX_Usuarios_RolID ON Usuarios(RolID);

-- Expedientes
CREATE INDEX IX_Expedientes_NumeroExpediente ON Expedientes(NumeroExpediente);
CREATE INDEX IX_Expedientes_EstadoID ON Expedientes(EstadoID);
CREATE INDEX IX_Expedientes_TecnicoRegistraID ON Expedientes(TecnicoRegistraID);
CREATE INDEX IX_Expedientes_FechaRegistro ON Expedientes(FechaRegistro);

-- Indicios
CREATE INDEX IX_Indicios_ExpedienteID ON Indicios(ExpedienteID);
CREATE INDEX IX_Indicios_NumeroIndicio ON Indicios(NumeroIndicio);

-- HistorialAprobaciones
CREATE INDEX IX_Historial_ExpedienteID ON HistorialAprobaciones(ExpedienteID);
CREATE INDEX IX_Historial_FechaAccion ON HistorialAprobaciones(FechaAccion);
```

---

## Integridad Referencial

### Cascadas Implementadas

1. **Expedientes → Indicios**: ON DELETE CASCADE
   - Si se elimina un expediente, se eliminan todos sus indicios

2. **Expedientes → HistorialAprobaciones**: ON DELETE CASCADE
   - Si se elimina un expediente, se elimina su historial

### Restricciones de Unicidad

1. `Roles.NombreRol` - UNIQUE
2. `Usuarios.Email` - UNIQUE
3. `Expedientes.NumeroExpediente` - UNIQUE
4. `CategoriasIndicios.NombreCategoria` - UNIQUE
5. `Indicios(ExpedienteID, NumeroIndicio)` - UNIQUE COMPOSITE
6. `ConfiguracionSistema.Clave` - UNIQUE

---

## Normalización

El esquema está en **Tercera Forma Normal (3FN)**:

1. ✅ **1FN**: Todos los atributos son atómicos
2. ✅ **2FN**: No hay dependencias parciales de la clave primaria
3. ✅ **3FN**: No hay dependencias transitivas

**Ejemplo de normalización aplicada:**
- Los estados de expedientes están en una tabla separada (EstadosExpediente)
- Las categorías de indicios están en una tabla separada (CategoriasIndicios)
- Los roles están en una tabla separada (Roles)
- Esto evita redundancia y facilita el mantenimiento
