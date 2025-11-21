# 🚀 Guía Práctica: Deployment en Railway

**Versión:** 1.0.0  
**Fecha:** Noviembre 2024  
**Proyecto:** DICRI - Sistema de Gestión de Evidencias

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [Railway.app](https://railway.app) (puedes usar tu cuenta de GitHub)
- ✅ Este repositorio en GitHub
- ✅ Rama `main` actualizada (✅ YA ESTÁ LISTA)
- ✅ Tarjeta de crédito para Railway (dan $5 gratis/mes)

---

## 🎯 Estrategia de Deployment

Railway desplegará **3 servicios separados**:

1. **SQL Server** (Base de datos)
2. **Backend** (API Node.js)
3. **Frontend** (React App)

---

## 📦 PASO 1: Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway a acceder a tu cuenta de GitHub
5. Completa tu perfil si te lo pide

---

## 🏗️ PASO 2: Crear Nuevo Proyecto

1. En el dashboard de Railway, click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona: `rivalTj7/PruebaTecnicaDS`
4. Railway detectará que tienes `docker-compose.yml` pero NO LO USES aún

**IMPORTANTE:** Railway no soporta docker-compose directamente. Desplegaremos cada servicio por separado.

---

## 🗄️ PASO 3: Crear Servicio de SQL Server

### 3.1 Agregar Servicio de Database

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database"**
3. **PROBLEMA:** Railway no ofrece SQL Server directamente 😢

### ⚠️ ALTERNATIVA: Usar PostgreSQL (RECOMENDADO)

**Opción A - PostgreSQL (Gratis en Railway):**

Railway ofrece PostgreSQL gratis. Tendrías que migrar tu base de datos:

1. Click en **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway creará la base de datos automáticamente
3. **PERO**: Necesitarías adaptar todos los Stored Procedures de SQL Server

**Opción B - SQL Server externo (Azure o AWS):**

Usar Azure SQL Database o AWS RDS con SQL Server (de pago).

**Opción C - SQL Server en Railway (Docker):**

Desplegar SQL Server como servicio custom en Railway:

1. En tu proyecto, click **"+ New"**
2. Selecciona **"Empty Service"**
3. En Settings → Variables, agrega:
   ```
   ACCEPT_EULA=Y
   MSSQL_SA_PASSWORD=TuPasswordSeguro2024!
   ```
4. En Settings → Source, conecta al repo y selecciona:
   - **Build Command:** `echo "Using Docker"`
   - **Start Command:** `/opt/mssql/bin/sqlservr`
   - **Dockerfile Path:** `database/Dockerfile`

**⚠️ NOTA:** SQL Server consume mucha RAM (mínimo 2GB). Esto puede ser costoso en Railway (~$15/mes).

### 3.2 Mi Recomendación

Para esta prueba técnica, te recomiendo **Opción C con Docker** pero con consciencia del costo.

---

## 🔧 PASO 4: Crear Servicio de Backend

### 4.1 Agregar Backend Service

1. En tu proyecto de Railway, click **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona `rivalTj7/PruebaTecnicaDS`
4. Railway detectará Node.js automáticamente

### 4.2 Configurar Build Settings

1. Ve a **Settings** del servicio backend
2. En **Build**, configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### 4.3 Configurar Variables de Entorno

En **Variables**, agrega TODAS estas variables:

```env
NODE_ENV=production
PORT=5000

# Database (usar la URL interna de Railway)
DB_HOST=database.railway.internal
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=TuPasswordSeguro2024!
DB_NAME=DICRI_DB

# JWT Secrets (GENERAR NUEVOS - ver abajo)
JWT_SECRET=<GENERAR_NUEVO>
JWT_REFRESH_SECRET=<GENERAR_NUEVO>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# CORS (URL del frontend - configurar después)
CORS_ORIGIN=https://dicri-frontend.up.railway.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads
```

### 4.4 Generar JWT Secrets

En tu terminal local, ejecuta:

```bash
# Para JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Para JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia los valores generados y reemplázalos en Railway.

### 4.5 Generar Dominio Público

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Railway generará una URL como: `https://dicri-backend-production.up.railway.app`
4. **COPIA ESTA URL**, la necesitarás para el frontend

---

## 🎨 PASO 5: Crear Servicio de Frontend

### 5.1 Agregar Frontend Service

1. En tu proyecto de Railway, click **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona `rivalTj7/PruebaTecnicaDS` de nuevo
4. Railway detectará Node.js

### 5.2 Configurar Build Settings

1. Ve a **Settings** del servicio frontend
2. En **Build**, configura:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### 5.3 Configurar Variables de Entorno

En **Variables**, agrega:

```env
# URL del backend (la que copiaste en el paso 4.5)
VITE_API_URL=https://dicri-backend-production.up.railway.app

# App Info
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
```

### 5.4 Generar Dominio Público

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Railway generará una URL como: `https://dicri-frontend-production.up.railway.app`
4. **COPIA ESTA URL**

---

## 🔄 PASO 6: Actualizar CORS en Backend

Ahora que tienes la URL del frontend:

1. Ve al servicio **backend** en Railway
2. Edita la variable `CORS_ORIGIN`
3. Reemplaza con la URL del frontend que copiaste en 5.4
4. Guarda los cambios
5. Railway re-desplegará automáticamente

---

## ✅ PASO 7: Verificar Deployment

### 7.1 Verificar Backend

Abre en tu navegador:
```
https://tu-backend-url.up.railway.app/health
```

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2024-11-21T...",
  "uptime": 123.45
}
```

### 7.2 Verificar Frontend

Abre:
```
https://tu-frontend-url.up.railway.app
```

Deberías ver la página de login del sistema DICRI.

### 7.3 Probar Login

1. Intenta hacer login con:
   - **Email:** `tecnico@mp.gob.gt`
   - **Password:** `Password123!`

2. Si funciona, ✅ **¡Deployment exitoso!**

---

## 🐛 Troubleshooting Común

### Problema: "Failed to connect to SQL Server"

**Causa:** El backend no puede conectarse a la base de datos.

**Solución:**
1. Verifica que el servicio de database esté corriendo (verde)
2. Verifica que `DB_HOST` sea `database.railway.internal`
3. Verifica que `DB_PASSWORD` coincida en ambos servicios
4. Espera 2-3 minutos para que SQL Server termine de iniciar

### Problema: Error CORS en el navegador

**Causa:** CORS_ORIGIN no está configurado correctamente.

**Solución:**
1. Verifica que `CORS_ORIGIN` tenga la URL correcta del frontend
2. No incluyas trailing slash: ❌ `https://frontend/` → ✅ `https://frontend`
3. Re-despliega el backend

### Problema: "Cannot GET /"

**Causa:** El frontend no está sirviendo archivos estáticos correctamente.

**Solución:**
1. Verifica que el `Start Command` sea correcto
2. Para Vite, debe ser: `npm start` o `npm run preview`
3. Verifica que la carpeta `dist` se haya generado en el build

### Problema: Build falla con "Out of memory"

**Causa:** Railway tiene límite de RAM en el free tier.

**Solución:**
1. Considera hacer upgrade del plan
2. O reduce el uso de memoria optimizando dependencias

---

## 💰 Estimación de Costos

| Servicio | RAM Estimada | Costo/mes |
|----------|--------------|-----------|
| SQL Server | ~2 GB | ~$10 |
| Backend | ~0.5 GB | ~$3 |
| Frontend | ~0.5 GB | ~$3 |
| **Total** | **~3 GB** | **~$16/mes** |

**Crédito gratis:** $5/mes  
**Costo real:** ~$11/mes

---

## 🎯 Checklist Final

Antes de dar por terminado:

- [ ] Los 3 servicios están en estado "Active" (verde)
- [ ] Health check del backend responde
- [ ] Frontend carga sin errores
- [ ] Login funciona correctamente
- [ ] Puedes crear un expediente
- [ ] CORS está configurado correctamente
- [ ] Variables de entorno están configuradas
- [ ] JWT secrets son únicos (no los de ejemplo)
- [ ] GitHub Actions está pasando (verde)

---

## 🔄 CI/CD Automático

Railway ya está configurado para hacer deploy automático cuando haces push a `main`:

```bash
# Hacer cambios
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main

# Railway detectará el push y desplegará automáticamente
```

El workflow de GitHub Actions ejecutará primero:
1. ✅ Tests del backend
2. ✅ Lint del código
3. ✅ Build del frontend
4. ✅ Validación de Docker

Si todo pasa, Railway desplegará automáticamente.

---

## 📞 Siguiente Paso

Una vez completados todos los pasos:

1. Accede a tu frontend en Railway
2. Haz login con las credenciales de prueba
3. Prueba crear un expediente
4. Verifica que todo funcione

**¡Listo para la demostración en la entrevista!** 🎉

---

**Desarrollado por:** Rivaldo Alexander Tojín  
**Ministerio Público de Guatemala**  
**Fecha:** Noviembre 2024
