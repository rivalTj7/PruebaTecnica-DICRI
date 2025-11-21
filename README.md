# 🏛️ DICRI - Sistema de Gestión de Evidencias

Sistema integral para la gestión de evidencias criminalísticas desarrollado para la Dirección de Investigación Criminalística (DICRI) del Ministerio Público de Guatemala.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Deployment a Producción](#-deployment-a-producción)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Roles y Permisos](#-roles-y-permisos)
- [Flujo de Aprobación](#-flujo-de-aprobación)
- [Pruebas](#-pruebas)
- [Mantenimiento](#-mantenimiento)
- [Documentación Adicional](#-documentación-adicional)

---

## 📖 Descripción

El Sistema de Gestión de Evidencias DICRI es una aplicación web diseñada para optimizar el proceso de registro, seguimiento y aprobación de expedientes criminalísticos e indicios recolectados en escenas de investigación.

### Problema que Resuelve

✅ Registro digital rápido y eficiente de evidencias
✅ Trazabilidad completa del proceso de aprobación
✅ Generación automática de reportes estadísticos
✅ Control de acceso basado en roles
✅ Auditoría completa de todas las operaciones

---

## ⚡ Características Principales

### 1. Gestión de Expedientes
- Registro de expedientes con datos generales (Número MP, título, descripción, lugar, fecha de incidente)
- Asignación automática de número de expediente (DICRI-YYYY-XXXXX)
- Seguimiento de estados (Borrador → En Revisión → Aprobado/Rechazado)
- Historial completo de cambios con trazabilidad de usuarios
- Búsqueda y filtros avanzados

### 2. Gestión de Indicios
- Registro detallado de evidencias físicas
- Descripción completa: color, tamaño (alto/ancho/largo), peso
- Ubicación GPS del hallazgo (latitud/longitud)
- Categorización (Arma de Fuego, Arma Blanca, Documentos, Electrónica, etc.)
- Fotografías de evidencia
- Estado de conservación
- Vinculación con expedientes

### 3. Flujo de Aprobación
- Envío de expedientes a revisión por parte de técnicos
- Aprobación o rechazo por coordinadores
- Justificación obligatoria para rechazos
- Notificaciones de cambios de estado
- Auditoría completa con HistorialAprobaciones

### 4. Reportes y Estadísticas
- Dashboard interactivo con métricas en tiempo real
- Total de expedientes por estado
- Reportes filtrados por rango de fechas
- Estadísticas por técnico y coordinador
- Gráficos visuales

### 5. Seguridad
- Autenticación con JWT (Access Token + Refresh Token)
- Contraseñas hasheadas con bcrypt (10 rounds)
- Control de acceso basado en roles (RBAC)
- Rate limiting para prevenir ataques de fuerza bruta
- Headers de seguridad con Helmet
- Protección contra SQL injection (Stored Procedures)
- CORS configurado correctamente

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Framework UI |
| Vite | 5.x | Build tool |
| React Router | 6.x | Routing |
| Axios | 1.x | HTTP Client |
| Tailwind CSS | 3.x | Estilos |
| Lucide React | Latest | Iconos |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18.x | Runtime |
| Express | 4.x | Framework |
| jsonwebtoken | 9.x | JWT Auth |
| bcryptjs | 2.x | Hash |
| mssql | 10.x | SQL Driver |
| Swagger UI | 5.x | API Docs |
| Helmet | 7.x | Security |
| Morgan | 1.x | Logging |
| CORS | 2.x | CORS |

### Base de Datos
- **SQL Server 2022**: Base de datos relacional
- **Stored Procedures**: Toda la lógica de datos

### DevOps
- **Docker**: Containerización
- **Docker Compose**: Orquestación

### Testing
- **Jest**: Unit tests
- **Supertest**: API testing

---

## 📦 Requisitos Previos

- ✅ Docker Desktop (v20+)
- ✅ Docker Compose (v2+)
- ✅ Git
- ✅ 8GB RAM mínimo
- ✅ 10GB espacio en disco

### Puertos Necesarios
- `3001` - Frontend
- `5001` - Backend
- `1433` - SQL Server

---

## 🚀 Instalación

### 1. Clonar Repositorio

```bash
git clone https://github.com/rivalTj7/PruebaTecnicaDS.git
cd PruebaTecnicaDS
```

### 2. Levantar Servicios con Docker

```bash
# Construir y levantar todos los contenedores
docker-compose up -d --build

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 3. Verificar Instalación

Una vez iniciados los servicios, accede a:

- ✅ **Frontend**: http://localhost:3001
- ✅ **Backend API**: http://localhost:5001
- ✅ **Swagger Docs**: http://localhost:5001/api-docs
- ✅ **Health Check**: http://localhost:5001/health

### 4. Usuarios de Prueba

El sistema viene con usuarios precargados:

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | admin@mp.gob.gt | Password123! |
| **Coordinador** | coordinador@mp.gob.gt | Password123! |
| **Técnico** | tecnico@mp.gob.gt | Password123! |
| **Técnico 2** | tecnico2@mp.gob.gt | Password123! |
| **Técnico 3** | tecnico3@mp.gob.gt | Password123! |

---

## 💻 Uso

### Flujo Completo: Técnico → Coordinador

#### Paso 1: Login como Técnico

1. Abre http://localhost:3001
2. Email: `tecnico@mp.gob.gt`
3. Contraseña: `Password123!`
4. Click en "Iniciar Sesión"

#### Paso 2: Crear Expediente

1. En el Dashboard, click "Nuevo Expediente"
2. Llenar datos:
   - **Número MP**: MP001-2024-12345
   - **Título**: Investigación de Robo Agravado
   - **Descripción**: Descripción del caso
   - **Lugar**: Zona 1, Ciudad de Guatemala
   - **Fecha del Incidente**: Seleccionar fecha
   - **Prioridad**: Alta/Normal/Baja
3. Click "Guardar Expediente"

#### Paso 3: Agregar Indicios

1. Entrar al expediente recién creado
2. Click "Agregar Indicio"
3. Llenar datos:
   - **Número de Indicio**: IND-001
   - **Categoría**: Arma Blanca
   - **Nombre**: Cuchillo de cocina
   - **Descripción**: Cuchillo con mango negro
   - **Color**: Negro/Plateado
   - **Dimensiones**: Alto, Ancho, Largo (en cm)
   - **Peso**: En gramos
   - **Ubicación del Hallazgo**: Cocina del establecimiento
   - **GPS**: Opcional (latitud, longitud)
   - **Estado de Conservación**: Bueno/Regular/Malo
   - **Fecha de Recolección**: Seleccionar fecha
4. Click "Guardar Indicio"
5. Repetir para agregar más indicios

#### Paso 4: Enviar a Revisión

1. Una vez agregados todos los indicios
2. Click en "Enviar a Revisión"
3. Confirmar
4. El expediente cambia a estado "En Revisión"

#### Paso 5: Login como Coordinador

1. Cerrar sesión
2. Email: `coordinador@mp.gob.gt`
3. Contraseña: `Password123!`

#### Paso 6: Revisar y Aprobar/Rechazar

1. Ir a menú "Aprobaciones"
2. Ver lista de expedientes en revisión
3. Entrar al expediente
4. Revisar todos los indicios

**Opción A: Aprobar**
1. Click "Aprobar Expediente"
2. Confirmar
3. Expediente pasa a estado "Aprobado" (finalizado)

**Opción B: Rechazar**
1. Click "Rechazar Expediente"
2. Ingresar justificación (obligatorio)
3. Confirmar
4. Expediente vuelve a "Borrador" para correcciones

---

## 🚀 Deployment a Producción

El sistema está configurado para deployment automático en Railway.app con CI/CD completo.

### Quick Start - Deployment

1. **Crear cuenta en Railway**: https://railway.app
2. **Conectar repositorio GitHub**
3. **Railway detectará Docker Compose automáticamente**
4. **Configurar variables de entorno** (ver `.env.production.example`)
5. **Deploy automático** en cada push a `main`

Para instrucciones detalladas paso a paso, consulta **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### CI/CD Pipeline

GitHub Actions ejecuta automáticamente en cada push:
- ✅ Tests del backend (Jest + Supertest)
- ✅ Lint del código (ESLint)
- ✅ Build del frontend (Vite)
- ✅ Validación de Docker images

Ver workflow completo en `.github/workflows/ci.yml`.

---

## 📁 Estructura del Proyecto

```
PruebaTecnicaDS/
│
├── frontend/                    # React App (Puerto 3001)
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Layout.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Manejo de autenticación
│   │   ├── pages/               # Páginas principales
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expedientes.jsx
│   │   │   ├── NuevoExpediente.jsx
│   │   │   ├── ExpedienteDetalle.jsx
│   │   │   ├── Aprobaciones.jsx
│   │   │   ├── Reportes.jsx
│   │   │   └── Perfil.jsx
│   │   ├── services/            # API calls
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   └── ...
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
│
├── backend/                     # Node.js API (Puerto 5001)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # SQL Server connection
│   │   │   └── migrate.js       # DB migrations
│   │   ├── controllers/         # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── expedientes.controller.js
│   │   │   ├── indicios.controller.js
│   │   │   ├── aprobaciones.controller.js
│   │   │   ├── reportes.controller.js
│   │   │   └── usuarios.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── expedientes.routes.js
│   │   │   ├── indicios.routes.js
│   │   │   ├── aprobaciones.routes.js
│   │   │   ├── reportes.routes.js
│   │   │   └── usuarios.routes.js
│   │   ├── __tests__/           # Unit tests
│   │   │   ├── auth.test.js
│   │   │   └── expedientes.test.js
│   │   └── index.js
│   ├── uploads/                 # Archivos subidos
│   ├── Dockerfile
│   └── package.json
│
├── database/                    # SQL Server scripts
│   ├── schema.sql               # Tablas y constraints
│   ├── stored-procedures.sql    # Stored Procedures
│   └── seed-data.sql            # Datos iniciales
│
├── docker-compose.yml           # Orquestación Docker
├── ARQUITECTURA.md              # Diagrama de arquitectura
├── DIAGRAMA-ER.md               # Diagrama ER de BD
├── README.md                    # Este archivo
├── generate-hash.js             # Script para generar hashes
└── update-passwords.sql         # Script para actualizar passwords
```

---

## 📚 API Documentation

### Acceso a Swagger

La documentación interactiva de la API está disponible en:

**URL**: http://localhost:5001/api-docs

### Endpoints Principales

#### Autenticación (`/api/auth`)
```
POST   /api/auth/login           - Iniciar sesión
POST   /api/auth/refresh         - Refrescar token
GET    /api/auth/profile         - Obtener perfil del usuario
PUT    /api/auth/change-password - Cambiar contraseña
```

#### Expedientes (`/api/expedientes`)
```
GET    /api/expedientes                      - Listar todos
GET    /api/expedientes/:id                  - Obtener por ID
POST   /api/expedientes                      - Crear nuevo
PUT    /api/expedientes/:id                  - Actualizar
DELETE /api/expedientes/:id                  - Eliminar
GET    /api/expedientes/numero/:numero       - Buscar por número
```

#### Indicios (`/api/indicios`)
```
GET    /api/indicios/expediente/:expedienteId - Listar por expediente
GET    /api/indicios/:id                      - Obtener por ID
POST   /api/indicios                          - Crear nuevo
PUT    /api/indicios/:id                      - Actualizar
DELETE /api/indicios/:id                      - Eliminar
POST   /api/indicios/:id/upload-photo         - Subir fotografía
```

#### Aprobaciones (`/api/aprobaciones`)
```
GET    /api/aprobaciones/pendientes           - Expedientes pendientes
POST   /api/aprobaciones/enviar/:id           - Enviar a revisión
POST   /api/aprobaciones/aprobar/:id          - Aprobar expediente
POST   /api/aprobaciones/rechazar/:id         - Rechazar expediente
GET    /api/aprobaciones/historial/:id        - Ver historial
```

#### Reportes (`/api/reportes`)
```
GET    /api/reportes/dashboard                       - Métricas del dashboard
GET    /api/reportes/expedientes?fechaInicio&fechaFin&estado - Reportes filtrados
GET    /api/reportes/indicios?fechaInicio&fechaFin   - Reporte de indicios
```

### Autenticación JWT

Todas las rutas (excepto `/api/auth/login`) requieren token:

```http
Authorization: Bearer <access_token>
```

---

## 👥 Roles y Permisos

| Funcionalidad | Técnico | Coordinador | Admin |
|---------------|:-------:|:-----------:|:-----:|
| Ver expedientes propios | ✅ | ✅ | ✅ |
| Ver todos los expedientes | ❌ | ✅ | ✅ |
| Crear expediente | ✅ | ✅ | ✅ |
| Editar expediente (Borrador) | ✅ | ❌ | ✅ |
| Eliminar expediente (Borrador) | ✅ | ❌ | ✅ |
| Enviar a revisión | ✅ | ❌ | ✅ |
| Aprobar expediente | ❌ | ✅ | ✅ |
| Rechazar expediente | ❌ | ✅ | ✅ |
| Agregar indicios | ✅ | ✅ | ✅ |
| Ver reportes | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

---

## 🔄 Flujo de Aprobación

```
┌─────────────┐
│  BORRADOR   │ ← Estado inicial
└──────┬──────┘
       │ Técnico: "Enviar a Revisión"
       ▼
┌─────────────┐
│ EN REVISIÓN │ ← Coordinador debe revisar
└──────┬──────┘
       │
       ├─► Aprobar ──────► ┌──────────┐
       │                   │ APROBADO │ ← Finalizado
       │                   └──────────┘
       │
       └─► Rechazar ──────► ┌───────────┐
           (justificación)  │ RECHAZADO │ ← Requiere corrección
                            └─────┬─────┘
                                  │ Vuelve a Borrador
                                  ▼
                            ┌─────────────┐
                            │  BORRADOR   │
                            └─────────────┘
```

---

## 🧪 Pruebas

### Ejecutar Tests

```bash
# Backend tests
cd backend
npm test

# Con cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

### Tests Implementados

1. **auth.test.js**
   - Login exitoso
   - Login con credenciales inválidas
   - Refresh token
   - Cambio de contraseña

2. **expedientes.test.js**
   - Crear expediente
   - Listar expedientes
   - Obtener por ID
   - Actualizar expediente
   - Eliminar expediente

### Probar con Swagger

1. Accede a http://localhost:5001/api-docs
2. Haz login para obtener token
3. Click en "Authorize" (candado)
4. Pega el token: `Bearer <tu-token>`
5. Prueba cualquier endpoint

---

## 🔧 Mantenimiento

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo database
docker-compose logs -f database

# Últimas 50 líneas
docker-compose logs --tail=50 backend
```

### Reiniciar Servicios

```bash
# Reiniciar backend
docker-compose restart backend

# Reiniciar database
docker-compose restart database

# Reiniciar todo
docker-compose restart
```

### Detener Sistema

```bash
# Detener sin eliminar datos
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar TODO (incluyendo volúmenes)
docker-compose down -v
```

### Actualizar Contraseñas

```bash
# Generar hash de nueva contraseña
docker exec dicri-backend node generate-hash.js

# Copiar y ejecutar script SQL
docker cp update-passwords.sql dicri-database:/tmp/
docker exec dicri-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "DicrI2024!Secure" -C -d DICRI_DB -i /tmp/update-passwords.sql
```

---

## 📖 Documentación Adicional

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de deployment a Railway con CI/CD
- **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Diagrama de arquitectura completo del sistema
- **[DIAGRAMA-ER.md](./DIAGRAMA-ER.md)** - Modelo entidad-relación de la base de datos
- **[MANUAL-TECNICO.md](./MANUAL-TECNICO.md)** - Manual técnico con ejemplos de código
- **[ENTREGABLES-CHECKLIST.md](./ENTREGABLES-CHECKLIST.md)** - Checklist de entregables para entrevista
- **Swagger Docs** - http://localhost:5001/api-docs - Documentación interactiva de la API

---

## ✅ Cumplimiento de Requisitos

### Requisitos Funcionales

| Requisito | Estado | Ubicación |
|-----------|:------:|-----------|
| Registro de expedientes | ✅ | `NuevoExpediente.jsx`, `SP_CrearExpediente` |
| Registro de indicios | ✅ | `ExpedienteDetalle.jsx`, `SP_CrearIndicio` |
| Flujo de aprobación | ✅ | `Aprobaciones.jsx`, `SP_AprobarExpediente` |
| Justificación de rechazo | ✅ | `SP_RechazarExpediente` |
| Reportes y estadísticas | ✅ | `Reportes.jsx`, `Dashboard.jsx` |
| Interfaz intuitiva | ✅ | React + Tailwind CSS |
| Autenticación segura | ✅ | JWT + bcrypt |
| Control por roles | ✅ | Middleware auth |

### Requisitos Técnicos

| Requisito | Estado | Evidencia |
|-----------|:------:|-----------|
| Frontend ReactJS | ✅ | `/frontend/` |
| Backend Node.js + Express | ✅ | `/backend/` |
| Servicios RESTful | ✅ | `/backend/src/routes/` |
| Stored Procedures SQL Server | ✅ | `/database/stored-procedures.sql` |
| Despliegue Docker | ✅ | `docker-compose.yml` |
| Pruebas unitarias | ✅ | `/backend/src/__tests__/` |
| Swagger documentado | ✅ | http://localhost:5001/api-docs |

---

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3001

# Matar proceso (Windows)
taskkill /PID <PID> /F
```

### Error de conexión a BD

```bash
# Verificar estado
docker-compose ps

# Reiniciar database
docker-compose restart database

# Ver logs
docker-compose logs database
```

### Error CORS

Verifica que la variable `CORS_ORIGIN` coincida con el frontend:

```env
CORS_ORIGIN=http://localhost:3001
```

---

## 📧 Contacto

**Ministerio Público de Guatemala**
Dirección de Investigación Criminalística (DICRI)
Coordinación del Sistema Informático Integrado (CSII)
Tel. 23160000 Ext.10510

---

## 👨‍💻 Desarrollador

- **GitHub**: [@rivalTj7](https://github.com/rivalTj7)
- **Repositorio**: https://github.com/rivalTj7/PruebaTecnicaDS

---

## 📄 Licencia

Uso interno - Ministerio Público de Guatemala

---

**Versión**: 1.0.0
**Fecha**: Noviembre 2024
**Estado**: ✅ Producción
