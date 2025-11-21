# 🚀 Guía de Deployment a Railway

Esta guía explica cómo desplegar el Sistema DICRI a producción usando Railway.app con CI/CD automático.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Arquitectura en Railway](#arquitectura-en-railway)
- [Configuración Paso a Paso](#configuración-paso-a-paso)
- [Variables de Entorno](#variables-de-entorno)
- [CI/CD con GitHub Actions](#cicd-con-github-actions)
- [Verificación Post-Deployment](#verificación-post-deployment)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

- ✅ Cuenta de GitHub (con este repositorio)
- ✅ Cuenta de Railway.app ([Crear cuenta gratis](https://railway.app))
- ✅ Código en este repositorio actualizado

---

## 🏗️ Arquitectura en Railway

Railway desplegará 3 servicios conectados:

```
┌──────────────────────────────────────────────┐
│              Railway Project                 │
│                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │  Frontend  │  │  Backend   │  │SQL     ││
│  │  (React)   │─>│ (Node.js)  │─>│Server  ││
│  │  Port 3000 │  │  Port 5000 │  │Port    ││
│  │            │  │            │  │1433    ││
│  └────────────┘  └────────────┘  └────────┘│
│       ↓              ↓              ↓       │
│  [Public URL]   [Public URL]   [Private]   │
│  dicri.up       dicri-api.up                │
│  .railway.app   .railway.app                │
└──────────────────────────────────────────────┘
```

---

## 📦 Configuración Paso a Paso

### **1. Crear Proyecto en Railway**

1. Ve a [Railway.app](https://railway.app) e inicia sesión con GitHub
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tus repositorios
5. Selecciona el repositorio `PruebaTecnicaDS`
6. Railway detectará automáticamente Docker Compose

### **2. Configurar Servicio de SQL Server**

Railway creará automáticamente los servicios desde `docker-compose.yml`, pero necesitas configurar variables:

1. En el proyecto de Railway, selecciona el servicio **"database"**
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```env
ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=TuPasswordSuperSeguro2024!
MSSQL_PID=Express
```

4. **IMPORTANTE**: Copia el password, lo necesitarás para el backend

### **3. Configurar Servicio de Backend**

1. Selecciona el servicio **"backend"**
2. Ve a **"Variables"** y agrega:

```env
NODE_ENV=production
PORT=5000

# Database (usar servicio interno de Railway)
DB_HOST=database.railway.internal
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=TuPasswordSuperSeguro2024!
DB_NAME=DICRI_DB

# JWT Secrets (generar nuevos)
JWT_SECRET=tu-jwt-secret-generado-con-openssl
JWT_REFRESH_SECRET=tu-jwt-refresh-secret-generado
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# CORS (URL del frontend - se configura después)
CORS_ORIGIN=https://dicri-frontend.up.railway.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads
```

3. Ve a **"Settings"** → **"Networking"**
4. Click en **"Generate Domain"** para obtener URL pública
5. **Copia la URL** (ejemplo: `https://dicri-api.up.railway.app`)

### **4. Configurar Servicio de Frontend**

1. Selecciona el servicio **"frontend"**
2. Ve a **"Variables"** y agrega:

```env
# URL del backend (la que copiaste en el paso anterior)
VITE_API_URL=https://dicri-api.up.railway.app

# App info
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
```

3. Ve a **"Settings"** → **"Networking"**
4. Click en **"Generate Domain"** para obtener URL pública
5. **Copia la URL** del frontend

### **5. Actualizar CORS en Backend**

1. Regresa al servicio **"backend"**
2. Actualiza la variable `CORS_ORIGIN` con la URL del frontend:

```env
CORS_ORIGIN=https://dicri-frontend.up.railway.app
```

3. Railway re-desplegará automáticamente

---

## 🔐 Variables de Entorno

### **Generar JWT Secrets seguros:**

Ejecuta en tu terminal local:

```bash
# Para JWT_SECRET
openssl rand -base64 64

# Para JWT_REFRESH_SECRET
openssl rand -base64 64
```

Copia los valores generados y úsalos en Railway.

### **Resumen de Variables por Servicio:**

#### **SQL Server (database)**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ACCEPT_EULA` | Y | Aceptar términos de SQL Server |
| `MSSQL_SA_PASSWORD` | `Password!2024` | Password del usuario SA |
| `MSSQL_PID` | Express | Edición de SQL Server |

#### **Backend (Node.js)**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | production | Ambiente de ejecución |
| `PORT` | 5000 | Puerto interno |
| `DB_HOST` | database.railway.internal | Host de SQL Server |
| `DB_PASSWORD` | (mismo que MSSQL_SA_PASSWORD) | Password de DB |
| `JWT_SECRET` | (generado) | Secret para tokens |
| `CORS_ORIGIN` | (URL frontend) | Origen permitido |

#### **Frontend (React)**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | (URL backend) | URL del API |

---

## 🔄 CI/CD con GitHub Actions

El proyecto incluye un workflow de CI/CD en `.github/workflows/ci.yml` que:

### **Triggers:**
- ✅ Pull Requests a `main`, `master`, o `develop`
- ✅ Push a `main`, `master`, o `develop`

### **Jobs ejecutados:**

1. **Backend Tests** 🧪
   - Ejecuta `npm test` en `/backend`
   - Sube reporte de cobertura a Codecov

2. **Backend Lint** 🔍
   - Ejecuta ESLint para validar código

3. **Frontend Build** 🏗️
   - Ejecuta `npm run build`
   - Verifica que el build sea exitoso

4. **Docker Validation** 🐋
   - Valida que las imágenes Docker se construyan correctamente
   - Usa caché para acelerar builds

5. **Pipeline Status** ✅
   - Resumen del estado de todos los jobs

### **Flujo de Trabajo:**

```
Developer                    GitHub                   Railway
    │                          │                        │
    ├─ git push origin main ──>│                        │
    │                          │                        │
    │                     [GitHub Actions]              │
    │                          │                        │
    │                     ✓ Run tests                   │
    │                     ✓ Lint code                   │
    │                     ✓ Build frontend              │
    │                     ✓ Validate Docker             │
    │                          │                        │
    │                     Tests pass? ✅                 │
    │                          │                        │
    │                          ├─ Trigger webhook ─────>│
    │                          │                        │
    │                          │                   [Railway]
    │                          │                        │
    │                          │                   ✓ Pull código
    │                          │                   ✓ Build images
    │                          │                   ✓ Deploy servicios
    │                          │                   ✓ Run migrations
    │                          │                        │
    │<─────────────── Deployment exitoso ───────────────┤
```

### **Configurar Deploy Automático en Railway:**

Railway ya hace deploy automático cuando detecta cambios en `main`. Para verificar:

1. Ve a **Settings** del proyecto
2. En **Deployments** verifica que:
   - ✅ **Auto Deploy**: Enabled
   - ✅ **Branch**: main

---

## ✅ Verificación Post-Deployment

### **1. Verificar Servicios Activos**

En Railway Dashboard:
- ✅ Database: Estado "Active" (verde)
- ✅ Backend: Estado "Active" (verde)
- ✅ Frontend: Estado "Active" (verde)

### **2. Verificar Backend API**

```bash
# Health check
curl https://tu-backend.up.railway.app/health

# Respuesta esperada:
{
  "status": "OK",
  "timestamp": "2024-11-21T...",
  "uptime": 123.45
}
```

### **3. Verificar Base de Datos**

En Railway, ve a los logs del servicio **database** y busca:
```
SQL Server is now ready for client connections
```

### **4. Verificar Frontend**

Abre la URL del frontend en el navegador:
```
https://tu-frontend.up.railway.app
```

Deberías ver la página de login.

### **5. Prueba End-to-End**

1. Abre el frontend en el navegador
2. Intenta hacer login con:
   - Email: `tecnico@mp.gob.gt`
   - Password: `Password123!`
3. Si funciona, ✅ deployment exitoso

---

## 📊 Monitoreo y Logs

### **Ver Logs en Tiempo Real:**

1. En Railway Dashboard, selecciona un servicio
2. Click en **"Deployments"**
3. Click en el deployment activo
4. Verás logs en tiempo real

### **Logs por Servicio:**

**SQL Server:**
```bash
# Buscar en logs:
- "SQL Server is now ready for client connections"
- Errores de conexión
```

**Backend:**
```bash
# Buscar en logs:
- "✅ Conexión a SQL Server establecida"
- "Servidor escuchando en puerto 5000"
- Errores de API
```

**Frontend:**
```bash
# Buscar en logs:
- Build output
- Errores de compilación
```

### **Comandos Útiles:**

Railway CLI (opcional):
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Ver logs
railway logs --service backend
railway logs --service database
railway logs --service frontend
```

---

## 🐛 Troubleshooting

### **Problema: Backend no se conecta a Database**

**Síntomas:**
- Error: "Failed to connect to SQL Server"
- Backend en crash loop

**Solución:**
1. Verificar que `DB_HOST=database.railway.internal`
2. Verificar que `DB_PASSWORD` coincida con `MSSQL_SA_PASSWORD`
3. Esperar 2-3 minutos para que SQL Server termine de iniciar

### **Problema: Frontend muestra error CORS**

**Síntomas:**
- Error en consola: "Access-Control-Allow-Origin"

**Solución:**
1. Verificar `CORS_ORIGIN` en backend tenga la URL correcta del frontend
2. No incluir trailing slash: ❌ `https://frontend/` → ✅ `https://frontend`
3. Re-desplegar backend después de cambiar CORS_ORIGIN

### **Problema: Database consume mucho RAM**

**Síntomas:**
- Servicio de database reiniciándose
- Factura de Railway alta

**Solución:**
1. SQL Server necesita mínimo 2GB RAM
2. Considera upgrading el plan de Railway
3. O migrar a PostgreSQL para free tier

### **Problema: Build falla en GitHub Actions**

**Síntomas:**
- ❌ Tests fallan
- ❌ Build de frontend falla

**Solución:**
1. Revisar logs en GitHub Actions
2. Ejecutar tests localmente: `npm test`
3. Verificar que todas las dependencias estén en `package.json`

### **Problema: Deployment lento**

**Síntomas:**
- Railway tarda más de 10 minutos

**Solución:**
1. SQL Server puede tardar 2-3 minutos en iniciar (es normal)
2. Verificar que `healthcheck` en docker-compose.yml esté configurado
3. Backend espera a que database esté healthy antes de iniciar

---

## 💰 Costos Estimados

Railway pricing (aprox.):

| Recurso | Consumo | Costo/mes |
|---------|---------|-----------|
| Frontend | ~0.5 GB RAM | ~$2 |
| Backend | ~1 GB RAM | ~$4 |
| SQL Server | ~2 GB RAM | ~$8 |
| **Total** | | **~$14/mes** |

**Crédito gratis:** $5/mes

**Costo real inicial:** ~$9/mes

---

## 🎯 Checklist de Deployment

Antes de considerarlo completo:

- [ ] Los 3 servicios están en estado "Active" (verde)
- [ ] Health check del backend responde correctamente
- [ ] Frontend carga sin errores en el navegador
- [ ] Login funciona correctamente
- [ ] CRUD de expedientes funciona
- [ ] Swagger docs accesible en `/api-docs`
- [ ] GitHub Actions ejecutándose correctamente
- [ ] Variables de entorno configuradas en Railway
- [ ] Secrets de JWT son únicos (no los de ejemplo)
- [ ] CORS_ORIGIN apunta al frontend correcto

---

## 📚 Recursos Adicionales

- [Railway Docs](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Compose en Railway](https://docs.railway.app/deploy/deployments#docker-compose)

---

## 📧 Soporte

Si tienes problemas durante el deployment:

1. Revisa los logs en Railway Dashboard
2. Verifica las variables de entorno
3. Consulta esta documentación
4. Revisa los issues en GitHub del proyecto

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0.0
**Desarrollador:** Rivaldo Alexander Tojín
