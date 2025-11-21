# Arquitectura del Sistema - DICRI

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR WEB (Cliente)                        │
│                          React.js Frontend                              │
│                          Port: 3000                                     │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │ REST API
                             │
┌────────────────────────────▼────────────────────────────────────────────┐
│                          API BACKEND                                    │
│                          Node.js + Express                              │
│                          Port: 5000                                     │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │   Controllers    │  │   Middleware     │  │     Routes       │    │
│  │  - Auth          │  │  - Auth JWT      │  │  - /api/auth     │    │
│  │  - Expedientes   │  │  - Validation    │  │  - /api/exp...   │    │
│  │  - Indicios      │  │  - Error Handler │  │  - /api/ind...   │    │
│  │  - Aprobaciones  │  └──────────────────┘  │  - /api/apr...   │    │
│  │  - Reportes      │                        │  - /api/rep...   │    │
│  └──────────────────┘                        └──────────────────┘    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Swagger/OpenAPI Docs                         │  │
│  │                     /api-docs                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ SQL Connection
                             │ mssql Driver
                             │
┌────────────────────────────▼────────────────────────────────────────────┐
│                      BASE DE DATOS                                      │
│                      SQL Server 2022                                    │
│                      Port: 1433                                         │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │   Tablas     │  │    Stored    │  │         Índices              │ │
│  │              │  │  Procedures  │  │                              │ │
│  │ - Usuarios   │  │              │  │ - IX_Usuarios_Email          │ │
│  │ - Roles      │  │ - SP_Auth... │  │ - IX_Expedientes_Numero      │ │
│  │ - Expedientes│  │ - SP_Exp...  │  │ - IX_Expedientes_Estado      │ │
│  │ - Indicios   │  │ - SP_Ind...  │  │ - IX_Indicios_Expediente     │ │
│  │ - Estados    │  │ - SP_Apr...  │  │                              │ │
│  │ - Historial  │  │ - SP_Rep...  │  │                              │ │
│  │ - Categorías │  │              │  │                              │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘


                    ┌────────────────────────┐
                    │   Docker Container     │
                    │   Orchestration        │
                    │   docker-compose.yml   │
                    └────────────────────────┘
```

## Arquitectura por Capas

### 1. Capa de Presentación (Frontend)
- **Tecnología**: React.js 18 + Vite
- **UI Framework**: Material-UI (MUI)
- **Estado**: Context API + Local State
- **Routing**: React Router DOM
- **Gráficos**: Recharts
- **HTTP Client**: Axios

**Componentes Principales**:
- `Layout`: Estructura principal con sidebar y navbar
- `PrivateRoute`: Protección de rutas por autenticación
- `AuthContext`: Manejo global del estado de autenticación

**Páginas**:
- Dashboard: Vista general con estadísticas
- Expedientes: CRUD de expedientes
- Indicios: Gestión de evidencias
- Aprobaciones: Workflow de revisión
- Reportes: Análisis y estadísticas

### 2. Capa de Negocio (Backend API)
- **Tecnología**: Node.js + Express.js
- **Autenticación**: JWT (Access Token + Refresh Token)
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan + Winston
- **Documentación**: Swagger/OpenAPI

**Controladores**:
- `auth.controller.js`: Autenticación y autorización
- `expedientes.controller.js`: Lógica de expedientes
- `indicios.controller.js`: Gestión de indicios
- `aprobaciones.controller.js`: Workflow de aprobación
- `reportes.controller.js`: Generación de reportes

**Middleware**:
- `auth.middleware.js`: Verificación de JWT y roles
- `validation.middleware.js`: Validación de datos
- Error handling global

### 3. Capa de Datos (Database)
- **Tecnología**: SQL Server 2022
- **Acceso**: mssql driver para Node.js
- **Patrón**: Stored Procedures para todas las operaciones

**Ventajas de Stored Procedures**:
- Seguridad: Prevención de SQL Injection
- Performance: Compilación y optimización
- Mantenibilidad: Lógica centralizada
- Reutilización: Mismo SP para múltiples endpoints

## Flujo de Datos

### Autenticación
```
Usuario → Login Form → POST /api/auth/login
                           ↓
                     Validar Credenciales
                     (SP_ObtenerUsuarioPorEmail)
                           ↓
                     Verificar Password (bcrypt)
                           ↓
                  Generar JWT Tokens
                  (Access + Refresh)
                           ↓
                     Guardar en localStorage
                           ↓
                  Header Authorization en requests
```

### Creación de Expediente
```
Formulario → Validación Frontend → POST /api/expedientes
                                          ↓
                                   Middleware Auth
                                   Verificar Role (Técnico)
                                          ↓
                                   Validación de Datos
                                          ↓
                              SP_CrearExpediente (SQL Server)
                                          ↓
                              Registrar en Historial
                                          ↓
                              Retornar Expediente Creado
                                          ↓
                              Actualizar Vista Frontend
```

### Workflow de Aprobación
```
Técnico crea Expediente → Estado: Borrador
         ↓
Técnico agrega Indicios
         ↓
Técnico envía a Revisión → Estado: En Revisión
         ↓
Coordinador revisa
         ↓
     ┌───┴───┐
     ▼       ▼
  Aprobar  Rechazar
     │       │
     │       └→ Estado: Rechazado + Justificación
     │              ↓
     │         Técnico corrige
     │              ↓
     │         Reenvía a Revisión
     │
     └→ Estado: Aprobado
        Proceso Finalizado
```

## Seguridad

### Autenticación y Autorización
- **JWT**: Tokens con expiración
- **Refresh Tokens**: Renovación segura
- **Role-Based Access**: Control por roles
- **Password Hashing**: bcrypt con salt

### Protección API
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de origen cruzado
- **Rate Limiting**: Prevención de abuso
- **Input Validation**: Validación exhaustiva
- **SQL Injection Prevention**: Stored Procedures

### Frontend
- **XSS Protection**: Sanitización de inputs
- **HTTPS**: Comunicación encriptada
- **Token Storage**: localStorage con refresh
- **Route Protection**: PrivateRoute component

## Escalabilidad

### Horizontal
- Stateless API (JWT)
- Docker containers
- Load balancer compatible
- Database connection pooling

### Vertical
- SQL Server índices optimizados
- Query optimization
- Lazy loading en frontend
- Pagination en listados

## Monitoreo y Logs

### Backend
- Morgan: HTTP request logging
- Winston: Application logging
- Error tracking
- Performance monitoring

### Database
- Query performance
- Slow query log
- Index usage statistics

## Despliegue

### Docker Compose
```yaml
Services:
  - frontend: React app (port 3000)
  - backend: Node.js API (port 5000)
  - database: SQL Server (port 1433)

Networks:
  - dicri-network (bridge)

Volumes:
  - sqlserver_data (persistent)
```

### Health Checks
- Frontend: Vite dev server
- Backend: /health endpoint
- Database: SQL Server connection test

## Tecnologías y Versiones

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Frontend | React | 18.2.0 |
| Build Tool | Vite | 5.0.11 |
| UI Framework | Material-UI | 5.15.3 |
| Backend Runtime | Node.js | 18+ |
| Backend Framework | Express | 4.18.2 |
| Database | SQL Server | 2022 |
| Container | Docker | Latest |
| HTTP Client | Axios | 1.6.5 |
| Charts | Recharts | 2.10.3 |
| Auth | JWT | 9.0.2 |
| Password | bcryptjs | 2.4.3 |

## Patrones de Diseño

- **MVC**: Modelo-Vista-Controlador en backend
- **Repository Pattern**: Acceso a datos via SPs
- **Context Pattern**: Estado global en React
- **HOC**: Higher-Order Components (PrivateRoute)
- **Service Layer**: Separación de lógica de negocio
- **Middleware Pattern**: Express middleware chain

---

**Desarrollado para DICRI - Ministerio Público de Guatemala**
