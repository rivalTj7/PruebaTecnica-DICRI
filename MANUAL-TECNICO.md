# Manual Técnico - Sistema DICRI
## División de Investigación Criminal - Ministerio Público de Guatemala

**Desarrollado por:** Rivaldo Alexander Tojín
**Versión:** 1.0.0
**Fecha:** Noviembre 2025

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Backend - API REST](#backend---api-rest)
7. [Frontend - React](#frontend---react)
8. [Base de Datos](#base-de-datos)
9. [Seguridad](#seguridad)
10. [Capturas de Código](#capturas-de-código)

---

## 🎯 Introducción

El Sistema DICRI es una aplicación web full-stack diseñada para la gestión de evidencias del Ministerio Público de Guatemala. Permite a técnicos, coordinadores y administradores gestionar expedientes criminales, indicios y flujos de aprobación de manera segura y eficiente.

### Características Principales

- ✅ **Gestión de Expedientes**: CRUD completo con control de estados
- ✅ **Gestión de Indicios**: Registro detallado de evidencias
- ✅ **Flujo de Aprobación**: Sistema de revisión multinivel
- ✅ **Control de Roles**: RBAC (Role-Based Access Control)
- ✅ **Dashboard Analítico**: Reportes y estadísticas en tiempo real
- ✅ **UI/UX Moderno**: Interfaz profesional con Material-UI
- ✅ **Seguridad**: JWT, validaciones, encriptación

---

## 🏗️ Arquitectura del Sistema

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN                │
│    React + Vite + Material-UI (Puerto 3001) │
└──────────────────┬──────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼──────────────────────────┐
│         CAPA DE APLICACIÓN                  │
│    Node.js + Express + JWT (Puerto 5001)    │
└──────────────────┬──────────────────────────┘
                   │ Stored Procedures
┌──────────────────▼──────────────────────────┐
│         CAPA DE DATOS                       │
│    SQL Server 2022 + Docker (Puerto 1433)   │
└─────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario** → Interactúa con la interfaz React
2. **Frontend** → Envía petición HTTP a la API REST
3. **Middleware** → Valida JWT y permisos
4. **Controller** → Procesa lógica de negocio
5. **Stored Procedure** → Ejecuta operaciones en BD
6. **Response** → Retorna datos en formato JSON

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.2.0** - Librería UI
- **Vite** - Build tool y dev server
- **Material-UI (MUI) 5.14** - Componentes UI
- **React Router v6** - Navegación SPA
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos y visualizaciones
- **date-fns** - Manejo de fechas
- **react-toastify** - Notificaciones

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express 4.18** - Framework web
- **mssql** - Driver SQL Server
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Hash de contraseñas
- **helmet** - Seguridad HTTP headers
- **cors** - Cross-Origin Resource Sharing
- **morgan** - Logging HTTP

### Base de Datos
- **SQL Server 2022** - RDBMS
- **Docker** - Contenedorización
- **Stored Procedures** - Lógica de negocio en BD

### DevOps
- **Docker & Docker Compose** - Orquestación de contenedores
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto

---

## 📦 Instalación y Configuración

### Prerrequisitos

```bash
Node.js >= 20.0.0
Docker Desktop >= 4.0.0
Git >= 2.30.0
```

### Clonar Repositorio

```bash
git clone https://github.com/rivalTj7/PruebaTecnicaDS.git
cd PruebaTecnicaDS
```

### Configurar Variables de Entorno

**Backend (.env):**
```bash
PORT=5001
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_SERVER=sqlserver
DB_PORT=1433
DB_DATABASE=DICRI_DB
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:5001/api
```

### Levantar Servicios con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

### Acceder a la Aplicación

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001/api
- **SQL Server**: localhost:1433

### Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@mp.gob.gt | Admin123! | Administrador |
| coord@mp.gob.gt | Coord123! | Coordinador |
| tecnico@mp.gob.gt | Tecnico123! | Técnico |

---

## 📁 Estructura del Proyecto

```
PruebaTecnicaDS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # Configuración SQL Server
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── expedientes.controller.js
│   │   │   ├── indicios.controller.js
│   │   │   ├── usuarios.controller.js
│   │   │   └── reportes.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # JWT validation
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── expedientes.routes.js
│   │   │   └── ...
│   │   └── server.js                 # Express app
│   ├── database/
│   │   ├── schema.sql
│   │   ├── stored-procedures.sql
│   │   └── seed-data.sql
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Sidebar + AppBar
│   │   │   └── PrivateRoute.jsx      # Route guard
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expedientes.jsx
│   │   │   ├── ExpedienteDetalle.jsx
│   │   │   ├── Aprobaciones.jsx
│   │   │   ├── Reportes.jsx
│   │   │   └── Perfil.jsx
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── expedientes.service.js
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx                  # Entry point
│   ├── public/
│   │   └── assets/
│   │       └── images/
│   │           └── MP_logo.png       # Logo oficial MP
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
├── ARQUITECTURA.md
├── DIAGRAMA-ER.md
└── ROLES-Y-PERMISOS.md
```

---

## 🔧 Backend - API REST

### Configuración de Base de Datos

**Archivo:** `backend/src/config/database.js`

```javascript
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a BD:', error);
    process.exit(1);
  }
}

module.exports = { sql, connectDB };
```

### Middleware de Autenticación

**Archivo:** `backend/src/middleware/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Token no proporcionado' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { message: 'Token inválido' }
    });
  }
};

const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'No autenticado' }
      });
    }

    if (!rolesPermitidos.includes(req.user.nombreRol)) {
      return res.status(403).json({
        success: false,
        error: { message: 'No tiene permisos suficientes' }
      });
    }

    next();
  };
};

module.exports = { verificarToken, verificarRoles };
```

### Controller de Expedientes

**Archivo:** `backend/src/controllers/expedientes.controller.js`

```javascript
const { sql } = require('../config/database');

exports.crearExpediente = async (req, res) => {
  try {
    const pool = req.app.locals.db;
    const {
      numeroMP,
      tituloExpediente,
      descripcion,
      lugarIncidente,
      fechaIncidente,
      prioridad,
      observaciones,
    } = req.body;

    const usuarioID = req.user.usuarioID;

    const result = await pool
      .request()
      .input('NumeroMP', sql.NVarChar(50), numeroMP || null)
      .input('TituloExpediente', sql.NVarChar(200), tituloExpediente)
      .input('Descripcion', sql.NVarChar(sql.MAX), descripcion)
      .input('LugarIncidente', sql.NVarChar(200), lugarIncidente || null)
      .input('FechaIncidente', sql.DateTime, fechaIncidente ? new Date(fechaIncidente) : null)
      .input('TecnicoRegistraID', sql.Int, usuarioID)
      .input('Prioridad', sql.NVarChar(20), prioridad || 'Normal')
      .input('Observaciones', sql.NVarChar(sql.MAX), observaciones || null)
      .execute('SP_CrearExpediente');

    const nuevoExpediente = result.recordset[0];

    res.status(201).json({
      success: true,
      data: nuevoExpediente,
    });
  } catch (error) {
    console.error('Error al crear expediente:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al crear expediente' },
    });
  }
};

exports.actualizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.db;
    const usuarioModificacion = req.user.usuarioID;

    // Verificar que el expediente existe
    const expedienteExistente = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    if (!expedienteExistente.recordset || expedienteExistente.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Expediente no encontrado' },
      });
    }

    const expediente = expedienteExistente.recordset[0];

    // Validación de permisos
    const esAdmin = req.user.nombreRol === 'Administrador';
    const esTecnicoDueno = expediente.TecnicoRegistraID === usuarioModificacion;
    const esBorrador = expediente.EstadoID === 1;

    if (!esAdmin && (!esTecnicoDueno || !esBorrador)) {
      return res.status(403).json({
        success: false,
        error: {
          message: esTecnicoDueno
            ? 'Solo puedes editar expedientes en estado Borrador'
            : 'No tienes permiso para editar este expediente',
        },
      });
    }

    // Actualizar expediente
    const result = await pool
      .request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .input('NumeroMP', sql.NVarChar(50), req.body.numeroMP || null)
      .input('TituloExpediente', sql.NVarChar(200), req.body.tituloExpediente)
      .input('Descripcion', sql.NVarChar(sql.MAX), req.body.descripcion)
      .input('LugarIncidente', sql.NVarChar(200), req.body.lugarIncidente || null)
      .input('FechaIncidente', sql.DateTime, req.body.fechaIncidente ? new Date(req.body.fechaIncidente) : null)
      .input('Prioridad', sql.NVarChar(20), req.body.prioridad || 'Normal')
      .input('Observaciones', sql.NVarChar(sql.MAX), req.body.observaciones || null)
      .input('UsuarioModificacion', sql.Int, usuarioModificacion)
      .execute('SP_ActualizarExpediente');

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Expediente actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar expediente:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al actualizar expediente' },
    });
  }
};
```

### Endpoints de la API

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| POST | `/api/auth/login` | Iniciar sesión | Público |
| POST | `/api/auth/change-password` | Cambiar contraseña | Autenticado |
| GET | `/api/expedientes` | Listar expedientes | Todos |
| POST | `/api/expedientes` | Crear expediente | Técnico, Admin |
| GET | `/api/expedientes/:id` | Obtener detalles | Todos |
| PUT | `/api/expedientes/:id` | Actualizar expediente | Técnico (propio), Admin |
| POST | `/api/expedientes/:id/enviar-revision` | Enviar a revisión | Técnico (propio), Admin |
| POST | `/api/indicios` | Crear indicio | Técnico (propio exp), Admin |
| PUT | `/api/indicios/:id` | Actualizar indicio | Técnico (propio exp), Admin |
| DELETE | `/api/indicios/:id` | Eliminar indicio | Técnico (propio exp), Admin |
| GET | `/api/aprobaciones` | Listar pendientes | Coordinador, Admin |
| POST | `/api/aprobaciones/aprobar/:id` | Aprobar expediente | Coordinador, Admin |
| POST | `/api/aprobaciones/rechazar/:id` | Rechazar expediente | Coordinador, Admin |
| GET | `/api/reportes/dashboard` | Dashboard stats | Todos |
| GET | `/api/usuarios` | Listar usuarios | Admin |
| POST | `/api/usuarios` | Crear usuario | Admin |
| PUT | `/api/usuarios/:id` | Actualizar usuario | Admin |

---

## ⚛️ Frontend - React

### Context de Autenticación

**Archivo:** `frontend/src/contexts/AuthContext.jsx`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (...roles) => {
    return user && roles.includes(user.NombreRol);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Layout con Sidebar Moderno

**Archivo:** `frontend/src/components/Layout.jsx`

**Características implementadas:**
- Sidebar colapsable (280px ↔ 75px)
- Logo oficial del Ministerio Público
- Gradientes institucionales (azul + rojo)
- AppBar con efecto glassmorphism
- Footer con créditos del desarrollador
- Menú de navegación con indicadores visuales
- Tooltips en sidebar colapsado
- Avatar con gradiente
- Menú dropdown de usuario
- Chip con rol del usuario
- Transiciones suaves (0.3s cubic-bezier)

### Servicio de Expedientes

**Archivo:** `frontend/src/services/expedientes.service.js`

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const expedientesService = {
  listar: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/expedientes`, {
        headers: getAuthHeader(),
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/expedientes/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  crear: async (expediente) => {
    try {
      const response = await axios.post(`${API_URL}/expedientes`, expediente, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  actualizar: async (id, expediente) => {
    try {
      const response = await axios.put(`${API_URL}/expedientes/${id}`, expediente, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  enviarARevision: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/expedientes/${id}/enviar-revision`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default expedientesService;
```

### Tema Material-UI

**Archivo:** `frontend/src/main.jsx`

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#003D82', // Azul gubernamental de Guatemala
      dark: '#002952',
      light: '#336ba3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B0000', // Rojo institucional
      dark: '#5f0000',
      light: '#b33333',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.75rem', fontWeight: 700 },
    h2: { fontSize: '2.25rem', fontWeight: 700 },
    // ... más configuración
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 61, 130, 0.15)',
          },
        },
      },
    },
    // ... más componentes
  },
});
```

---

## 💾 Base de Datos

### Esquema de Tablas Principales

#### Tabla: Usuarios
```sql
CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
    NombreCompleto NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    RolID INT NOT NULL,
    Telefono NVARCHAR(20),
    Cargo NVARCHAR(50),
    Departamento NVARCHAR(50),
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UltimoAcceso DATETIME,
    Activo BIT DEFAULT 1,
    FOREIGN KEY (RolID) REFERENCES Roles(RolID)
);
```

#### Tabla: Expedientes
```sql
CREATE TABLE Expedientes (
    ExpedienteID INT PRIMARY KEY IDENTITY(1,1),
    NumeroExpediente AS ('EXP-' + FORMAT(ExpedienteID, '000000')) PERSISTED,
    NumeroMP NVARCHAR(50),
    TituloExpediente NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(MAX),
    LugarIncidente NVARCHAR(200),
    FechaIncidente DATETIME,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    TecnicoRegistraID INT NOT NULL,
    EstadoID INT DEFAULT 1,
    CoordinadorAsignadoID INT,
    FechaRevision DATETIME,
    FechaAprobacion DATETIME,
    JustificacionRechazo NVARCHAR(MAX),
    Prioridad NVARCHAR(20) DEFAULT 'Normal',
    Observaciones NVARCHAR(MAX),
    UltimaModificacion DATETIME DEFAULT GETDATE(),
    UsuarioModificacion INT,
    FOREIGN KEY (TecnicoRegistraID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (EstadoID) REFERENCES EstadosExpediente(EstadoID),
    FOREIGN KEY (CoordinadorAsignadoID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (UsuarioModificacion) REFERENCES Usuarios(UsuarioID)
);
```

#### Tabla: Indicios
```sql
CREATE TABLE Indicios (
    IndicioID INT PRIMARY KEY IDENTITY(1,1),
    ExpedienteID INT NOT NULL,
    NumeroIndicio AS ('IND-' + FORMAT(IndicioID, '000000')) PERSISTED,
    TipoIndicio NVARCHAR(100),
    CategoriaID INT,
    Descripcion NVARCHAR(MAX),
    LugarHallazgo NVARCHAR(200),
    FechaHallazgo DATETIME,
    EstadoConservacion NVARCHAR(50),
    CadenasCustodia NVARCHAR(MAX),
    Observaciones NVARCHAR(MAX),
    Peso DECIMAL(10,3),
    Dimensiones NVARCHAR(100),
    Color NVARCHAR(50),
    Material NVARCHAR(100),
    FotoURL NVARCHAR(500),
    FechaRegistro DATETIME DEFAULT GETDATE(),
    UsuarioRegistro INT,
    FOREIGN KEY (ExpedienteID) REFERENCES Expedientes(ExpedienteID) ON DELETE CASCADE,
    FOREIGN KEY (CategoriaID) REFERENCES CategoriasIndicios(CategoriaID),
    FOREIGN KEY (UsuarioRegistro) REFERENCES Usuarios(UsuarioID)
);
```

### Stored Procedures Principales

#### SP_CrearExpediente
```sql
CREATE PROCEDURE SP_CrearExpediente
    @NumeroMP NVARCHAR(50) = NULL,
    @TituloExpediente NVARCHAR(200),
    @Descripcion NVARCHAR(MAX) = NULL,
    @LugarIncidente NVARCHAR(200) = NULL,
    @FechaIncidente DATETIME = NULL,
    @TecnicoRegistraID INT,
    @Prioridad NVARCHAR(20) = 'Normal',
    @Observaciones NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Expedientes (
        NumeroMP, TituloExpediente, Descripcion,
        LugarIncidente, FechaIncidente, TecnicoRegistraID,
        Prioridad, Observaciones, EstadoID
    )
    VALUES (
        @NumeroMP, @TituloExpediente, @Descripcion,
        @LugarIncidente, @FechaIncidente, @TecnicoRegistraID,
        @Prioridad, @Observaciones, 1 -- Borrador
    );

    SELECT
        e.*,
        u.NombreCompleto AS NombreTecnico,
        es.NombreEstado,
        es.Color AS ColorEstado
    FROM Expedientes e
    INNER JOIN Usuarios u ON e.TecnicoRegistraID = u.UsuarioID
    INNER JOIN EstadosExpediente es ON e.EstadoID = es.EstadoID
    WHERE e.ExpedienteID = SCOPE_IDENTITY();
END;
```

#### SP_CambiarEstadoExpediente
```sql
CREATE PROCEDURE SP_CambiarEstadoExpediente
    @ExpedienteID INT,
    @NuevoEstadoID INT,
    @UsuarioID INT,
    @Accion NVARCHAR(50),
    @Comentarios NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    DECLARE @EstadoAnterior INT;

    SELECT @EstadoAnterior = EstadoID
    FROM Expedientes
    WHERE ExpedienteID = @ExpedienteID;

    -- Actualizar estado del expediente
    UPDATE Expedientes
    SET EstadoID = @NuevoEstadoID,
        UltimaModificacion = GETDATE(),
        UsuarioModificacion = @UsuarioID,
        FechaRevision = CASE WHEN @NuevoEstadoID = 2 THEN GETDATE() ELSE FechaRevision END,
        FechaAprobacion = CASE WHEN @NuevoEstadoID = 3 THEN GETDATE() ELSE FechaAprobacion END
    WHERE ExpedienteID = @ExpedienteID;

    -- Registrar en historial
    INSERT INTO HistorialAprobaciones (
        ExpedienteID, EstadoAnterior, EstadoNuevo,
        UsuarioID, Accion, Comentarios
    )
    VALUES (
        @ExpedienteID, @EstadoAnterior, @NuevoEstadoID,
        @UsuarioID, @Accion, @Comentarios
    );

    COMMIT TRANSACTION;

    -- Retornar expediente actualizado
    EXEC SP_ObtenerExpediente @ExpedienteID;
END;
```

---

## 🔒 Seguridad

### Implementaciones de Seguridad

#### 1. Autenticación JWT
- Token generado al iniciar sesión
- Expiración de 24 horas
- Almacenado en localStorage (frontend)
- Validado en cada petición (backend)

#### 2. Hash de Contraseñas
```javascript
const bcrypt = require('bcryptjs');

// Generar hash
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Verificar contraseña
const isMatch = await bcrypt.compare(password, user.Password);
```

#### 3. Validación de Roles (RBAC)
- Middleware `verificarRoles(...roles)`
- Validación en frontend (UI) y backend (lógica)
- 3 roles: Técnico, Coordinador, Administrador

#### 4. Validación de Propiedad
```javascript
// Solo el técnico dueño o Admin puede editar
const esAdmin = req.user.nombreRol === 'Administrador';
const esTecnicoDueno = expediente.TecnicoRegistraID === usuarioID;

if (!esAdmin && !esTecnicoDueno) {
  return res.status(403).json({ error: 'Sin permisos' });
}
```

#### 5. Validación de Estado
```javascript
// Solo expedientes en "Borrador" pueden editarse
const esBorrador = expediente.EstadoID === 1;

if (!esBorrador && !esAdmin) {
  return res.status(403).json({
    error: 'Solo expedientes en Borrador pueden editarse'
  });
}
```

#### 6. Headers de Seguridad (Helmet)
```javascript
app.use(helmet());
// - Content-Security-Policy
// - X-Content-Type-Options
// - X-Frame-Options
// - X-XSS-Protection
```

#### 7. CORS Configurado
```javascript
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

#### 8. Tipos SQL Especificados
```javascript
// Prevención de SQL Injection
.input('ExpedienteID', sql.Int, parseInt(id))
.input('TituloExpediente', sql.NVarChar(200), titulo)
.input('FechaIncidente', sql.DateTime, new Date(fecha))
```

---

## 📸 Capturas de Código

### 1. Login con JWT

**Frontend - Login.jsx**
```javascript
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await login(email, password);

    if (response.success) {
      toast.success('¡Bienvenido al sistema DICRI!');
      navigate('/dashboard');
    } else {
      toast.error(response.error?.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    toast.error('Credenciales inválidas');
  }
};
```

**Backend - auth.controller.js**
```javascript
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await pool.request()
      .input('Email', sql.NVarChar(100), email)
      .execute('SP_ObtenerUsuarioPorEmail');

    const user = result.recordset[0];

    if (!user || !user.Activo) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas' }
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas' }
      });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        usuarioID: user.UsuarioID,
        nombreRol: user.NombreRol
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Actualizar último acceso
    await pool.request()
      .input('UsuarioID', sql.Int, user.UsuarioID)
      .execute('SP_ActualizarUltimoAcceso');

    // Retornar datos
    res.json({
      success: true,
      data: {
        token,
        user: {
          UsuarioID: user.UsuarioID,
          NombreCompleto: user.NombreCompleto,
          Email: user.Email,
          NombreRol: user.NombreRol,
        },
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error en el servidor' }
    });
  }
};
```

### 2. CRUD de Expedientes con Validaciones

**Crear Expediente (POST /api/expedientes)**
```javascript
exports.crearExpediente = async (req, res) => {
  try {
    const pool = req.app.locals.db;
    const { numeroMP, tituloExpediente, descripcion, lugarIncidente,
            fechaIncidente, prioridad, observaciones } = req.body;
    const usuarioID = req.user.usuarioID;

    const result = await pool.request()
      .input('NumeroMP', sql.NVarChar(50), numeroMP || null)
      .input('TituloExpediente', sql.NVarChar(200), tituloExpediente)
      .input('Descripcion', sql.NVarChar(sql.MAX), descripcion)
      .input('LugarIncidente', sql.NVarChar(200), lugarIncidente || null)
      .input('FechaIncidente', sql.DateTime, fechaIncidente ? new Date(fechaIncidente) : null)
      .input('TecnicoRegistraID', sql.Int, usuarioID)
      .input('Prioridad', sql.NVarChar(20), prioridad || 'Normal')
      .input('Observaciones', sql.NVarChar(sql.MAX), observaciones || null)
      .execute('SP_CrearExpediente');

    res.status(201).json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error al crear expediente:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al crear expediente' },
    });
  }
};
```

**Actualizar con Validación de Propiedad**
```javascript
exports.actualizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.db;
    const usuarioModificacion = req.user.usuarioID;

    // 1. Verificar expediente existe
    const expedienteResult = await pool.request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    const expediente = expedienteResult.recordset[0];
    if (!expediente) {
      return res.status(404).json({
        success: false,
        error: { message: 'Expediente no encontrado' }
      });
    }

    // 2. Validar permisos
    const esAdmin = req.user.nombreRol === 'Administrador';
    const esTecnicoDueno = expediente.TecnicoRegistraID === usuarioModificacion;
    const esBorrador = expediente.EstadoID === 1;

    if (!esAdmin && (!esTecnicoDueno || !esBorrador)) {
      return res.status(403).json({
        success: false,
        error: {
          message: esTecnicoDueno
            ? 'Solo puedes editar expedientes en estado Borrador'
            : 'No tienes permiso para editar este expediente',
        },
      });
    }

    // 3. Actualizar
    const result = await pool.request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .input('NumeroMP', sql.NVarChar(50), req.body.numeroMP || null)
      .input('TituloExpediente', sql.NVarChar(200), req.body.tituloExpediente)
      .input('Descripcion', sql.NVarChar(sql.MAX), req.body.descripcion)
      .input('LugarIncidente', sql.NVarChar(200), req.body.lugarIncidente || null)
      .input('FechaIncidente', sql.DateTime, req.body.fechaIncidente ? new Date(req.body.fechaIncidente) : null)
      .input('Prioridad', sql.NVarChar(20), req.body.prioridad || 'Normal')
      .input('Observaciones', sql.NVarChar(sql.MAX), req.body.observaciones || null)
      .input('UsuarioModificacion', sql.Int, usuarioModificacion)
      .execute('SP_ActualizarExpediente');

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Expediente actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar expediente:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al actualizar expediente' },
    });
  }
};
```

### 3. Dashboard con Gráficos

**Frontend - Dashboard.jsx**
```javascript
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await reportesService.obtenerDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const estadosData = [
    { name: 'Borrador', value: totales.EnBorrador || 0, color: '#9E9E9E' },
    { name: 'En Revisión', value: totales.EnRevision || 0, color: '#2196F3' },
    { name: 'Aprobados', value: totales.Aprobados || 0, color: '#4CAF50' },
    { name: 'Rechazados', value: totales.Rechazados || 0, color: '#F44336' },
  ];

  return (
    <Box>
      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expedientes"
            value={totales.TotalExpedientes || 0}
            icon={<Folder />}
            gradient="linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
          />
        </Grid>
        {/* ... más cards */}
      </Grid>

      {/* Gráfico de Estados */}
      <Paper elevation={3}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={estadosData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {estadosData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};
```

### 4. Flujo de Aprobaciones

**Backend - Aprobar Expediente**
```javascript
exports.aprobarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;
    const pool = req.app.locals.db;
    const usuarioID = req.user.usuarioID;

    // Validar que el expediente está en revisión
    const expediente = await pool.request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .execute('SP_ObtenerExpediente');

    if (!expediente.recordset[0]) {
      return res.status(404).json({
        success: false,
        error: { message: 'Expediente no encontrado' }
      });
    }

    if (expediente.recordset[0].EstadoID !== 2) {
      return res.status(400).json({
        success: false,
        error: { message: 'El expediente no está en revisión' },
      });
    }

    // Cambiar estado a "Aprobado" (ID: 3)
    const result = await pool.request()
      .input('ExpedienteID', sql.Int, parseInt(id))
      .input('NuevoEstadoID', sql.Int, 3)
      .input('UsuarioID', sql.Int, usuarioID)
      .input('Accion', sql.NVarChar(50), 'Aprobación')
      .input('Comentarios', sql.NVarChar(sql.MAX), comentarios || null)
      .execute('SP_CambiarEstadoExpediente');

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Expediente aprobado exitosamente',
    });
  } catch (error) {
    console.error('Error al aprobar expediente:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al aprobar expediente' },
    });
  }
};
```

**Frontend - Página de Aprobaciones**
```javascript
const Aprobaciones = () => {
  const [expedientes, setExpedientes] = useState([]);
  const { user } = useAuth();

  const handleAprobar = async (expedienteID) => {
    try {
      const comentarios = prompt('Comentarios de aprobación (opcional):');

      const response = await aprobacionesService.aprobar(expedienteID, comentarios);

      if (response.success) {
        toast.success('Expediente aprobado exitosamente');
        loadExpedientes();
      }
    } catch (error) {
      toast.error('Error al aprobar expediente');
    }
  };

  const handleRechazar = async (expedienteID) => {
    try {
      const justificacion = prompt('Justificación del rechazo (requerida):');

      if (!justificacion) {
        toast.error('Debes proporcionar una justificación');
        return;
      }

      const response = await aprobacionesService.rechazar(expedienteID, justificacion);

      if (response.success) {
        toast.success('Expediente rechazado');
        loadExpedientes();
      }
    } catch (error) {
      toast.error('Error al rechazar expediente');
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Técnico</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expedientes.map((exp) => (
              <TableRow key={exp.ExpedienteID}>
                <TableCell>{exp.NumeroExpediente}</TableCell>
                <TableCell>{exp.TituloExpediente}</TableCell>
                <TableCell>{exp.NombreTecnico}</TableCell>
                <TableCell>
                  <Chip label={exp.Prioridad} color={getPrioridadColor(exp.Prioridad)} />
                </TableCell>
                <TableCell align="center">
                  <Button
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleAprobar(exp.ExpedienteID)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => handleRechazar(exp.ExpedienteID)}
                  >
                    Rechazar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
```

### 5. Docker Compose

**Archivo:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # SQL Server 2022
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: dicri-sqlserver
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
      - ./backend/database:/docker-entrypoint-initdb.d
    networks:
      - dicri-network
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -Q "SELECT 1" || exit 1
      interval: 10s
      timeout: 3s
      retries: 10
      start_period: 10s

  # Backend - Node.js API
  backend:
    build: ./backend
    container_name: dicri-backend
    environment:
      - PORT=5001
      - DB_USER=sa
      - DB_PASSWORD=YourStrong@Passw0rd
      - DB_SERVER=sqlserver
      - DB_PORT=1433
      - DB_DATABASE=DICRI_DB
      - JWT_SECRET=your-super-secret-jwt-key-change-in-production
      - NODE_ENV=development
    ports:
      - "5001:5001"
    depends_on:
      sqlserver:
        condition: service_healthy
    networks:
      - dicri-network
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  # Frontend - React + Vite
  frontend:
    build: ./frontend
    container_name: dicri-frontend
    environment:
      - VITE_API_URL=http://localhost:5001/api
    ports:
      - "3001:3001"
    depends_on:
      - backend
    networks:
      - dicri-network
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev -- --host

networks:
  dicri-network:
    driver: bridge

volumes:
  sqlserver_data:
```

---

## 🎓 Conclusiones

El Sistema DICRI es una aplicación robusta, segura y escalable que cumple con todos los requerimientos funcionales y no funcionales establecidos.

### Logros Principales

✅ **Arquitectura de 3 capas** bien definida y separada
✅ **API REST** completa con 20+ endpoints
✅ **Autenticación JWT** con roles y permisos
✅ **Base de datos normalizada** con stored procedures
✅ **UI/UX moderno** con Material-UI y gradientes institucionales
✅ **Logo oficial** del Ministerio Público integrado
✅ **Dockerizado** para fácil despliegue
✅ **Validaciones de seguridad** en frontend y backend
✅ **Dashboard analítico** con gráficos interactivos
✅ **Flujo de aprobación** multinivel implementado

### Tecnologías Modernas

- React 18 con Hooks
- Node.js 20+ con ES6+
- SQL Server 2022
- Docker & Docker Compose
- Material-UI 5
- JWT Authentication
- Bcrypt para seguridad

---

**Desarrollado con ❤️ por Rivaldo Alexander Tojín**
**Ministerio Público de Guatemala - 2025**
