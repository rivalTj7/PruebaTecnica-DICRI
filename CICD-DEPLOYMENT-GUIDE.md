# Guía de CI/CD y Deployment - DICRI

## 📋 Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Estructura de Ramas](#estructura-de-ramas)
4. [Workflows de CI/CD](#workflows-de-cicd)
5. [Despliegue en Railway](#despliegue-en-railway)
6. [Variables de Entorno](#variables-de-entorno)
7. [Deployment Manual](#deployment-manual)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisitos

### Software Requerido
- Node.js 18.x o superior
- Git 2.x o superior
- Railway CLI (`npm install -g @railway/cli`)
- Cuenta en GitHub
- Cuenta en Railway

### Accesos Necesarios
- Acceso al repositorio GitHub
- Token de Railway con permisos de deployment
- Acceso a GitHub Secrets del repositorio

---

## 🚀 Configuración Inicial

### 1. Configurar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/rivalTj7/PruebaTecnica-DICRI.git
cd PruebaTecnica-DICRI

# Instalar Railway CLI
npm install -g @railway/cli

# Login a Railway
railway login
```

### 2. Crear las Ramas Necesarias

**En Windows (PowerShell):**
```powershell
.\scripts\setup-branches.ps1
```

**En Linux/Mac:**
```bash
chmod +x scripts/setup-branches.sh
./scripts/setup-branches.sh
```

**Manualmente:**
```bash
# Crear y push de ramas
git checkout -b develop
git push -u origin develop

git checkout -b staging
git push -u origin staging

git checkout main
git push -u origin main
```

### 3. Configurar GitHub Secrets

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions

Agrega los siguientes secrets:

#### Secrets Requeridos
```
RAILWAY_TOKEN           # Token de Railway CLI
JWT_SECRET             # Secret para JWT tokens
JWT_REFRESH_SECRET     # Secret para refresh tokens

# URLs de los servicios
PROD_API_URL           # https://dicri-backend-prod.railway.app
STAGING_API_URL        # https://dicri-backend-staging.railway.app
DEV_API_URL            # https://dicri-backend-dev.railway.app
```

#### Obtener Railway Token
```bash
railway login
railway whoami --json | jq -r .token
```

---

## 🌳 Estructura de Ramas

### Ramas Principales

```
main (producción)
  ↑
staging (pre-producción)
  ↑
develop (desarrollo)
  ↑
feature/* (características)
```

### Políticas de Ramas

#### `main` - Producción
- **Protegida**: Requiere PR aprobado
- **CI/CD**: Deploy automático a Railway producción
- **Merges desde**: Solo desde `staging`
- **Tags**: Versiones semánticas (v1.0.0)

#### `staging` - Pre-producción
- **Protegida**: Requiere PR aprobado
- **CI/CD**: Deploy automático a Railway staging
- **Merges desde**: Solo desde `develop`
- **Testing**: QA completo

#### `develop` - Desarrollo
- **Protegida**: Requiere PR aprobado
- **CI/CD**: Deploy automático a Railway dev
- **Merges desde**: Feature branches
- **Testing**: Tests automatizados

### Nombrado de Branches

```bash
# Features
feature/DICRI-123-auth-module
feature/DICRI-456-reports-page

# Bugfixes
bugfix/DICRI-789-fix-login-error
bugfix/DICRI-012-validation-issue

# Hotfixes
hotfix/DICRI-345-critical-security-patch
```

---

## ⚙️ Workflows de CI/CD

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Trigger**: Push y PR a `main`, `staging`, `develop`

**Jobs**:
- ✅ Backend Tests
- ✅ Backend Lint
- ✅ Frontend Build
- ✅ Docker Validation
- ✅ Pipeline Status

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Trigger**: Push a `main`, `staging`, `develop`

**Jobs**:
- 🚀 Deploy Backend to Railway
- 🚀 Deploy Frontend to Railway
- ✅ Health Checks
- 📢 Notifications

### 3. PR Checks Workflow (`.github/workflows/pr-checks.yml`)

**Trigger**: Pull Requests

**Jobs**:
- ✅ Validate PR title
- ✅ Check PR size
- ✅ Run tests
- 💬 Comment results

---

## 🚂 Despliegue en Railway

### Configuración de Proyectos Railway

Necesitas crear **3 proyectos** en Railway:

#### 1. DICRI Production
```
Servicios:
- dicri-backend-prod
- dicri-frontend-prod
- dicri-database-prod (SQL Server)
```

#### 2. DICRI Staging
```
Servicios:
- dicri-backend-staging
- dicri-frontend-staging
- dicri-database-staging (SQL Server)
```

#### 3. DICRI Development
```
Servicios:
- dicri-backend-dev
- dicri-frontend-dev
- dicri-database-dev (SQL Server)
```

### Configurar Servicios en Railway

#### Backend Service

1. **Create Service** → Empty Service
2. **Nombre**: `dicri-backend-prod` (o según ambiente)
3. **Settings**:
   - Source: GitHub `rivalTj7/PruebaTecnica-DICRI`
   - Branch: `main` / `staging` / `develop`
   - Root Directory: `/backend`
   - Build Command: `npm ci`
   - Start Command: `npm run migrate && npm start`

4. **Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=${{MSSQL.HOST}}
   DB_PORT=${{MSSQL.PORT}}
   DB_USER=${{MSSQL.USER}}
   DB_PASSWORD=${{MSSQL.PASSWORD}}
   DB_NAME=${{MSSQL.DATABASE}}
   JWT_SECRET=<tu-secret>
   JWT_REFRESH_SECRET=<tu-refresh-secret>
   CORS_ORIGIN=${{FRONTEND_URL}}
   ```

#### Frontend Service

1. **Create Service** → Empty Service
2. **Nombre**: `dicri-frontend-prod` (o según ambiente)
3. **Settings**:
   - Source: GitHub `rivalTj7/PruebaTecnica-DICRI`
   - Branch: `main` / `staging` / `develop`
   - Root Directory: `/frontend`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

4. **Variables**:
   ```
   VITE_API_URL=${{BACKEND_URL}}
   VITE_APP_ENV=production
   ```

#### Database Service (SQL Server)

1. **Add Service** → Database → SQL Server
2. **Configuración**:
   - Memory: 2GB mínimo
   - Storage: 10GB mínimo

3. **Obtener credenciales**:
   - Las variables se auto-generan como `MSSQL.*`

---

## 🔐 Variables de Entorno

### Backend (.env)

```bash
# Node
NODE_ENV=production
PORT=5000

# Database (Railway auto-genera estas)
DB_HOST=${{MSSQL.HOST}}
DB_PORT=${{MSSQL.PORT}}
DB_USER=${{MSSQL.USER}}
DB_PASSWORD=${{MSSQL.PASSWORD}}
DB_NAME=${{MSSQL.DATABASE}}
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false

# JWT (generar con script)
JWT_SECRET=<random-64-chars>
JWT_REFRESH_SECRET=<random-64-chars>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=${{FRONTEND_URL}}

# Opcionales
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
```

### Frontend (.env)

```bash
# API
VITE_API_URL=${{BACKEND_URL}}

# App
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

### Generar Secrets

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O usa el script incluido
node generate-hash.js
```

---

## 📦 Deployment Manual

### Usando Scripts

**Windows (PowerShell):**
```powershell
# Deploy a producción
.\scripts\deploy.ps1 -Environment production

# Deploy a staging
.\scripts\deploy.ps1 -Environment staging

# Deploy a desarrollo
.\scripts\deploy.ps1 -Environment development
```

**Linux/Mac (Bash):**
```bash
# Dar permisos
chmod +x scripts/deploy.sh

# Deploy a producción
./scripts/deploy.sh production

# Deploy a staging
./scripts/deploy.sh staging

# Deploy a desarrollo
./scripts/deploy.sh development
```

### Usando Railway CLI Directamente

```bash
# Login
railway login

# Listar proyectos
railway list

# Link al proyecto
railway link

# Deploy backend
cd backend
railway up --service dicri-backend-prod

# Deploy frontend
cd frontend
railway up --service dicri-frontend-prod

# Ver logs
railway logs --service dicri-backend-prod

# Ver variables
railway variables
```

---

## 🔄 Flujo de Trabajo Completo

### 1. Desarrollo de Feature

```bash
# Crear branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/DICRI-123-new-feature

# Hacer cambios y commits
git add .
git commit -m "feat: add new feature"
git push origin feature/DICRI-123-new-feature
```

### 2. Pull Request a Develop

1. Crear PR en GitHub
2. Esperar checks de CI ✅
3. Solicitar review
4. Merge después de aprobación
5. **Deploy automático** a Railway Dev

### 3. Promoción a Staging

```bash
# Desde develop a staging
git checkout staging
git pull origin staging
git merge develop
git push origin staging
```

- **Deploy automático** a Railway Staging
- Realizar QA y testing

### 4. Release a Producción

```bash
# Desde staging a main
git checkout main
git pull origin main
git merge staging
git push origin main

# Crear tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

- **Deploy automático** a Railway Production
- Monitorear logs y métricas

---

## 🔍 Monitoring y Logs

### Ver Logs en Railway

```bash
# Logs en tiempo real
railway logs --service dicri-backend-prod

# Logs con filtro
railway logs --service dicri-backend-prod | grep ERROR

# Logs de múltiples servicios
railway logs
```

### Health Checks

```bash
# Backend
curl https://dicri-backend-prod.railway.app/health

# Frontend
curl https://dicri-frontend-prod.railway.app
```

### Métricas en Railway Dashboard

- CPU Usage
- Memory Usage
- Request Count
- Response Times
- Error Rates

---

## 🐛 Troubleshooting

### Build Failures

**Problema**: `npm ci` falla
```bash
# Solución: Verificar package-lock.json
cd backend
npm install
git add package-lock.json
git commit -m "fix: update package-lock"
```

**Problema**: Variables de entorno no definidas
```bash
# Solución: Verificar en Railway Dashboard
railway variables
# Agregar variables faltantes
railway variables set KEY=value
```

### Database Connection Issues

```bash
# Verificar credenciales
railway variables | grep MSSQL

# Test connection
node -e "const sql = require('mssql'); sql.connect('...')..."
```

### Deployment Timeout

```bash
# Aumentar timeout en railway.json
{
  "deploy": {
    "healthcheckTimeout": 300
  }
}
```

### Rollback

```bash
# Via Railway Dashboard: Deployments → Previous Deployment → Redeploy

# Via Git
git revert HEAD
git push origin main
```

---

## 📞 Soporte

- **Documentación Railway**: https://docs.railway.app
- **GitHub Actions**: https://docs.github.com/actions
- **Railway CLI**: `railway help`

---

## ✅ Checklist Pre-Deploy

- [ ] Tests pasando localmente
- [ ] Variables de entorno configuradas
- [ ] Secrets de GitHub actualizados
- [ ] Railway services configurados
- [ ] Database migrations probadas
- [ ] Health checks funcionando
- [ ] CORS configurado correctamente
- [ ] JWT secrets generados
- [ ] Branches protegidas en GitHub
- [ ] Team notificado del deployment

---

**Última actualización**: 21 de noviembre de 2025
**Versión**: 1.0.0
