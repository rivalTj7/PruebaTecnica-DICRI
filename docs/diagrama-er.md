# Diagrama Entidad-Relación (ER) - Base de Datos DICRI

## Diagrama ER

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        MODELO DE DATOS DICRI                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│      Roles          │
├─────────────────────┤
│ PK RolID           │
│    NombreRol       │──┐
│    Descripcion     │  │
│    FechaCreacion   │  │
│    Activo          │  │
└─────────────────────┘  │
                         │
                         │ 1:N
                         │
┌─────────────────────┐  │
│     Usuarios        │◄─┘
├─────────────────────┤
│ PK UsuarioID       │──┐──────────────────────┐
│ FK RolID           │  │                      │
│    NombreCompleto  │  │                      │
│    Email (UNIQUE)  │  │                      │
│    Password        │  │                      │
│    Telefono        │  │                      │
│    Cargo           │  │                      │
│    Departamento    │  │                      │
│    FechaCreacion   │  │                      │
│    UltimoAcceso    │  │                      │
│    Activo          │  │                      │
└─────────────────────┘  │                      │
                         │                      │
                         │                      │
┌─────────────────────────┐                     │
│  EstadosExpediente      │                     │
├─────────────────────────┤                     │
│ PK EstadoID            │──┐                   │
│    NombreEstado        │  │                   │
│    Descripcion         │  │                   │
│    Color               │  │                   │
│    Orden               │  │                   │
│    Activo              │  │                   │
└─────────────────────────┘  │                   │
                             │                   │
                             │ 1:N               │
                             │                   │
┌──────────────────────────┐ │                   │
│     Expedientes          │◄┘                   │
├──────────────────────────┤                     │
│ PK ExpedienteID         │──┐                   │
│ FK EstadoID             │  │                   │
│ FK TecnicoRegistraID    │◄─┘ 1:N (Técnico)    │
│ FK CoordinadorAsignadoID│◄───────────────────┘ 1:N (Coordinador)
│    NumeroExpediente     │  │
│    NumeroMP             │  │
│    TituloExpediente     │  │
│    Descripcion          │  │
│    LugarIncidente       │  │
│    FechaIncidente       │  │
│    FechaRegistro        │  │
│    FechaRevision        │  │
│    FechaAprobacion      │  │
│    JustificacionRechazo │  │
│    Prioridad            │  │
│    Observaciones        │  │
│    UltimaModificacion   │  │
│    UsuarioModificacion  │  │
└──────────────────────────┘  │
                              │
                              │ 1:N
                              │
┌─────────────────────────┐   │
│  CategoriasIndicios     │   │
├─────────────────────────┤   │
│ PK CategoriaID         │──┐ │
│    NombreCategoria     │  │ │
│    Descripcion         │  │ │
│    Activo              │  │ │
└─────────────────────────┘  │ │
                             │ │
                             │ │ 1:N
                             │ │
┌──────────────────────────┐ │ │
│       Indicios           │◄┘ │
├──────────────────────────┤   │
│ PK IndicioID            │   │
│ FK ExpedienteID         │◄──┘ 1:N
│ FK CategoriaID          │
│ FK TecnicoRegistraID    │
│    NumeroIndicio        │
│    NombreObjeto         │
│    Descripcion          │
│    Color                │
│    TamanoAlto           │
│    TamanoAncho          │
│    TamanoLargo          │
│    UnidadMedida         │
│    Peso                 │
│    UnidadPeso           │
│    UbicacionHallazgo    │
│    LatitudGPS           │
│    LongitudGPS          │
│    EstadoConservacion   │
│    FechaRecoleccion     │
│    FechaRegistro        │
│    RutaFotografia       │
│    Observaciones        │
└──────────────────────────┘


┌──────────────────────────────┐
│   HistorialAprobaciones      │
├──────────────────────────────┤
│ PK HistorialID              │
│ FK ExpedienteID             │───┐
│ FK EstadoAnterior           │   │ N:1
│ FK EstadoNuevo              │   │
│ FK UsuarioID                │   │
│    Accion                   │   │
│    Comentarios              │   │
│    FechaAccion              │   │
└──────────────────────────────┘   │
                                   │
                                   │
                    ┌──────────────▼──────────────┐
                    │      (Referencia a         │
                    │       Expedientes)         │
                    └────────────────────────────┘


┌──────────────────────────────┐
│    AuditoriaCambios          │
├──────────────────────────────┤
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
└──────────────────────────────┘


┌──────────────────────────────┐
│   ConfiguracionSistema       │
├──────────────────────────────┤
│ PK ConfigID                 │
│    Clave (UNIQUE)           │
│    Valor                    │
│    Descripcion              │
│    TipoDato                 │
│    FechaModificacion        │
└──────────────────────────────┘
```

## Descripción de Entidades

### 1. Roles
**Propósito**: Definir los roles de usuario en el sistema.

**Atributos**:
- `RolID` (PK): Identificador único del rol
- `NombreRol`: Nombre del rol (Administrador, Coordinador, Técnico)
- `Descripcion`: Descripción del rol
- `FechaCreacion`: Fecha de creación del registro
- `Activo`: Indicador de estado activo/inactivo

**Valores Predefinidos**:
1. Administrador: Acceso completo al sistema
2. Coordinador: Revisión y aprobación de expedientes
3. Técnico: Registro de expedientes e indicios

### 2. Usuarios
**Propósito**: Almacenar información de los usuarios del sistema.

**Atributos**:
- `UsuarioID` (PK): Identificador único del usuario
- `RolID` (FK): Relación con Roles
- `NombreCompleto`: Nombre completo del usuario
- `Email`: Email único para autenticación
- `Password`: Contraseña hasheada (bcrypt)
- `Telefono`: Número de teléfono
- `Cargo`: Cargo del usuario
- `Departamento`: Departamento al que pertenece
- `FechaCreacion`: Fecha de creación del usuario
- `UltimoAcceso`: Última fecha de inicio de sesión
- `Activo`: Estado del usuario

**Índices**:
- UNIQUE: Email
- INDEX: RolID

### 3. EstadosExpediente
**Propósito**: Catálogo de estados del workflow de expedientes.

**Atributos**:
- `EstadoID` (PK): Identificador único del estado
- `NombreEstado`: Nombre del estado
- `Descripcion`: Descripción del estado
- `Color`: Color para UI (HEX)
- `Orden`: Orden de visualización
- `Activo`: Estado activo/inactivo

**Estados Predefinidos**:
1. Borrador (#9E9E9E): Expediente en creación
2. En Revisión (#2196F3): Enviado a coordinador
3. Aprobado (#4CAF50): Expediente aprobado
4. Rechazado (#F44336): Expediente rechazado

### 4. Expedientes
**Propósito**: Registro principal de expedientes criminalísticos.

**Atributos**:
- `ExpedienteID` (PK): Identificador único
- `EstadoID` (FK): Estado actual del expediente
- `TecnicoRegistraID` (FK): Usuario técnico que registra
- `CoordinadorAsignadoID` (FK): Coordinador asignado
- `NumeroExpediente`: Número único del expediente
- `NumeroMP`: Número del Ministerio Público
- `TituloExpediente`: Título descriptivo
- `Descripcion`: Descripción detallada
- `LugarIncidente`: Ubicación del incidente
- `FechaIncidente`: Fecha y hora del incidente
- `FechaRegistro`: Fecha de registro en sistema
- `FechaRevision`: Fecha de revisión
- `FechaAprobacion`: Fecha de aprobación
- `JustificacionRechazo`: Justificación si es rechazado
- `Prioridad`: Nivel de prioridad (Baja, Normal, Alta, Crítica)
- `Observaciones`: Notas adicionales
- `UltimaModificacion`: Fecha de última modificación
- `UsuarioModificacion`: Usuario que modificó

**Índices**:
- UNIQUE: NumeroExpediente
- INDEX: EstadoID, TecnicoRegistraID, FechaRegistro

**Reglas de Negocio**:
- Un expediente debe tener al menos un indicio para enviar a revisión
- Solo técnicos pueden crear expedientes
- Solo coordinadores pueden aprobar/rechazar
- Rechazos requieren justificación obligatoria

### 5. CategoriasIndicios
**Propósito**: Clasificación de tipos de indicios/evidencias.

**Atributos**:
- `CategoriaID` (PK): Identificador único
- `NombreCategoria`: Nombre de la categoría
- `Descripcion`: Descripción de la categoría
- `Activo`: Estado activo/inactivo

**Categorías Predefinidas**:
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

### 6. Indicios
**Propósito**: Registro detallado de evidencias recolectadas.

**Atributos**:
- `IndicioID` (PK): Identificador único
- `ExpedienteID` (FK): Expediente al que pertenece
- `CategoriaID` (FK): Categoría del indicio
- `TecnicoRegistraID` (FK): Técnico que registra
- `NumeroIndicio`: Número único dentro del expediente
- `NombreObjeto`: Nombre del objeto/evidencia
- `Descripcion`: Descripción detallada
- `Color`: Color del objeto
- `TamanoAlto, TamanoAncho, TamanoLargo`: Dimensiones
- `UnidadMedida`: Unidad de medida (cm, m, etc.)
- `Peso`: Peso del objeto
- `UnidadPeso`: Unidad de peso (g, kg, etc.)
- `UbicacionHallazgo`: Ubicación donde se encontró
- `LatitudGPS, LongitudGPS`: Coordenadas GPS
- `EstadoConservacion`: Estado de la evidencia
- `FechaRecoleccion`: Fecha de recolección
- `FechaRegistro`: Fecha de registro en sistema
- `RutaFotografia`: Ruta de fotografía del indicio
- `Observaciones`: Notas adicionales

**Índices**:
- INDEX: ExpedienteID, NumeroIndicio
- UNIQUE: (ExpedienteID, NumeroIndicio)

**Reglas de Negocio**:
- Un indicio pertenece a un solo expediente
- El número de indicio debe ser único dentro del expediente
- La eliminación de un expediente elimina sus indicios (CASCADE)

### 7. HistorialAprobaciones
**Propósito**: Trazabilidad completa del workflow de aprobación.

**Atributos**:
- `HistorialID` (PK): Identificador único
- `ExpedienteID` (FK): Expediente relacionado
- `EstadoAnterior` (FK): Estado previo
- `EstadoNuevo` (FK): Nuevo estado
- `UsuarioID` (FK): Usuario que realizó la acción
- `Accion`: Tipo de acción realizada
- `Comentarios`: Comentarios del usuario
- `FechaAccion`: Fecha y hora de la acción

**Acciones Posibles**:
- Creación de Expediente
- Enviar a Revisión
- Aprobar
- Rechazar
- Devolver a Borrador
- Corregir

**Índices**:
- INDEX: ExpedienteID, FechaAccion

### 8. AuditoriaCambios
**Propósito**: Auditoría de todas las modificaciones en el sistema.

**Atributos**:
- `AuditoriaID` (PK): Identificador único
- `NombreTabla`: Tabla modificada
- `RegistroID`: ID del registro modificado
- `TipoOperacion`: INSERT, UPDATE, DELETE
- `UsuarioID`: Usuario que realizó la operación
- `CamposModificados`: Campos que cambiaron
- `ValoresAnteriores`: Valores previos
- `ValoresNuevos`: Valores nuevos
- `FechaOperacion`: Fecha y hora
- `DireccionIP`: IP del cliente

### 9. ConfiguracionSistema
**Propósito**: Configuraciones del sistema.

**Atributos**:
- `ConfigID` (PK): Identificador único
- `Clave`: Clave única de configuración
- `Valor`: Valor de la configuración
- `Descripcion`: Descripción
- `TipoDato`: Tipo de dato (string, number, boolean)
- `FechaModificacion`: Última modificación

## Relaciones

### Uno a Muchos (1:N)

1. **Roles → Usuarios**
   - Un rol puede tener muchos usuarios
   - Un usuario pertenece a un solo rol

2. **Usuarios → Expedientes (Técnico)**
   - Un técnico puede registrar muchos expedientes
   - Un expediente es registrado por un técnico

3. **Usuarios → Expedientes (Coordinador)**
   - Un coordinador puede revisar muchos expedientes
   - Un expediente es revisado por un coordinador

4. **EstadosExpediente → Expedientes**
   - Un estado puede aplicar a muchos expedientes
   - Un expediente tiene un solo estado en un momento

5. **Expedientes → Indicios**
   - Un expediente puede tener muchos indicios
   - Un indicio pertenece a un solo expediente

6. **CategoriasIndicios → Indicios**
   - Una categoría puede tener muchos indicios
   - Un indicio pertenece a una categoría

7. **Expedientes → HistorialAprobaciones**
   - Un expediente puede tener muchos registros de historial
   - Un registro de historial pertenece a un expediente

## Integridad Referencial

### Foreign Keys con CASCADE
- `Indicios.ExpedienteID` → `Expedientes.ExpedienteID` (ON DELETE CASCADE)
- `HistorialAprobaciones.ExpedienteID` → `Expedientes.ExpedienteID` (ON DELETE CASCADE)

### Foreign Keys sin CASCADE
- `Usuarios.RolID` → `Roles.RolID`
- `Expedientes.EstadoID` → `EstadosExpediente.EstadoID`
- `Expedientes.TecnicoRegistraID` → `Usuarios.UsuarioID`
- `Expedientes.CoordinadorAsignadoID` → `Usuarios.UsuarioID`
- `Indicios.CategoriaID` → `CategoriasIndicios.CategoriaID`
- `Indicios.TecnicoRegistraID` → `Usuarios.UsuarioID`

## Normalización

La base de datos está en **Tercera Forma Normal (3NF)**:

1. **1NF**: Todos los atributos son atómicos
2. **2NF**: No hay dependencias parciales
3. **3NF**: No hay dependencias transitivas

Beneficios:
- Eliminación de redundancia
- Integridad de datos
- Facilidad de mantenimiento
- Consistencia de datos

---

**Desarrollado para DICRI - Ministerio Público de Guatemala**
