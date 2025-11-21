# Configuración GCP Completa para DICRI

## ✅ Archivos Creados

Se han creado los siguientes archivos para la migración a GCP:

### 1. CI/CD y Deployment
- `.github/workflows/gcp-deploy.yml` - Workflow de GitHub Actions para deployment automático a Cloud Run
- `cloudbuild.yaml` - Configuración de Cloud Build (alternativa a GitHub Actions)
- `.gcloudignore` - Archivos a excluir en deployments de GCP

### 2. Docker Optimizado
- `backend/Dockerfile` - Optimizado para Cloud Run con:
  - Multi-stage build
  - Usuario no-root
  - dumb-init para manejo de señales
  - Puerto 8080 (requerido por Cloud Run)
  
- `frontend/Dockerfile` - Optimizado para Cloud Run con:
  - Build con Vite
  - Nginx configurado para puerto 8080
  - Compresión gzip
  - Security headers
  - SPA routing
  - Usuario no-root

### 3. Scripts de Configuración
- `GCP-SETUP-SCRIPT.sh` - Script Bash para Linux/Mac
- `GCP-SETUP-SCRIPT.ps1` - Script PowerShell para Windows

### 4. Archivos Obsoletos Marcados
- `.github/workflows/deploy.yml` - Marcado como DEPRECATED (solo ejecución manual)

## 🚀 Pasos para Deployment

### Opción 1: Script Automático (Recomendado)

**Windows:**
```powershell
.\GCP-SETUP-SCRIPT.ps1
```

**Linux/Mac:**
```bash
bash GCP-SETUP-SCRIPT.sh
```

Este script configurará automáticamente:
1. ✅ Proyecto GCP `dicri-prod`
2. ✅ APIs necesarias habilitadas
3. ✅ Cloud SQL Server instance
4. ✅ Base de datos DICRI
5. ✅ Secrets en Secret Manager
6. ✅ Cuenta de servicio para GitHub Actions
7. ✅ IAM roles asignados

### Opción 2: Configuración Manual

Sigue la guía en `GCP-DEPLOYMENT.md` para configuración paso a paso.

## 📋 Después del Script

### 1. Configurar GitHub Secrets

Ve a: `https://github.com/rivalTj7/PruebaTecnica-DICRI/settings/secrets/actions`

Crea estos secrets:
```
GCP_PROJECT_ID = dicri-prod
GCP_SA_KEY = (contenido completo de gcp-sa-key.json)
```

Para obtener el contenido de `gcp-sa-key.json`:

**Windows:**
```powershell
Get-Content gcp-sa-key.json | clip
```

**Linux/Mac:**
```bash
cat gcp-sa-key.json
```

### 2. Aplicar Schema de Base de Datos

```bash
# Conectar a Cloud SQL
gcloud sql connect dicri-sqlserver --user=sqlserver --database=DICRI

# En el prompt SQL, ejecutar:
# 1. Contenido de database/schema.sql
# 2. Contenido de database/seed-data.sql
# 3. Contenido de database/stored-procedures.sql
```

### 3. Deploy Inicial

```bash
git add .
git commit -m "feat: configure GCP deployment with Cloud Run"
git push origin main
```

Esto activará automáticamente el workflow `gcp-deploy.yml` que:
1. Construirá imágenes Docker
2. Las subirá a Google Container Registry
3. Desplegará backend a Cloud Run
4. Desplegará frontend a Cloud Run con la URL del backend

## 🌐 URLs de Deployment

Después del primer deployment, obtendrás URLs como:

**Producción (main):**
- Backend: `https://dicri-backend-prod-XXXXX-uc.a.run.app`
- Frontend: `https://dicri-frontend-prod-XXXXX-uc.a.run.app`

**Staging:**
- Backend: `https://dicri-backend-staging-XXXXX-uc.a.run.app`
- Frontend: `https://dicri-frontend-staging-XXXXX-uc.a.run.app`

**Development:**
- Backend: `https://dicri-backend-dev-XXXXX-uc.a.run.app`
- Frontend: `https://dicri-frontend-dev-XXXXX-uc.a.run.app`

## 💰 Costos Estimados

```
Cloud Run Backend:      $8-15/mes
Cloud Run Frontend:     $5-10/mes
Cloud SQL (2vCPU/7.5GB): $200-350/mes
Secret Manager:         $0.06/mes
Container Registry:     $5-10/mes
Cloud Build:            $0 (primeros 120 builds gratis)
Network Egress:         $5-20/mes
─────────────────────────────────────
TOTAL ESTIMADO:         $225-395/mes
```

## 🔐 Seguridad

Después de configurar todo:

1. **Eliminar archivos sensibles:**
   ```bash
   rm gcp-sa-key.json
   rm GCP-INFO-CONFIDENCIAL.txt
   ```

2. **Rotar secrets periódicamente** desde la consola de GCP

3. **Revisar IAM permissions** regularmente

4. **Habilitar Cloud Armor** para protección DDoS (opcional)

## 📊 Monitoreo

```bash
# Ver logs del backend
gcloud run services logs read dicri-backend-prod --region=us-central1 --limit=50

# Ver logs del frontend
gcloud run services logs read dicri-frontend-prod --region=us-central1 --limit=50

# Ver métricas de Cloud SQL
gcloud sql operations list --instance=dicri-sqlserver

# Ver costos del proyecto
gcloud billing accounts list
gcloud billing projects describe dicri-prod
```

## 🛠️ Troubleshooting

### El deployment falla en GitHub Actions

1. Verifica que los secrets estén configurados correctamente
2. Revisa que la cuenta de servicio tenga los permisos necesarios
3. Chequea los logs en: Actions tab del repositorio

### No puedo conectarme a Cloud SQL

1. Verifica que Cloud SQL esté running:
   ```bash
   gcloud sql instances describe dicri-sqlserver
   ```

2. Revisa la connection string en Secret Manager:
   ```bash
   gcloud secrets versions access latest --secret=db-connection-string
   ```

### El frontend no se conecta al backend

1. Verifica que VITE_API_URL esté configurada correctamente en el deployment
2. Revisa logs del frontend para ver errores CORS
3. Asegúrate que el backend tenga CORS configurado para la URL del frontend

## 📚 Documentación Adicional

- [GCP-DEPLOYMENT.md](./GCP-DEPLOYMENT.md) - Guía detallada de deployment
- [MANUAL-TECNICO.md](./MANUAL-TECNICO.md) - Manual técnico del sistema
- [ROLES-Y-PERMISOS.md](./ROLES-Y-PERMISOS.md) - Sistema de roles

## 🎯 Próximos Pasos Recomendados

1. ✅ Ejecutar script de configuración
2. ✅ Configurar GitHub Secrets
3. ✅ Aplicar schema de base de datos
4. ✅ Hacer push para primer deployment
5. ⏭️ Configurar dominio personalizado en Cloud Run
6. ⏭️ Configurar Cloud CDN para el frontend
7. ⏭️ Implementar Cloud Monitoring alerts
8. ⏭️ Configurar backups automáticos de Cloud SQL
9. ⏭️ Implementar Cloud Armor para seguridad

---

**¿Listo para comenzar?**

```powershell
# Windows
.\GCP-SETUP-SCRIPT.ps1

# O en Linux/Mac
bash GCP-SETUP-SCRIPT.sh
```
