# Documentación - Sistema de Gestión de Evidencias DICRI

## Índice de Documentación

### 📚 Documentos Principales

1. **[Manual Técnico](manual-tecnico.md)**
   - Instalación y configuración
   - Estructura del código
   - Ejemplos de implementación
   - Guía de desarrollo

2. **[Arquitectura del Sistema](arquitectura.md)**
   - Diagrama de arquitectura completo
   - Descripción de capas
   - Flujo de datos
   - Tecnologías utilizadas
   - Patrones de diseño

3. **[Diagrama Entidad-Relación](diagrama-er.md)**
   - Modelo de datos completo
   - Descripción de todas las tablas
   - Relaciones entre entidades
   - Reglas de negocio
   - Normalización

### 📋 Documentos Adicionales

- **README.md** (raíz del proyecto): Guía de inicio rápido
- **API Documentation**: http://localhost:5000/api-docs (Swagger)

---

## Resumen Ejecutivo

### ¿Qué es este sistema?

El Sistema de Gestión de Evidencias DICRI es una aplicación web completa para el registro, seguimiento y aprobación de expedientes criminalisticos y sus evidencias (indicios).

### Características Principales

#### 🔐 Autenticación y Seguridad
- Login con email y contraseña
- JWT tokens (access + refresh)
- Control de acceso basado en roles
- Encriptación de contraseñas con bcrypt

#### 📁 Gestión de Expedientes
- Crear, editar, listar y ver expedientes
- Estados: Borrador, En Revisión, Aprobado, Rechazado
- Asignación de prioridades
- Búsqueda y filtrado avanzado

#### 🔍 Gestión de Indicios
- Registro detallado de evidencias
- Información física: tamaño, peso, color
- Ubicación geográfica (GPS)
- Múltiples indicios por expediente

#### ✅ Sistema de Aprobación
- Workflow de revisión
- Aprobación por coordinadores
- Rechazo con justificación obligatoria
- Historial completo de cambios

#### 📊 Reportes y Estadísticas
- Dashboard con métricas principales
- Gráficos interactivos
- Reportes por fechas y filtros
- Análisis de productividad

### Roles de Usuario

1. **Administrador**
   - Acceso completo al sistema
   - Gestión de usuarios
   - Todas las funcionalidades

2. **Coordinador**
   - Revisión de expedientes
   - Aprobación/rechazo
   - Visualización de reportes

3. **Técnico**
   - Creación de expedientes
   - Registro de indicios
   - Envío a revisión

---

## Stack Tecnológico

### Frontend
```
React 18.2.0
├── Material-UI 5.15.3     (UI Components)
├── Recharts 2.10.3        (Gráficos)
├── Axios 1.6.5            (HTTP Client)
├── React Router 6.21.1    (Routing)
└── Vite 5.0.11            (Build Tool)
```

### Backend
```
Node.js 18+
├── Express 4.18.2         (Framework)
├── JWT 9.0.2              (Authentication)
├── bcryptjs 2.4.3         (Password Hashing)
├── mssql 10.0.1           (SQL Server Driver)
├── Swagger 5.0.0          (API Documentation)
└── Jest 29.7.0            (Testing)
```

### Base de Datos
```
SQL Server 2022 Express
├── Stored Procedures      (Lógica de negocio)
├── Triggers               (Auditoría)
└── Indexes                (Optimización)
```

### DevOps
```
Docker Compose
├── Frontend Container     (Node.js + Vite)
├── Backend Container      (Node.js + Express)
└── Database Container     (SQL Server)
```

---

## Estructura del Proyecto

```
PruebaTecnicaDS/
│
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios API
│   │   ├── contexts/        # Context API
│   │   └── main.jsx         # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── config/          # Configuración
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middleware/      # Middleware
│   │   ├── routes/          # Rutas API
│   │   ├── __tests__/       # Pruebas unitarias
│   │   └── index.js         # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── database/                 # Scripts SQL
│   ├── schema.sql           # Estructura de tablas
│   ├── stored-procedures.sql
│   └── seed-data.sql        # Datos iniciales
│
├── docs/                     # Documentación
│   ├── README.md            # Este archivo
│   ├── manual-tecnico.md
│   ├── arquitectura.md
│   └── diagrama-er.md
│
├── docker-compose.yml        # Orquestación Docker
├── .gitignore
└── README.md                 # Guía de inicio rápido
```

---

## Inicio Rápido

### 1. Clonar y Configurar
```bash
git clone <repository-url>
cd PruebaTecnicaDS
```

### 2. Iniciar con Docker
```bash
docker-compose up -d
```

### 3. Acceder
- Frontend: http://localhost:3000
- API Docs: http://localhost:5000/api-docs

### 4. Credenciales de Prueba
```
Técnico:
  Email: tecnico@mp.gob.gt
  Password: Password123!

Coordinador:
  Email: coordinador@mp.gob.gt
  Password: Password123!

Administrador:
  Email: admin@mp.gob.gt
  Password: Password123!
```

---

## Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/profile` - Obtener perfil

### Expedientes
- `GET /api/expedientes` - Listar expedientes
- `POST /api/expedientes` - Crear expediente
- `GET /api/expedientes/:id` - Obtener expediente
- `PUT /api/expedientes/:id` - Actualizar expediente
- `POST /api/expedientes/:id/enviar-revision` - Enviar a revisión

### Indicios
- `GET /api/indicios/expediente/:id` - Listar indicios
- `POST /api/indicios/expediente/:id` - Crear indicio
- `PUT /api/indicios/:id` - Actualizar indicio
- `DELETE /api/indicios/:id` - Eliminar indicio

### Aprobaciones
- `GET /api/aprobaciones/pendientes` - Listar pendientes
- `POST /api/aprobaciones/:id/aprobar` - Aprobar expediente
- `POST /api/aprobaciones/:id/rechazar` - Rechazar expediente
- `GET /api/aprobaciones/historial` - Ver historial

### Reportes
- `GET /api/reportes/dashboard` - Dashboard
- `GET /api/reportes/estadisticas` - Estadísticas
- `GET /api/reportes/productividad` - Productividad
- `GET /api/reportes/tendencias` - Tendencias

---

## Seguridad

### Medidas Implementadas
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ JWT con expiración
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Helmet para headers HTTP
- ✅ Validación de inputs
- ✅ SQL Injection prevention (SPs)
- ✅ XSS protection
- ✅ HTTPS ready

---

## Testing

### Backend
```bash
cd backend
npm test
```

### Coverage
- Autenticación: ✅
- Expedientes: ✅
- Indicios: ✅
- Validaciones: ✅

---

## Soporte

Para más información, consultar:
- **Manual Técnico**: Guía completa de desarrollo
- **Arquitectura**: Diseño del sistema
- **Diagrama ER**: Modelo de datos
- **Swagger**: http://localhost:5000/api-docs

---

## Contacto

**DICRI - Ministerio Público de Guatemala**
Tel: 23160000 Ext.10510
Email: info@mp.gob.gt

---

**© 2024 Ministerio Público de Guatemala - DICRI**
