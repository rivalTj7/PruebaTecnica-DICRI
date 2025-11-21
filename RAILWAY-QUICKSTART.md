# 🚀 Guía Rápida: Deployment en Railway - DICRI

**Fecha:** 21 de noviembre de 2025  
**Proyecto:** Sistema DICRI - Ministerio Público Guatemala  
**Desarrollador:** Rivaldo Alexander Tojín

---

## ✅ Estado Actual

- ✅ Rama `main` creada y actualizada
- ✅ Código completo y funcional
- ✅ Archivos de configuración Railway listos
- ✅ CI/CD configurado con GitHub Actions
- ✅ Docker Compose funcionando localmente

---

## 🎯 Estrategia de Deployment

Railway **NO soporta SQL Server** directamente en su free tier. Tienes 3 opciones:

### Opción 1: PostgreSQL en Railway (GRATIS) ⭐ RECOMENDADA
- ✅ Railway ofrece PostgreSQL gratis
- ❌ Requiere migrar Stored Procedures de SQL Server
- ⏱️ Tiempo: 2-3 horas de migración

### Opción 2: SQL Server en Azure (DE PAGO)
- ✅ Compatible con tu código actual
- ✅ No requiere cambios
- ❌ Costo: ~$5-15/mes (Azure SQL Database)

### Opción 3: SQL Server en Docker en Railway (DE PAGO)
- ✅ Compatible con tu código actual
- ❌ Consume mucha RAM (2GB+)
- ❌ Costo estimado: ~$15-20/mes en Railway

---

## 📋 PASO A PASO: Deployment en Railway

### PASO 1: Crear Cuenta en Railway

1. Ve a: https://railway.app
2. Click en **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway

---

### PASO 2: Crear Nuevo Proyecto

1. En Railway Dashboard, click **"New Project"**
2. Selecciona **"Empty Project"**
3. Dale un nombre: `dicri-sistema`

---

### PASO 3A: Opción PostgreSQL (RECOMENDADA)

#### 3A.1 Crear Base de Datos PostgreSQL

1. En tu proyecto, click **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará la base de datos automáticamente
4. Copia las credenciales:
   - `DATABASE_URL`: (se genera automáticamente)
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

#### 3A.2 Migrar Stored Procedures

**⚠️ IMPORTANTE:** Necesitarás convertir los Stored Procedures de SQL Server a funciones PostgreSQL.

Ejemplo de conversión:

**SQL Server:**
```sql
CREATE PROCEDURE SP_ObtenerExpedientes
AS
BEGIN
    SELECT * FROM Expedientes
END
```

**PostgreSQL:**
```sql
CREATE OR REPLACE FUNCTION fn_obtener_expedientes()
RETURNS TABLE (...) AS $$
BEGIN
    RETURN QUERY SELECT * FROM expedientes;
END;
$$ LANGUAGE plpgsql;
```

#### 3A.3 Actualizar Backend para PostgreSQL

Instalar dependencia:
```bash
npm install pg
```

Actualizar `backend/src/config/database.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

---

### PASO 3B: Opción SQL Server en Azure

#### 3B.1 Crear Azure SQL Database

1. Ve a: https://portal.azure.com
2. Crear recurso → **SQL Database**
3. Configuración:
   - **Nombre:** dicri-db
   - **Servidor:** Crear nuevo
   - **Pricing tier:** Basic ($5/mes)
4. Obtén la connection string

#### 3B.2 Configurar Firewall

1. En Azure Portal → SQL Server → Firewalls
2. Agregar regla: **Allow Azure Services** (ON)
3. Agregar regla: **Allow Railway IPs** (ver lista en Railway docs)

---

### PASO 4: Desplegar Backend

#### 4.1 Crear Servicio Backend

1. En Railway, click **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Conecta: `rivalTj7/PruebaTecnicaDS`
4. Railway detectará Node.js

#### 4.2 Configurar Root Directory

1. Ve a **Settings** → **Source**
2. Configura:
   - **Root Directory:** `backend`
   - **Watch Paths:** `backend/**`

#### 4.3 Variables de Entorno

En **Variables**, agrega:

**Para PostgreSQL:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<GENERAR-NUEVO-64-CHARS>
JWT_REFRESH_SECRET=<GENERAR-NUEVO-64-CHARS>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=https://tu-frontend.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads
```

**Para SQL Server (Azure):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=tu-server.database.windows.net
DB_PORT=1433
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=dicri-db
JWT_SECRET=<GENERAR-NUEVO-64-CHARS>
JWT_REFRESH_SECRET=<GENERAR-NUEVO-64-CHARS>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=https://tu-frontend.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads
```

#### 4.4 Generar JWT Secrets

En tu terminal:
```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 4.5 Generar Dominio

1. **Settings** → **Networking** → **Generate Domain**
2. Copia la URL: `https://dicri-backend-production.up.railway.app`

---

### PASO 5: Desplegar Frontend

#### 5.1 Crear Servicio Frontend

1. Click **"+ New"** → **"GitHub Repo"**
2. Selecciona: `rivalTj7/PruebaTecnicaDS`

#### 5.2 Configurar Root Directory

1. **Settings** → **Source**
2. Configura:
   - **Root Directory:** `frontend`
   - **Watch Paths:** `frontend/**`

#### 5.3 Variables de Entorno

```env
VITE_API_URL=https://dicri-backend-production.up.railway.app
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
```

#### 5.4 Generar Dominio

1. **Settings** → **Networking** → **Generate Domain**
2. Copia la URL del frontend

---

### PASO 6: Actualizar CORS

1. Regresa al servicio **backend**
2. Actualiza `CORS_ORIGIN` con la URL del frontend
3. Railway re-desplegará automáticamente

---

## ✅ Verificación

### 1. Backend Health Check
```bash
curl https://tu-backend.railway.app/health
```

Respuesta esperada:
```json
{"status":"OK","timestamp":"...","uptime":123}
```

### 2. Frontend
Abre: `https://tu-frontend.railway.app`

### 3. Login
- Email: `tecnico@mp.gob.gt`
- Password: `Password123!`

---

## 🔄 CI/CD Automático

Ya está configurado! Cada push a `main`:

1. ✅ GitHub Actions ejecuta tests
2. ✅ Si pasan, Railway despliega automáticamente
3. ✅ Frontend y Backend se actualizan

```bash
# Workflow
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main
# → GitHub Actions → Railway Deploy
```

---

## 💰 Costos Estimados

### Opción 1: PostgreSQL en Railway
- Database: $0 (gratis)
- Backend: ~$3/mes
- Frontend: ~$3/mes
- **Total: ~$6/mes** (con $5 gratis = $1/mes)

### Opción 2: SQL Server en Azure
- Azure SQL: ~$5/mes
- Backend: ~$3/mes
- Frontend: ~$3/mes
- **Total: ~$11/mes**

### Opción 3: SQL Server en Railway
- Database: ~$10/mes
- Backend: ~$3/mes
- Frontend: ~$3/mes
- **Total: ~$16/mes**

---

## 🐛 Problemas Comunes

### Error: "Cannot connect to database"
- Verifica variables de entorno
- Espera 2-3 minutos para que DB inicie
- Revisa logs en Railway

### Error: CORS
- Verifica `CORS_ORIGIN` tenga URL correcta
- Sin trailing slash: ✅ `https://app` ❌ `https://app/`

### Error: Build fails
- Revisa que Root Directory esté correcto
- Verifica que `package.json` exista en ese directorio

---

## 📞 Comandos Útiles

### Generar Secrets
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Ver logs (Railway CLI)
```bash
railway login
railway logs --service backend
railway logs --service frontend
```

### Push a main
```bash
git add .
git commit -m "feat: Descripción"
git push origin main
```

---

## 🎯 Checklist Final

Antes de dar por terminado:

- [ ] Servicios en estado "Active" (verde) en Railway
- [ ] Health check del backend responde
- [ ] Frontend carga sin errores
- [ ] Login funciona
- [ ] Puedes crear expedientes
- [ ] CORS configurado correctamente
- [ ] Variables de entorno configuradas
- [ ] JWT secrets únicos
- [ ] GitHub Actions pasando (verde)
- [ ] Dominio personalizado (opcional)

---

## 🎓 Mi Recomendación Final

**Para la entrevista técnica:**

1. **Corto plazo:** Usa **PostgreSQL en Railway** (gratis)
   - Muestra que puedes adaptarte a diferentes tecnologías
   - Explica la migración de SQL Server → PostgreSQL

2. **Mediano plazo:** Si te contratan, migra a **Azure SQL**
   - Compatible con código actual
   - Mejor para producción empresarial

3. **Alternativa:** Mantén **SQL Server en Docker localmente**
   - Demuestra la app funcionando en local
   - Explica que en producción usarías Azure SQL

---

## 📚 Documentación Adicional

- [Railway Docs](https://docs.railway.app)
- [Azure SQL Database](https://azure.microsoft.com/sql-database/)
- [PostgreSQL Migration Guide](https://www.postgresql.org/docs/current/migration.html)

---

**¿Necesitas ayuda?** Revisa los logs en Railway Dashboard

**Siguiente paso:** Abre Railway y sigue estos pasos ☝️

---

**Desarrollado por:** Rivaldo Alexander Tojín  
**Para:** Ministerio Público de Guatemala  
**Fecha:** Noviembre 2024
