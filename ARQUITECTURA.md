# Arquitectura del Sistema - DICRI

## Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO FINAL                           │
│                    (Técnicos, Coordinadores)                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Frontend - React + Vite (Puerto 3001)              │ │
│  │                                                            │ │
│  │  - Componentes React                                      │ │
│  │  - React Router (Navegación)                              │ │
│  │  - Axios (Cliente HTTP)                                   │ │
│  │  - Context API (Gestión de Estado)                        │ │
│  │  - Tailwind CSS (Estilos)                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ REST API (JSON)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      CAPA DE APLICACIÓN                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Backend - Node.js + Express (Puerto 5001)          │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              Middleware Layer                        │ │ │
│  │  │  - CORS Configuration                                │ │ │
│  │  │  - JWT Authentication                                │ │ │
│  │  │  - Rate Limiting                                     │ │ │
│  │  │  - Helmet (Security Headers)                         │ │ │
│  │  │  - Morgan (Logging)                                  │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                  REST Endpoints                      │ │ │
│  │  │  - /api/auth         (Autenticación)                 │ │ │
│  │  │  - /api/expedientes  (Gestión Expedientes)           │ │ │
│  │  │  - /api/indicios     (Gestión Indicios)              │ │ │
│  │  │  - /api/aprobaciones (Flujo Aprobación)              │ │ │
│  │  │  - /api/reportes     (Informes)                      │ │ │
│  │  │  - /api/usuarios     (Gestión Usuarios)              │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                  Controllers                         │ │ │
│  │  │  - Lógica de negocio                                 │ │ │
│  │  │  - Validación de datos                               │ │ │
│  │  │  - Transformación de respuestas                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │            Swagger Documentation                     │ │ │
│  │  │  - /api-docs (OpenAPI 3.0)                           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ SQL Queries via
                            │ Stored Procedures
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                        CAPA DE DATOS                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │      SQL Server 2022 Database (Puerto 1433)                │ │
│  │                     DICRI_DB                               │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              Tablas Principales                      │ │ │
│  │  │  - Usuarios                                          │ │ │
│  │  │  - Roles                                             │ │ │
│  │  │  - Expedientes                                       │ │ │
│  │  │  - Indicios                                          │ │ │
│  │  │  - EstadosExpediente                                 │ │ │
│  │  │  - HistorialAprobaciones                             │ │ │
│  │  │  - CategoriasIndicios                                │ │ │
│  │  │  - ConfiguracionSistema                              │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │           Stored Procedures (SPs)                    │ │ │
│  │  │  - SP_CrearExpediente                                │ │ │
│  │  │  - SP_ObtenerExpedientes                             │ │ │
│  │  │  - SP_CrearIndicio                                   │ │ │
│  │  │  - SP_CambiarEstadoExpediente                        │ │ │
│  │  │  - SP_AprobarExpediente                              │ │ │
│  │  │  - SP_RechazarExpediente                             │ │ │
│  │  │  - SP_ObtenerReporteDashboard                        │ │ │
│  │  │  - Y más...                                          │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA DOCKER                        │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │   Container    │  │   Container    │  │   Container      │  │
│  │   Frontend     │  │   Backend      │  │   Database       │  │
│  │   (React)      │  │   (Node.js)    │  │   (SQL Server)   │  │
│  │   Port: 3001   │  │   Port: 5001   │  │   Port: 1433     │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
│           │                   │                     │           │
│           └───────────────────┴─────────────────────┘           │
│                      Docker Network                             │
│                    (dicri-network)                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Volúmenes Persistentes                       │ │
│  │  - sqlserver_data (Datos de la BD)                         │ │
│  │  - backend/uploads (Archivos subidos)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Autenticación
```
Usuario → Frontend → POST /api/auth/login → Backend
                                             ↓
                                    SP_ObtenerUsuarioPorEmail
                                             ↓
                                       SQL Server
                                             ↓
                                    Validar bcrypt
                                             ↓
                                    Generar JWT tokens
                                             ↓
Frontend ← {accessToken, refreshToken} ← Backend
```

### 2. Crear Expediente
```
Técnico → Frontend → POST /api/expedientes → Backend (JWT Auth)
                                              ↓
                                     Validar permisos
                                              ↓
                                     SP_CrearExpediente
                                              ↓
                                        SQL Server
                                              ↓
                      INSERT Expedientes + HistorialAprobaciones
                                              ↓
Frontend ← {success: true, expediente} ← Backend
```

### 3. Flujo de Aprobación
```
Coordinador → Frontend → POST /api/aprobaciones/aprobar/:id
                                              ↓
                                    Backend (JWT Auth)
                                              ↓
                                    Validar rol = Coordinador
                                              ↓
                                    SP_AprobarExpediente
                                              ↓
                                        SQL Server
                                              ↓
              UPDATE EstadoExpediente + INSERT HistorialAprobaciones
                                              ↓
Frontend ← {success: true, mensaje} ← Backend
```

## Patrones de Diseño Utilizados

### 1. **MVC (Model-View-Controller)**
- **Model**: Stored Procedures en SQL Server
- **View**: Componentes React
- **Controller**: Controllers en Express

### 2. **Repository Pattern**
- Toda la lógica de acceso a datos está en Stored Procedures
- Los controllers solo invocan SPs, no escriben SQL directo

### 3. **Middleware Pattern**
- Cadena de middlewares en Express (CORS, Auth, Rate Limiting)
- Interceptores en Axios para manejo de tokens

### 4. **Context API Pattern**
- AuthContext para estado de autenticación global
- Evita prop drilling

## Seguridad Implementada

### Backend
1. **Helmet**: Headers de seguridad HTTP
2. **CORS**: Control de origen cruzado
3. **Rate Limiting**: Límite de peticiones por IP
4. **JWT**: Autenticación stateless
5. **Bcrypt**: Hash de contraseñas (salt rounds: 10)
6. **SQL Injection Protection**: Uso de parámetros en SPs

### Frontend
1. **Token Refresh**: Renovación automática de tokens
2. **Private Routes**: Rutas protegidas por autenticación
3. **Role-based Access**: Control de acceso por rol

### Base de Datos
1. **Stored Procedures**: Prevención de SQL injection
2. **Constraints**: Integridad referencial
3. **Indices**: Optimización de consultas

## Tecnologías y Versiones

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Frontend | React | 18.x |
| Build Tool | Vite | 5.x |
| Routing | React Router | 6.x |
| HTTP Client | Axios | 1.x |
| Estilos | Tailwind CSS | 3.x |
| Backend | Node.js | 18.x |
| Framework | Express | 4.x |
| Auth | jsonwebtoken | 9.x |
| Password Hash | bcryptjs | 2.x |
| Database Driver | mssql | 10.x |
| Docs | Swagger UI | 5.x |
| Base de Datos | SQL Server | 2022 |
| Container | Docker | 24.x |
| Orchestration | Docker Compose | 2.x |

## Escalabilidad y Mejoras Futuras

### Corto Plazo
- [ ] Implementar Redis para cacheo de sesiones
- [ ] Agregar logs centralizados (Winston + ELK)
- [ ] Implementar notificaciones en tiempo real (Socket.io)

### Mediano Plazo
- [ ] Migrar a microservicios
- [ ] Implementar queue system (RabbitMQ/Bull)
- [ ] Agregar CDN para assets estáticos

### Largo Plazo
- [ ] Implementar Kubernetes para orquestación
- [ ] Sistema de backup automático
- [ ] Implementar CI/CD completo
