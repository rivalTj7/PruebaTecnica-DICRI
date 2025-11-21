# Google Cloud Platform Deployment Guide

## Arquitectura en GCP

- **Backend**: Cloud Run (contenedor Node.js)
- **Frontend**: Cloud Run (contenedor Vite/React)
- **Database**: Cloud SQL for SQL Server
- **CI/CD**: Cloud Build + GitHub integration
- **Storage**: Cloud Storage (para archivos/uploads)

## Prerequisitos

1. Cuenta de GCP activa
2. Proyecto de GCP creado
3. gcloud CLI instalado
4. Facturación habilitada

## Instalación de gcloud CLI

### Windows
```powershell
# Descargar e instalar
# https://cloud.google.com/sdk/docs/install

# Verificar instalación
gcloud --version
```

### Inicializar gcloud
```bash
gcloud init
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## Paso 1: Configurar Proyecto GCP

```bash
# Crear proyecto (si no existe)
gcloud projects create dicri-prod --name="DICRI Production"

# Configurar proyecto activo
gcloud config set project dicri-prod

# Habilitar APIs necesarias
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

## Paso 2: Crear Cloud SQL Instance

```bash
# Crear instancia SQL Server
gcloud sql instances create dicri-db \
  --database-version=SQLSERVER_2019_STANDARD \
  --tier=db-custom-2-8192 \
  --region=us-central1 \
  --root-password=YOUR_STRONG_PASSWORD

# Crear base de datos
gcloud sql databases create DICRI_DB --instance=dicri-db

# Crear usuario
gcloud sql users create dicri_user \
  --instance=dicri-db \
  --password=YOUR_USER_PASSWORD
```

## Paso 3: Configurar Secrets

```bash
# JWT Secret
echo -n "YOUR_JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-

# JWT Refresh Secret
echo -n "YOUR_JWT_REFRESH_SECRET" | gcloud secrets create jwt-refresh-secret --data-file=-

# Database Password
echo -n "YOUR_DB_PASSWORD" | gcloud secrets create db-password --data-file=-
```

## Paso 4: Build y Deploy Backend

```bash
# Desde la raíz del proyecto
cd backend

# Build imagen
gcloud builds submit --tag gcr.io/dicri-prod/backend

# Deploy a Cloud Run
gcloud run deploy dicri-backend \
  --image gcr.io/dicri-prod/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --set-secrets="JWT_SECRET=jwt-secret:latest,JWT_REFRESH_SECRET=jwt-refresh-secret:latest,DB_PASSWORD=db-password:latest" \
  --add-cloudsql-instances=dicri-prod:us-central1:dicri-db \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

## Paso 5: Build y Deploy Frontend

```bash
# Desde la raíz del proyecto
cd frontend

# Build imagen
gcloud builds submit --tag gcr.io/dicri-prod/frontend

# Deploy a Cloud Run
gcloud run deploy dicri-frontend \
  --image gcr.io/dicri-prod/frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="VITE_API_URL=https://dicri-backend-XXXXX.run.app" \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 10
```

## Paso 6: Configurar CI/CD con Cloud Build

El archivo `cloudbuild.yaml` en la raíz manejará el deployment automático.

```bash
# Conectar repositorio GitHub
gcloud alpha builds triggers create github \
  --repo-name=PruebaTecnica-DICRI \
  --repo-owner=rivalTj7 \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# Para staging
gcloud alpha builds triggers create github \
  --repo-name=PruebaTecnica-DICRI \
  --repo-owner=rivalTj7 \
  --branch-pattern="^staging$" \
  --build-config=cloudbuild.yaml
```

## Paso 7: Configurar Dominio Personalizado (Opcional)

```bash
# Mapear dominio
gcloud run domain-mappings create \
  --service dicri-frontend \
  --domain dicri.example.com \
  --region us-central1
```

## Variables de Entorno

### Backend
```
NODE_ENV=production
PORT=8080
DB_HOST=/cloudsql/dicri-prod:us-central1:dicri-db
DB_USER=dicri_user
DB_PASSWORD=${DB_PASSWORD}  # desde Secret Manager
DB_NAME=DICRI_DB
JWT_SECRET=${JWT_SECRET}  # desde Secret Manager
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}  # desde Secret Manager
```

### Frontend
```
VITE_API_URL=https://dicri-backend-xxxxx.run.app
VITE_APP_ENV=production
```

## Costos Estimados (mensual)

- Cloud Run Backend: ~$10-50
- Cloud Run Frontend: ~$5-20
- Cloud SQL (db-custom-2-8192): ~$200-300
- Cloud Build: ~$5-20
- Artifact Registry: ~$5

**Total estimado: $225-395/mes**

## Monitoreo

```bash
# Ver logs del backend
gcloud run services logs read dicri-backend --region us-central1

# Ver logs del frontend
gcloud run services logs read dicri-frontend --region us-central1

# Ver métricas
gcloud monitoring dashboards list
```

## Troubleshooting

### Error de conexión a Cloud SQL
```bash
# Verificar instancia
gcloud sql instances describe dicri-db

# Verificar conexión
gcloud sql connect dicri-db --user=dicri_user
```

### Error de permisos
```bash
# Dar permisos a Cloud Build
gcloud projects add-iam-policy-binding dicri-prod \
  --member=serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin
```

## Próximos Pasos

1. Configurar Cloud Build (ver cloudbuild.yaml)
2. Configurar GitHub Actions para GCP (ver .github/workflows/gcp-deploy.yml)
3. Configurar backup de Cloud SQL
4. Configurar Cloud CDN
5. Configurar Cloud Armor (WAF)

---

**Última actualización**: 21 de noviembre de 2025
