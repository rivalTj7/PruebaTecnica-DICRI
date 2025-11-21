# Railway Setup - Guía Paso a Paso

Esta guía te llevará a través de la configuración completa de Railway para el proyecto DICRI.

## 📋 Prerequisitos

- Cuenta en Railway (https://railway.app)
- Railway CLI instalado
- Acceso al repositorio GitHub

## 🚀 Paso 1: Login a Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Verificar login
railway whoami
```

## 🏗️ Paso 2: Crear Proyectos

Necesitas crear **3 proyectos** separados:

### Proyecto 1: DICRI Production

```bash
# Crear proyecto
railway init --name dicri-production

# Link al proyecto
railway link dicri-production
```

### Proyecto 2: DICRI Staging

```bash
railway init --name dicri-staging
railway link dicri-staging
```

### Proyecto 3: DICRI Development

```bash
railway init --name dicri-development
railway link dicri-development
```

## 🗄️ Paso 3: Agregar Databases

Para cada proyecto, agregar SQL Server:

```bash
# Link al proyecto
railway link dicri-production

# Agregar SQL Server
railway add --database mssql

# Repetir para staging y development
```

**En Railway Dashboard:**

1. Ve al proyecto
2. Click en **New** → **Database** → **Add SQL Server**
3. Espera a que se aprovisione
4. Las variables `MSSQL_*` se generan automáticamente

## 🔧 Paso 4: Configurar Servicios

### Backend Service

#### En Railway Dashboard:

1. **New** → **Empty Service**
2. **Name**: `dicri-backend-prod` (o según ambiente)
3. **Settings**:
   - **Source**: Connect to GitHub
   - **Repository**: `rivalTj7/PruebaTecnica-DICRI`
   - **Branch**: 
     - Production: `main`
     - Staging: `staging`
     - Development: `develop`

4. **Root Directory**: `/backend`

5. **Build & Deploy**:
   - **Build Command**: `npm ci`
   - **Start Command**: `npm run migrate && npm start`
   - **Watch Paths**: `backend/**`

6. **Variables** (ver Paso 5)

### Frontend Service

#### En Railway Dashboard:

1. **New** → **Empty Service**
2. **Name**: `dicri-frontend-prod` (o según ambiente)
3. **Settings**:
   - **Source**: Connect to GitHub
   - **Repository**: `rivalTj7/PruebaTecnica-DICRI`
   - **Branch**: 
     - Production: `main`
     - Staging: `staging`
     - Development: `develop`

4. **Root Directory**: `/frontend`

5. **Build & Deploy**:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Watch Paths**: `frontend/**`

6. **Variables** (ver Paso 5)

## 🔐 Paso 5: Configurar Variables de Entorno

### Backend Variables

#### Via Railway Dashboard:

**Variables → Add Variable**

```bash
# Node
NODE_ENV=production
PORT=5000

# Database (auto-populated)
DB_HOST=${{MSSQL.HOST}}
DB_PORT=${{MSSQL.PORT}}
DB_USER=${{MSSQL.USER}}
DB_PASSWORD=${{MSSQL.PASSWORD}}
DB_NAME=${{MSSQL.DATABASE}}
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false

# JWT (generar nuevos)
JWT_SECRET=<tu-secret-generado>
JWT_REFRESH_SECRET=<tu-refresh-secret-generado>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# CORS (URL del frontend)
CORS_ORIGIN=${{FRONTEND_URL}}

# Logging
LOG_LEVEL=info
```

#### Via Railway CLI:

```bash
# Link al servicio
railway link dicri-production

# Agregar variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=<tu-secret>
railway variables set JWT_REFRESH_SECRET=<tu-refresh-secret>
railway variables set CORS_ORIGIN=https://dicri-frontend-prod.railway.app

# Ver variables
railway variables
```

### Frontend Variables

#### Via Railway Dashboard:

```bash
# API URL (URL del backend)
VITE_API_URL=${{BACKEND_URL}}

# App Config
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

#### Via Railway CLI:

```bash
railway link dicri-production
railway variables set VITE_API_URL=https://dicri-backend-prod.railway.app
railway variables set VITE_APP_ENV=production
```

## 🔗 Paso 6: Conectar Servicios

### Service References

Para que el frontend conozca la URL del backend:

**Frontend Variables:**
```bash
VITE_API_URL=${{dicri-backend-prod.url}}
```

**Backend Variables:**
```bash
CORS_ORIGIN=${{dicri-frontend-prod.url}}
```

### Networking

Por defecto, Railway crea una red privada entre servicios del mismo proyecto.

Para acceso público:
1. **Settings** → **Networking**
2. **Generate Domain** (para cada servicio)
3. Opcional: Agregar dominio personalizado

## 🔒 Paso 7: Generar JWT Secrets

```bash
# Generar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O usar el script incluido
node generate-hash.js
```

**⚠️ IMPORTANTE**: Usa secrets diferentes para cada ambiente.

## 🚢 Paso 8: Primer Deploy

### Via GitHub (Automático)

```bash
# Push a la rama correspondiente
git push origin main      # Deploy a production
git push origin staging   # Deploy a staging
git push origin develop   # Deploy a development
```

### Via Railway CLI (Manual)

```bash
# Link al proyecto y servicio
railway link dicri-production

# Deploy backend
cd backend
railway up --service dicri-backend-prod

# Deploy frontend
cd ../frontend
railway up --service dicri-frontend-prod
```

## 📊 Paso 9: Verificar Deployment

### Check Logs

```bash
# Via CLI
railway logs --service dicri-backend-prod

# Via Dashboard
# Project → Service → Deployments → View Logs
```

### Health Checks

```bash
# Backend
curl https://dicri-backend-prod.railway.app/health

# Frontend
curl https://dicri-frontend-prod.railway.app
```

### Test API

```bash
# Login endpoint
curl -X POST https://dicri-backend-prod.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin123!"}'
```

## 🔄 Paso 10: Configurar Auto-Deploy

### Via GitHub Integration

**Railway Dashboard:**

1. **Service Settings**
2. **Source** → **Configure**
3. **Auto-Deploy**: ✅ Enabled
4. **Branch**: Select branch
5. **Watch Paths**: Configure paths

### Via railway.json

Ya configurado en el proyecto:
- `backend/railway.json`
- `frontend/railway.json`

## 📝 Configuración por Ambiente

### Production

```bash
PROJECT: dicri-production
SERVICES:
  - dicri-backend-prod (branch: main)
  - dicri-frontend-prod (branch: main)
  - dicri-database-prod

DOMAIN:
  - backend: https://dicri-backend-prod.railway.app
  - frontend: https://dicri-frontend-prod.railway.app
```

### Staging

```bash
PROJECT: dicri-staging
SERVICES:
  - dicri-backend-staging (branch: staging)
  - dicri-frontend-staging (branch: staging)
  - dicri-database-staging

DOMAIN:
  - backend: https://dicri-backend-staging.railway.app
  - frontend: https://dicri-frontend-staging.railway.app
```

### Development

```bash
PROJECT: dicri-development
SERVICES:
  - dicri-backend-dev (branch: develop)
  - dicri-frontend-dev (branch: develop)
  - dicri-database-dev

DOMAIN:
  - backend: https://dicri-backend-dev.railway.app
  - frontend: https://dicri-frontend-dev.railway.app
```

## 🎯 Obtener Railway Token para GitHub Actions

```bash
# Login
railway login

# Obtener token
railway whoami --json | jq -r .token

# O desde Dashboard
# Account Settings → Tokens → Create Token
```

**Agregar a GitHub Secrets:**
1. GitHub Repo → Settings → Secrets
2. New repository secret
3. Name: `RAILWAY_TOKEN`
4. Value: `<tu-token>`

## 📋 Checklist de Setup

- [ ] Railway CLI instalado
- [ ] 3 proyectos creados (prod, staging, dev)
- [ ] SQL Server agregado a cada proyecto
- [ ] Backend service configurado
- [ ] Frontend service configurado
- [ ] Variables de entorno configuradas
- [ ] JWT secrets generados y configurados
- [ ] Service references configuradas
- [ ] Dominios generados
- [ ] Primer deploy exitoso
- [ ] Health checks pasando
- [ ] Railway token agregado a GitHub
- [ ] Auto-deploy configurado

## 🐛 Troubleshooting

### Error: "Build failed"

```bash
# Ver logs
railway logs --service dicri-backend-prod

# Verificar package.json
# Verificar Node version
```

### Error: "Database connection failed"

```bash
# Verificar variables
railway variables | grep DB

# Test connection
railway run node -e "const sql = require('mssql'); ..."
```

### Error: "Service not accessible"

```bash
# Verificar dominio generado
railway domain

# Regenerar dominio si es necesario
railway domain --generate
```

## 📚 Recursos

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Railway Templates](https://railway.app/templates)

## 🆘 Soporte

- Railway Discord: https://discord.gg/railway
- Railway Support: support@railway.app
- Documentación del proyecto: Ver `CICD-DEPLOYMENT-GUIDE.md`

---

**Última actualización**: 21 de noviembre de 2025
