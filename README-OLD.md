# Sistema de Gestión de Evidencias - DICRI
## Ministerio Público de Guatemala

Sistema integral para la gestión de expedientes e indicios de la Dirección de Investigación Criminalística (DICRI).

## 🚀 Características Principales

- **Gestión de Expedientes**: Registro completo de expedientes con datos generales y trazabilidad
- **Gestión de Indicios**: Registro detallado de evidencias (descripción, color, tamaño, peso, ubicación)
- **Sistema de Aprobación**: Workflow de revisión por coordinadores con justificación de rechazos
- **Reportes y Estadísticas**: Generación de informes con filtros por fechas y estados
- **Autenticación y Roles**: Control de acceso basado en roles (Técnico, Coordinador, Administrador)
- **Interfaz Intuitiva**: UI/UX moderna y profesional

## 🏗️ Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React.js      │─────▶│   Node.js +     │─────▶│   SQL Server    │
│   Frontend      │      │   Express API   │      │   Database      │
│   (Port 3000)   │◀─────│   (Port 5000)   │◀─────│   (Port 1433)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🛠️ Stack Tecnológico

### Frontend
- React.js 18
- React Router DOM
- Axios
- Material-UI / Tailwind CSS
- Chart.js (para estadísticas)

### Backend
- Node.js
- Express.js
- JWT para autenticación
- bcrypt para encriptación
- mssql (SQL Server driver)
- Swagger para documentación API

### Base de Datos
- SQL Server
- Procedimientos almacenados para todas las operaciones

### DevOps
- Docker & Docker Compose
- Jest para pruebas unitarias

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Git

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd PruebaTecnicaDS
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Iniciar con Docker

**Para Windows Intel/AMD (la mayoría de PCs):**
```powershell
# ⭐ RECOMENDADO: Script automático
.\start.ps1

# Alternativa manual:
docker-compose down -v
docker-compose up -d
```

**Para Linux:**
```bash
docker-compose up -d
```

**Para Mac Apple Silicon (M1/M2/M3):**
```bash
# Consulta MAC-ARM64-SETUP.md para configuración específica
docker-compose up -d
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs

## ⚙️ Configuración Específica por Plataforma

### Windows Intel/AMD (⭐ RECOMENDADO)

**La forma más fácil de iniciar:**
```powershell
# Ejecutar desde PowerShell en el directorio del proyecto
.\start.ps1
```

Este script automáticamente:
- Limpia contenedores y volúmenes anteriores
- Inicia todos los servicios con la configuración correcta
- Espera a que todo esté funcionando

**¿Qué usar?**
- `docker-compose.yml` - Configuración principal (funciona en Windows AMD64, Linux)
- `start.ps1` - Script de inicio rápido para Windows

**Recursos mínimos recomendados en Docker Desktop:**
- Memory: 4 GB (recomendado 6 GB)
- CPUs: 2 cores
- Disk: 20 GB libres

**Si tienes problemas:**
- **[troubleshoot-database.md](troubleshoot-database.md)** - Soluciones para problemas de base de datos
- **[WINDOWS-WSL2-SETUP.md](WINDOWS-WSL2-SETUP.md)** - Configuración avanzada

**Nota importante:** El proyecto ahora usa SQL Server 2022 estándar que funciona perfectamente en Windows con procesadores Intel/AMD.

### Mac Apple Silicon (M1/M2/M3)
Si estás en Mac con Apple Silicon, consulta:
- **[MAC-ARM64-SETUP.md](MAC-ARM64-SETUP.md)** - Guía para Mac ARM64

### Linux
Usa el `docker-compose.yml` estándar. Funciona sin configuración adicional.

## 👥 Usuarios por Defecto

```
Administrador:
- Email: admin@mp.gob.gt
- Password: Admin123!

Coordinador:
- Email: coordinador@mp.gob.gt
- Password: Coord123!

Técnico:
- Email: tecnico@mp.gob.gt
- Password: Tecnico123!
```

## 📁 Estructura del Proyecto

```
PruebaTecnicaDS/
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── utils/
│   └── package.json
├── backend/            # API Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
├── database/           # Scripts SQL Server
│   ├── schema.sql
│   ├── stored-procedures/
│   └── seed-data.sql
├── docs/              # Documentación
│   ├── manual-tecnico.md
│   ├── arquitectura.md
│   └── diagrams/
├── tests/             # Pruebas
└── docker-compose.yml
```

## 🔄 Workflow de Expedientes

1. **Registro**: Técnico crea expediente y registra indicios
2. **Revisión**: Coordinador revisa el expediente completo
3. **Aprobación/Rechazo**:
   - Aprobado: Expediente finalizado
   - Rechazado: Requiere justificación, vuelve a técnico
4. **Corrección**: Técnico corrige y reenvía a revisión
5. **Finalización**: Expediente aprobado y cerrado

## 📊 Módulos del Sistema

### 1. Autenticación
- Login con email y password
- JWT tokens
- Refresh tokens
- Control de roles

### 2. Gestión de Expedientes
- CRUD completo de expedientes
- Asignación a técnicos
- Estados: Borrador, En Revisión, Aprobado, Rechazado
- Historial de cambios

### 3. Gestión de Indicios
- Registro detallado de evidencias
- Fotografías/archivos adjuntos
- Cadena de custodia
- Ubicación geográfica

### 4. Aprobaciones
- Vista de expedientes pendientes
- Aprobación/rechazo masivo
- Comentarios y justificaciones
- Notificaciones

### 5. Reportes
- Dashboard con estadísticas
- Reportes por fecha, técnico, estado
- Exportación a PDF/Excel
- Gráficos interactivos

## 🧪 Pruebas

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `POST /api/auth/logout` - Cerrar sesión

### Expedientes
- `GET /api/expedientes` - Listar expedientes
- `POST /api/expedientes` - Crear expediente
- `GET /api/expedientes/:id` - Obtener expediente
- `PUT /api/expedientes/:id` - Actualizar expediente
- `DELETE /api/expedientes/:id` - Eliminar expediente

### Indicios
- `GET /api/expedientes/:id/indicios` - Listar indicios
- `POST /api/expedientes/:id/indicios` - Crear indicio
- `PUT /api/indicios/:id` - Actualizar indicio
- `DELETE /api/indicios/:id` - Eliminar indicio

### Aprobaciones
- `GET /api/aprobaciones/pendientes` - Expedientes pendientes
- `POST /api/aprobaciones/:id/aprobar` - Aprobar expediente
- `POST /api/aprobaciones/:id/rechazar` - Rechazar expediente

### Reportes
- `GET /api/reportes/estadisticas` - Estadísticas generales
- `GET /api/reportes/expedientes` - Reporte de expedientes
- `POST /api/reportes/export` - Exportar reporte

## 🐳 Docker

### Construcción de imágenes

```bash
docker-compose build
```

### Ver logs

```bash
docker-compose logs -f
```

### Detener servicios

```bash
docker-compose down
```

### Limpiar volúmenes

```bash
docker-compose down -v
```

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- JWT con expiración
- Validación de datos en frontend y backend
- Protección CORS
- Rate limiting
- SQL injection prevention (procedimientos almacenados)
- XSS protection

## 📧 Contacto

Ministerio Público de Guatemala - DICRI
Coordinación del Sistema Informático Integrado - CSII
Tel. 23160000 Ext.10510

## 📄 Licencia

Este proyecto es de uso interno del Ministerio Público de Guatemala.

---

**Desarrollado para la Dirección de Investigación Criminalística (DICRI)**
