# Manual Técnico - Sistema de Gestión de Evidencias DICRI

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Componentes del Backend](#componentes-del-backend)
6. [Componentes del Frontend](#componentes-del-frontend)
7. [Base de Datos](#base-de-datos)
8. [API Endpoints](#api-endpoints)
9. [Pruebas](#pruebas)
10. [Despliegue](#despliegue)

---

## 1. Introducción

El Sistema de Gestión de Evidencias DICRI es una aplicación web fullstack desarrollada para el Ministerio Público de Guatemala, específicamente para la Dirección de Investigación Criminalística (DICRI).

### Objetivo
Facilitar la gestión, registro y control de expedientes e indicios criminalísticos con un sistema de aprobación por workflow.

### Tecnologías Utilizadas
- **Frontend**: React.js 18, Material-UI, Vite
- **Backend**: Node.js, Express.js
- **Base de Datos**: SQL Server 2022
- **Contenerización**: Docker & Docker Compose

---

## 2. Requisitos del Sistema

### Requisitos Mínimos
- **Sistema Operativo**: Linux, Windows, macOS
- **Docker**: v20.10+
- **Docker Compose**: v2.0+
- **Node.js**: v18+ (para desarrollo local)
- **Memoria RAM**: 4GB mínimo
- **Espacio en Disco**: 10GB

### Puertos Requeridos
- **3000**: Frontend React
- **5000**: Backend API
- **1433**: SQL Server

---

## 3. Instalación y Configuración

### 3.1 Clonar el Repositorio

```bash
git clone <repository-url>
cd PruebaTecnicaDS
```

### 3.2 Configurar Variables de Entorno

**Backend (.env)**:
```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=database
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=DicrI2024!Secure
DB_NAME=DICRI_DB
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**:
```bash
cd frontend
cp .env.example .env
```

Editar `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
```

### 3.3 Iniciar con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

### 3.4 Verificar Servicios

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f

# Verificar salud de la base de datos
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure -Q "SELECT 1"
```

### 3.5 Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs

---

## 4. Arquitectura del Sistema

Ver `arquitectura.md` para diagrama completo.

### Flujo de Comunicación
```
Cliente (Browser) → Frontend (React) → Backend (Express) → Database (SQL Server)
```

### Capas Principales
1. **Presentación**: React + Material-UI
2. **Lógica de Negocio**: Express Controllers
3. **Acceso a Datos**: Stored Procedures

---

## 5. Componentes del Backend

### 5.1 Estructura de Directorios

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de conexión a DB
│   │   └── migrate.js            # Script de migración
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── expedientes.controller.js
│   │   ├── indicios.controller.js
│   │   ├── aprobaciones.controller.js
│   │   ├── reportes.controller.js
│   │   └── usuarios.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── validation.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── expedientes.routes.js
│   │   ├── indicios.routes.js
│   │   ├── aprobaciones.routes.js
│   │   ├── reportes.routes.js
│   │   └── usuarios.routes.js
│   ├── __tests__/
│   │   ├── auth.test.js
│   │   └── expedientes.test.js
│   └── index.js                  # Punto de entrada
├── package.json
├── Dockerfile
└── .env.example
```

### 5.2 Código Principal: index.js

**Ubicación**: `backend/src/index.js`

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Logging
app.use(morgan('dev'));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
});
app.use('/api/', limiter);

// Swagger configuration
const swaggerOptions = { /* configuración */ };
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expedientes', expedientesRoutes);
// ... más rutas

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    error: { message: err.message },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
```

### 5.3 Configuración de Base de Datos

**Ubicación**: `backend/src/config/database.js`

```javascript
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const getPool = async () => {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
};
```

### 5.4 Middleware de Autenticación

**Ubicación**: `backend/src/middleware/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Token no proporcionado' },
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Token inválido' },
    });
  }
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.nombreRol)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Sin permisos' },
      });
    }
    next();
  };
};
```

### 5.5 Controller de Expedientes

**Ubicación**: `backend/src/controllers/expedientes.controller.js`

```javascript
const { getPool } = require('../config/database');

const crearExpediente = async (req, res) => {
  try {
    const { numeroExpediente, tituloExpediente, /* ... */ } = req.body;
    const tecnicoRegistraID = req.user.usuarioID;
    const pool = await getPool();

    const result = await pool
      .request()
      .input('NumeroExpediente', numeroExpediente)
      .input('TituloExpediente', tituloExpediente)
      .input('TecnicoRegistraID', tecnicoRegistraID)
      .execute('SP_CrearExpediente');

    const expedienteID = result.recordset[0].ExpedienteID;

    res.status(201).json({
      success: true,
      data: { ExpedienteID: expedienteID },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Error al crear expediente' },
    });
  }
};
```

---

## 6. Componentes del Frontend

### 6.1 Estructura de Directorios

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Expedientes.jsx
│   │   ├── ExpedienteDetalle.jsx
│   │   ├── NuevoExpediente.jsx
│   │   ├── Aprobaciones.jsx
│   │   ├── Reportes.jsx
│   │   └── Perfil.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── expedientes.service.js
│   │   ├── indicios.service.js
│   │   ├── aprobaciones.service.js
│   │   └── reportes.service.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

### 6.2 Configuración de Axios

**Ubicación**: `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Intentar refresh token
      // ...
    }
    return Promise.reject(error);
  }
);
```

### 6.3 Contexto de Autenticación

**Ubicación**: `frontend/src/contexts/AuthContext.jsx`

```jsx
import React, { createContext, useState, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 6.4 Página de Login

**Ubicación**: `frontend/src/pages/Login.jsx`

```jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Paper } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Iniciar Sesión</Button>
      </form>
    </Paper>
  );
};
```

---

## 7. Base de Datos

### 7.1 Scripts SQL

Los scripts SQL se encuentran en el directorio `database/`:

1. **schema.sql**: Creación de tablas e índices
2. **stored-procedures.sql**: Procedimientos almacenados
3. **seed-data.sql**: Datos iniciales

### 7.2 Procedimientos Almacenados Principales

#### SP_CrearExpediente
```sql
CREATE OR ALTER PROCEDURE SP_CrearExpediente
    @NumeroExpediente NVARCHAR(50),
    @TituloExpediente NVARCHAR(255),
    @TecnicoRegistraID INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Expedientes (
        NumeroExpediente, TituloExpediente, TecnicoRegistraID
    )
    VALUES (
        @NumeroExpediente, @TituloExpediente, @TecnicoRegistraID
    );

    SELECT SCOPE_IDENTITY() AS ExpedienteID;
END
```

#### SP_CambiarEstadoExpediente
```sql
CREATE OR ALTER PROCEDURE SP_CambiarEstadoExpediente
    @ExpedienteID INT,
    @NuevoEstadoID INT,
    @UsuarioID INT,
    @Accion NVARCHAR(50)
AS
BEGIN
    UPDATE Expedientes
    SET EstadoID = @NuevoEstadoID
    WHERE ExpedienteID = @ExpedienteID;

    INSERT INTO HistorialAprobaciones (
        ExpedienteID, EstadoNuevo, UsuarioID, Accion
    )
    VALUES (
        @ExpedienteID, @NuevoEstadoID, @UsuarioID, @Accion
    );
END
```

---

## 8. API Endpoints

### 8.1 Autenticación

```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user }

POST /api/auth/refresh
Body: { refreshToken }
Response: { accessToken }

GET /api/auth/profile
Headers: Authorization: Bearer {token}
Response: { user }
```

### 8.2 Expedientes

```
GET /api/expedientes
Query: page, pageSize, estadoID, busqueda
Response: { expedientes[], pagination }

POST /api/expedientes
Body: { numeroExpediente, tituloExpediente, ... }
Response: { expediente }

GET /api/expedientes/:id
Response: { expediente }

PUT /api/expedientes/:id
Body: { tituloExpediente, ... }
Response: { expediente }

POST /api/expedientes/:id/enviar-revision
Response: { expediente }
```

### 8.3 Indicios

```
GET /api/indicios/expediente/:expedienteID
Response: { indicios[] }

POST /api/indicios/expediente/:expedienteID
Body: { numeroIndicio, nombreObjeto, ... }
Response: { indicio }

PUT /api/indicios/:id
Body: { numeroIndicio, nombreObjeto, ... }
Response: { indicio }

DELETE /api/indicios/:id
Response: { message }
```

### 8.4 Aprobaciones

```
GET /api/aprobaciones/pendientes
Response: { expedientes[] }

POST /api/aprobaciones/:id/aprobar
Body: { comentarios }
Response: { message }

POST /api/aprobaciones/:id/rechazar
Body: { justificacionRechazo, comentarios }
Response: { message }

GET /api/aprobaciones/historial
Query: expedienteID, fechaInicio, fechaFin
Response: { historial[] }
```

### 8.5 Reportes

```
GET /api/reportes/dashboard
Response: { totales, recientes, actividad }

GET /api/reportes/estadisticas
Query: fechaInicio, fechaFin
Response: { porEstado[], porTecnico[], totales }

GET /api/reportes/productividad
Query: fechaInicio, fechaFin
Response: { productividad[] }

GET /api/reportes/tendencias
Query: anio
Response: { tendencias[] }
```

---

## 9. Pruebas

### 9.1 Ejecutar Pruebas Backend

```bash
cd backend
npm test
```

### 9.2 Pruebas Unitarias

**Ubicación**: `backend/src/__tests__/auth.test.js`

```javascript
describe('Auth API', () => {
  it('debería iniciar sesión con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tecnico@mp.gob.gt',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

---

## 10. Despliegue

### 10.1 Docker Compose

```bash
# Build y start
docker-compose up --build -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f backend
docker-compose logs -f database
```

### 10.2 Verificación Post-Despliegue

1. Verificar servicios: `docker-compose ps`
2. Probar API: `curl http://localhost:5000/health`
3. Verificar frontend: `curl http://localhost:3000`
4. Revisar logs: `docker-compose logs`

---

**Desarrollado para DICRI - Ministerio Público de Guatemala**
