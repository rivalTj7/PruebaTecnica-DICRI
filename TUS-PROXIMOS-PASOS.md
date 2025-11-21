# 🚀 TUS PRÓXIMOS PASOS - Deployment Railway

**Fecha:** 21 de noviembre de 2025  
**Status:** ✅ Rama `main` lista | ✅ CI/CD configurado | ⏳ Pendiente: Railway

---

## ✅ LO QUE YA ESTÁ LISTO

1. ✅ **Rama `main` creada y actualizada** con todo el código
2. ✅ **GitHub Actions** configurado para CI/CD
3. ✅ **Archivos de Railway** creados:
   - `railway.toml`
   - `.railwayignore`
   - `backend/railway.json`
   - `frontend/railway.json`
4. ✅ **Documentación completa:**
   - `RAILWAY-QUICKSTART.md` (Guía rápida)
   - `RAILWAY-DEPLOYMENT-GUIDE.md` (Guía detallada)
   - `DEPLOYMENT.md` (Guía original)

---

## ⚠️ PROBLEMA CRÍTICO: SQL Server

**Railway NO soporta SQL Server de forma nativa.**

### Tus opciones:

#### ✅ OPCIÓN 1: PostgreSQL (GRATIS - RECOMENDADA)
**Pros:**
- ✅ Totalmente gratis en Railway
- ✅ Solo pagas por backend/frontend (~$1-2/mes)
- ✅ Fácil de configurar

**Contras:**
- ⚠️ Debes migrar los Stored Procedures de SQL Server → PostgreSQL
- ⏱️ Tiempo estimado: 2-3 horas

#### ✅ OPCIÓN 2: Azure SQL Database (DE PAGO)
**Pros:**
- ✅ 100% compatible con tu código actual
- ✅ NO requiere cambios
- ✅ Profesional para producción

**Contras:**
- 💰 Costo: ~$5/mes (Basic tier)
- 📝 Requiere cuenta de Azure

#### ❌ OPCIÓN 3: SQL Server en Railway (NO RECOMENDADA)
**Pros:**
- ✅ Compatible con tu código

**Contras:**
- 💰 Muy costoso (~$15-20/mes solo la DB)
- 🐌 Consume mucha RAM (2GB+)
- ⚠️ No es eficiente para Railway

---

## 🎯 MI RECOMENDACIÓN

### Para la entrevista técnica:

**Presenta el sistema funcionando LOCALMENTE:**

1. ✅ Ya lo tienes funcionando en Docker
2. ✅ Muestra todas las funcionalidades
3. ✅ Explica que está listo para deployment
4. ✅ Menciona las opciones de deployment:
   - PostgreSQL en Railway (gratis)
   - SQL Server en Azure (profesional)

### Después de la entrevista:

Si quieres desplegarlo realmente:
- **Para prueba:** PostgreSQL en Railway
- **Para producción:** SQL Server en Azure

---

## 📋 PASO A PASO: Deployment con PostgreSQL

### PASO 1: Crear cuenta en Railway (5 min)

1. Ve a: **https://railway.app**
2. Click **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway
5. ✅ Listo

---

### PASO 2: Crear proyecto y base de datos (10 min)

1. En Railway dashboard, click **"New Project"**
2. Selecciona **"Provision PostgreSQL"**
3. Railway creará la base de datos automáticamente
4. Click en el servicio de PostgreSQL
5. Ve a **"Variables"**
6. Copia estos valores (los necesitarás):
   ```
   DATABASE_URL
   PGHOST
   PGPORT
   PGUSER
   PGPASSWORD
   PGDATABASE
   ```

---

### PASO 3: Adaptar el backend para PostgreSQL (30 min)

#### 3.1 Instalar dependencia de PostgreSQL

```bash
cd backend
npm install pg
npm install --save-dev @types/pg
```

#### 3.2 Crear nuevo archivo de configuración

Crear: `backend/src/config/database-pg.js`

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err);
});

module.exports = { pool };
```

#### 3.3 Actualizar controllers

En lugar de usar `mssql`, usa `pg`:

**Antes (SQL Server):**
```javascript
const { getPool } = require('../config/database');
const pool = await getPool();
const result = await pool.request()
  .input('param', sql.Int, value)
  .execute('SP_Procedure');
```

**Después (PostgreSQL):**
```javascript
const { pool } = require('../config/database-pg');
const result = await pool.query(
  'SELECT * FROM fn_procedure($1)',
  [value]
);
```

#### 3.4 Migrar Stored Procedures a Functions

**SQL Server SP:**
```sql
CREATE PROCEDURE SP_ObtenerExpedientes
AS
BEGIN
    SELECT * FROM Expedientes
END
```

**PostgreSQL Function:**
```sql
CREATE OR REPLACE FUNCTION fn_obtener_expedientes()
RETURNS TABLE (
    expedienteid INT,
    numeroexpediente VARCHAR,
    titulo VARCHAR,
    -- ... todos los campos
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM expedientes;
END;
$$ LANGUAGE plpgsql;
```

---

### PASO 4: Crear esquema en PostgreSQL (20 min)

Crear: `database/schema-pg.sql`

Convertir el schema de SQL Server:

**Cambios principales:**
- `NVARCHAR` → `VARCHAR` o `TEXT`
- `DATETIME` → `TIMESTAMP`
- `BIT` → `BOOLEAN`
- `IDENTITY(1,1)` → `SERIAL` o `GENERATED ALWAYS AS IDENTITY`
- `GETDATE()` → `NOW()`

**Ejemplo:**

```sql
-- SQL Server
CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
    NombreCompleto NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
);

-- PostgreSQL
CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE
);
```

---

### PASO 5: Desplegar Backend en Railway (15 min)

1. En Railway, click **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Busca: `rivalTj7/PruebaTecnicaDS`
4. Railway detectará Node.js

#### Configurar Settings:

1. **Settings** → **Source**
   - Root Directory: `backend`
   - Watch Paths: `backend/**`

2. **Variables** (copiar y pegar):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<GENERA_ESTE_CON_COMANDO_ABAJO>
JWT_REFRESH_SECRET=<GENERA_ESTE_CON_COMANDO_ABAJO>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=https://TU-FRONTEND.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads
```

#### Generar JWT Secrets:
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copia el resultado para JWT_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copia el resultado para JWT_REFRESH_SECRET
```

3. **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copia la URL: `https://dicri-backend-production.up.railway.app`

---

### PASO 6: Desplegar Frontend en Railway (10 min)

1. Click **"+ New"** → **"GitHub Repo"**
2. Selecciona: `rivalTj7/PruebaTecnicaDS`

#### Configurar Settings:

1. **Settings** → **Source**
   - Root Directory: `frontend`
   - Watch Paths: `frontend/**`

2. **Variables**:
```env
VITE_API_URL=https://dicri-backend-production.up.railway.app
VITE_APP_NAME=DICRI - Sistema de Gestión de Evidencias
VITE_APP_VERSION=1.0.0
```

3. **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copia la URL del frontend

---

### PASO 7: Actualizar CORS (5 min)

1. Regresa al servicio **backend**
2. Edita la variable `CORS_ORIGIN`
3. Pega la URL del frontend que copiaste
4. Guarda (Railway re-desplegará automáticamente)

---

### PASO 8: Verificar (5 min)

#### Backend Health Check:
```bash
curl https://tu-backend.railway.app/health
```

Deberías ver:
```json
{"status":"OK","timestamp":"2024-11-21T...","uptime":123}
```

#### Frontend:
Abre: `https://tu-frontend.railway.app`

#### Login:
- Email: `tecnico@mp.gob.gt`
- Password: `Password123!`

---

## 🎯 ALTERNATIVA SIMPLE: Azure SQL

Si prefieres NO migrar a PostgreSQL:

### PASO 1: Crear Azure SQL Database (15 min)

1. Ve a: **https://portal.azure.com**
2. Crear recurso → **SQL Database**
3. Configurar:
   - Nombre: `dicri-db`
   - Servidor: Crear nuevo
   - Plan: **Basic** ($5/mes)
   - Autenticación: SQL
4. Configurar firewall → **Allow Azure Services**
5. Copiar connection string

### PASO 2: Usar Azure SQL en Railway

En las variables del backend en Railway:

```env
NODE_ENV=production
PORT=5000
DB_HOST=tu-server.database.windows.net
DB_PORT=1433
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=dicri-db
DB_ENCRYPT=true
# ... resto de variables
```

✅ **NO necesitas cambiar código**, funcionará tal cual.

---

## 📊 Comparación de Costos

| Opción | Costo/mes | Cambios de código |
|--------|-----------|-------------------|
| **PostgreSQL en Railway** | ~$1-2 | ⚠️ Sí, migración |
| **Azure SQL + Railway** | ~$11-12 | ✅ No |
| **SQL Server en Railway** | ~$16-20 | ✅ No |

---

## 🎓 MI RECOMENDACIÓN FINAL PARA TI

### Para la entrevista (HOY):

1. ✅ **Presenta el sistema funcionando en local con Docker**
2. ✅ Muestra el código en GitHub
3. ✅ Explica la arquitectura
4. ✅ Menciona que está listo para deployment

**Frase clave:**
> "El sistema está completamente funcional en local. Para producción, 
> tengo dos opciones configuradas: PostgreSQL en Railway (gratis) o 
> SQL Server en Azure (más profesional). La arquitectura está lista 
> para ambas."

### Después de la entrevista:

Si quieres desplegarlo:
- **Opción rápida:** PostgreSQL (1-2 días de migración)
- **Opción profesional:** Azure SQL (funciona de inmediato)

---

## 📞 COMANDOS RÁPIDOS

### Ver tu rama actual:
```bash
git branch
# Debe mostrar: * main
```

### Configurar main como default en GitHub:

1. Ve a: https://github.com/rivalTj7/PruebaTecnicaDS
2. Settings → Branches
3. Default branch: Cambiar a `main`
4. Confirmar

### Hacer push:
```bash
git add .
git commit -m "feat: Descripción del cambio"
git push origin main
```

---

## ✅ CHECKLIST PRE-ENTREVISTA

- [x] Código en rama `main` ✅
- [x] CI/CD configurado ✅
- [x] Sistema funcionando localmente ✅
- [x] Documentación completa ✅
- [ ] Decidir estrategia de deployment (local vs Railway)
- [ ] Preparar demostración
- [ ] Tener Docker corriendo antes de la entrevista

---

## 🎯 ACCIÓN INMEDIATA

**¿Qué hacer AHORA?**

1. **Opción A - Solo para entrevista:**
   - ✅ Ya está todo listo
   - Enfócate en preparar tu demostración
   - No necesitas desplegar a Railway todavía

2. **Opción B - Desplegar a Railway:**
   - Decide: ¿PostgreSQL o Azure SQL?
   - Sigue los pasos arriba
   - Tiempo estimado: 2-4 horas

**Mi consejo:** Opción A para la entrevista. Opción B después si te contratan.

---

## 📚 Archivos de Referencia

- `RAILWAY-QUICKSTART.md` - Guía rápida
- `RAILWAY-DEPLOYMENT-GUIDE.md` - Guía detallada
- `DEPLOYMENT.md` - Guía original con Docker Compose
- `README.md` - Documentación principal

---

**Desarrollado por:** Rivaldo Alexander Tojín  
**Para:** Ministerio Público de Guatemala  

**Estado del proyecto:** ✅ LISTO PARA DEMOSTRACIÓN

---

## 💬 Preguntas Frecuentes

**P: ¿Tengo que desplegar a Railway para la entrevista?**
R: No necesariamente. El sistema funcionando en local es suficiente. Railway es un plus.

**P: ¿Cuánto tiempo toma desplegar a Railway?**
R: Con PostgreSQL: 2-4 horas. Con Azure SQL: 30-60 minutos.

**P: ¿Cuál es mejor, PostgreSQL o Azure SQL?**
R: Para prueba: PostgreSQL (gratis). Para producción real: Azure SQL (profesional).

**P: ¿El CI/CD ya funciona?**
R: Sí, cada push a `main` ejecuta GitHub Actions automáticamente.

---

**¡Éxito en tu entrevista! 🚀**
