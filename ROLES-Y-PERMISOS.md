# 🔐 Sistema de Roles y Permisos - DICRI

## 📋 Resumen de Roles

El sistema DICRI maneja **3 roles principales**:

1. **Técnico** - Personal operativo que crea y gestiona expedientes
2. **Coordinador** - Supervisor que revisa y aprueba expedientes
3. **Administrador** - Control total del sistema

---

## 👤 ROL: TÉCNICO

### ✅ **PUEDE:**

#### **Expedientes**
- ✅ **Crear** expedientes nuevos (estado: Borrador)
- ✅ **Ver** lista de todos los expedientes
- ✅ **Ver** detalles de cualquier expediente
- ✅ **Editar** expedientes en estado "Borrador" (solo los propios)
- ✅ **Enviar a Revisión** expedientes propios (si tienen al menos 1 indicio)
- ✅ **Ver** expedientes rechazados para corregir

#### **Indicios**
- ✅ **Crear** indicios en expedientes propios (solo en Borrador)
- ✅ **Ver** indicios de cualquier expediente
- ✅ **Editar** indicios en expedientes propios (solo en Borrador)
- ✅ **Eliminar** indicios en expedientes propios (solo en Borrador)

#### **Reportes**
- ✅ **Ver Dashboard** - Estadísticas generales
- ✅ **Ver Estadísticas** - Con filtros de fecha
- ✅ **Ver Reporte de Expedientes** - Filtros por estado, fecha, prioridad
- ✅ **Ver Tendencias** - Gráficos mensuales
- ❌ **NO VER Productividad** - Solo Coordinador/Admin

#### **Perfil**
- ✅ **Ver** su información personal
- ✅ **Cambiar** su contraseña

### ❌ **NO PUEDE:**

- ❌ Editar expedientes de otros técnicos
- ❌ Editar expedientes en "Revisión", "Aprobado" o "Rechazado"
- ❌ Aprobar o rechazar expedientes
- ❌ Ver reportes de productividad de técnicos
- ❌ Eliminar expedientes
- ❌ Gestionar usuarios

---

## 👔 ROL: COORDINADOR

### ✅ **PUEDE:**

#### **Expedientes**
- ✅ **Ver** lista de todos los expedientes
- ✅ **Ver** detalles de cualquier expediente
- ❌ **NO Crear** expedientes (no es parte de su rol)
- ❌ **NO Editar** expedientes directamente

#### **Aprobaciones** (PRINCIPAL FUNCIÓN)
- ✅ **Ver** expedientes pendientes de revisión
- ✅ **Aprobar** expedientes en revisión
- ✅ **Rechazar** expedientes (con justificación obligatoria)
- ✅ **Devolver a Borrador** expedientes para correcciones
- ✅ **Ver Historial** de aprobaciones/rechazos

#### **Indicios**
- ✅ **Ver** indicios de cualquier expediente
- ❌ **NO Crear/Editar/Eliminar** indicios

#### **Reportes**
- ✅ **Ver Dashboard** - Estadísticas generales
- ✅ **Ver Estadísticas** - Con filtros
- ✅ **Ver Reporte de Expedientes** - Todos los filtros
- ✅ **Ver Productividad** - Desempeño de técnicos ⭐
- ✅ **Ver Tendencias** - Gráficos mensuales

#### **Perfil**
- ✅ **Ver** su información personal
- ✅ **Cambiar** su contraseña

### ❌ **NO PUEDE:**

- ❌ Crear expedientes
- ❌ Crear/editar/eliminar indicios
- ❌ Eliminar expedientes
- ❌ Gestionar usuarios

---

## 👨‍💼 ROL: ADMINISTRADOR

### ✅ **PUEDE TODO:**

#### **Expedientes**
- ✅ **Crear** expedientes
- ✅ **Ver** todos los expedientes
- ✅ **Editar** cualquier expediente
- ✅ **Eliminar** expedientes ⭐ (único rol)
- ✅ **Enviar a Revisión** expedientes

#### **Indicios**
- ✅ **Crear** indicios en cualquier expediente
- ✅ **Ver** todos los indicios
- ✅ **Editar** cualquier indicio
- ✅ **Eliminar** cualquier indicio

#### **Aprobaciones**
- ✅ **Aprobar** expedientes
- ✅ **Rechazar** expedientes
- ✅ **Devolver a Borrador** expedientes
- ✅ **Ver Historial** completo

#### **Reportes**
- ✅ **Ver Dashboard**
- ✅ **Ver Estadísticas**
- ✅ **Ver Reporte de Expedientes**
- ✅ **Ver Productividad** de técnicos
- ✅ **Ver Tendencias**

#### **Usuarios** (si existiera el módulo)
- ✅ Gestión completa de usuarios
- ✅ Asignar roles
- ✅ Activar/desactivar cuentas

---

## 🔄 Flujo de Estados de Expediente

```
1. BORRADOR (Técnico)
   ↓ [Técnico agrega indicios]
   ↓ [Técnico: "Enviar a Revisión"]

2. EN REVISIÓN (Coordinador/Admin)
   ↓ [Coordinador revisa]
   ├─→ APROBADO ✅ [FIN]
   ├─→ RECHAZADO ❌ [FIN con justificación]
   └─→ BORRADOR 🔄 [Devolver para correcciones]
```

---

## 📊 Matriz de Permisos

| Acción | Técnico | Coordinador | Admin |
|--------|---------|-------------|-------|
| **EXPEDIENTES** |
| Crear expediente | ✅ | ❌ | ✅ |
| Ver expedientes | ✅ | ✅ | ✅ |
| Editar expediente propio (Borrador) | ✅ | ❌ | ✅ |
| Editar cualquier expediente | ❌ | ❌ | ✅ |
| Eliminar expediente | ❌ | ❌ | ✅ |
| Enviar a revisión | ✅ | ❌ | ✅ |
| **INDICIOS** |
| Crear indicio en expediente propio | ✅ | ❌ | ✅ |
| Ver indicios | ✅ | ✅ | ✅ |
| Editar indicio propio (Borrador) | ✅ | ❌ | ✅ |
| Eliminar indicio propio (Borrador) | ✅ | ❌ | ✅ |
| **APROBACIONES** |
| Ver pendientes | ❌ | ✅ | ✅ |
| Aprobar expediente | ❌ | ✅ | ✅ |
| Rechazar expediente | ❌ | ✅ | ✅ |
| Devolver a borrador | ❌ | ✅ | ✅ |
| Ver historial | ✅ | ✅ | ✅ |
| **REPORTES** |
| Dashboard | ✅ | ✅ | ✅ |
| Estadísticas | ✅ | ✅ | ✅ |
| Reporte expedientes | ✅ | ✅ | ✅ |
| Productividad técnicos | ❌ | ✅ | ✅ |
| Tendencias | ✅ | ✅ | ✅ |

---

## 🛡️ Validaciones de Seguridad

### Backend (API)
- ✅ **JWT Token** obligatorio en todos los endpoints
- ✅ **Middleware auth()** verifica roles en cada ruta
- ✅ **Validación de propiedad** en controllers (ej: solo editar expedientes propios)

### Frontend (UI)
- ✅ **AuthContext** con método `hasRole()`
- ✅ **Ocultación de botones** según permisos
- ✅ **Redirección** si intenta acceder sin permisos
- ✅ **Validación en formularios** según rol

---

## 🔑 Endpoints y Permisos

### Expedientes (`/api/expedientes`)
```javascript
POST   /                    → Técnico, Admin
GET    /                    → Todos autenticados
GET    /:id                 → Todos autenticados
PUT    /:id                 → Técnico (propio), Admin
DELETE /:id                 → Solo Admin
POST   /:id/enviar-revision → Técnico (propio), Admin
```

### Indicios (`/api/indicios`)
```javascript
POST   /expediente/:id      → Técnico (propio), Admin
GET    /expediente/:id      → Todos autenticados
GET    /:id                 → Todos autenticados
PUT    /:id                 → Técnico (propio), Admin
DELETE /:id                 → Técnico (propio), Admin
```

### Aprobaciones (`/api/aprobaciones`)
```javascript
GET    /pendientes          → Coordinador, Admin
POST   /:id/aprobar         → Coordinador, Admin
POST   /:id/rechazar        → Coordinador, Admin
POST   /:id/devolver        → Coordinador, Admin
GET    /historial           → Todos autenticados
```

### Reportes (`/api/reportes`)
```javascript
GET    /dashboard           → Todos autenticados
GET    /estadisticas        → Todos autenticados
GET    /expedientes         → Todos autenticados
GET    /productividad       → Coordinador, Admin
GET    /tendencias          → Todos autenticados
```

---

## 📝 Reglas de Negocio Importantes

1. **Expediente en Borrador:**
   - Solo el técnico creador puede editarlo
   - Solo puede enviarse a revisión si tiene ≥1 indicio

2. **Expediente en Revisión:**
   - No se puede editar
   - Solo Coordinador/Admin pueden aprobar/rechazar

3. **Expediente Aprobado:**
   - Estado final, no se puede modificar
   - Solo se puede visualizar

4. **Expediente Rechazado:**
   - Requiere justificación obligatoria
   - El técnico puede ver la justificación
   - Estado final, no se puede modificar

5. **Reporte de Productividad:**
   - Solo Coordinador/Admin
   - Muestra: expedientes creados, aprobados, rechazados por técnico

---

## 🚀 Cómo Verificar Permisos

### En el Frontend:
```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, hasRole } = useAuth();

// Verificar un rol específico
if (hasRole('Coordinador')) {
  // Mostrar botón de aprobar
}

// Verificar múltiples roles
if (hasRole('Coordinador', 'Administrador')) {
  // Mostrar reporte de productividad
}
```

### En el Backend:
```javascript
// En las rutas
router.post('/', auth('Técnico', 'Administrador'), crearExpediente);

// En los controllers (validación adicional)
if (expediente.TecnicoRegistraID !== req.user.usuarioID && req.user.nombreRol !== 'Administrador') {
  return res.status(403).json({ error: 'Sin permisos' });
}
```

---

## ✅ Estado Actual del Sistema

### ✅ Implementado:
- ✅ Autenticación JWT
- ✅ Middleware de roles
- ✅ Permisos en todas las rutas
- ✅ Validación en controllers
- ✅ Frontend oculta botones según rol
- ✅ Validación de propiedad de expedientes

### 🔧 Puede Mejorar:
- ⚠️ Validación más estricta de propiedad en actualizaciones
- ⚠️ Logs de auditoría de cambios de permisos
- ⚠️ Módulo de gestión de usuarios (Admin)

---

**Documento generado:** 2025-11-21
**Sistema:** DICRI - Ministerio Público de Guatemala
**Versión:** 1.0
