#!/bin/bash
# Script de configuración automática para GCP
# Ejecutar: bash GCP-SETUP-SCRIPT.sh

set -e

echo "========================================"
echo "  Configuración Automática GCP - DICRI"
echo "========================================"

# Variables
PROJECT_ID="dicri-prod"
REGION="us-central1"
SQL_INSTANCE="dicri-sqlserver"
SQL_PASSWORD="$(openssl rand -base64 32)"

echo ""
echo "📋 Configuración:"
echo "  Proyecto: $PROJECT_ID"
echo "  Región: $REGION"
echo "  Instancia SQL: $SQL_INSTANCE"
echo ""

# 1. Crear proyecto
echo "🔧 [1/8] Creando proyecto GCP..."
gcloud projects create $PROJECT_ID --name="DICRI Sistema" || echo "Proyecto ya existe"
gcloud config set project $PROJECT_ID

# 2. Habilitar facturación (manual)
echo "⚠️  [2/8] ACCIÓN REQUERIDA:"
echo "    Habilita facturación en: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
read -p "    Presiona ENTER cuando hayas habilitado facturación..."

# 3. Habilitar APIs
echo "🔌 [3/8] Habilitando APIs necesarias..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  compute.googleapis.com

# 4. Crear instancia Cloud SQL
echo "🗄️  [4/8] Creando instancia Cloud SQL (esto puede tardar 5-10 minutos)..."
gcloud sql instances create $SQL_INSTANCE \
  --database-version=SQLSERVER_2019_STANDARD \
  --tier=db-custom-2-7680 \
  --region=$REGION \
  --root-password="$SQL_PASSWORD" \
  --network=default \
  --allocated-ip-range-name=google-managed-services-default

echo "✅ Contraseña SQL Server generada: $SQL_PASSWORD"
echo "   (guarda esto en lugar seguro)"

# 5. Crear base de datos
echo "💾 [5/8] Creando base de datos..."
gcloud sql databases create DICRI --instance=$SQL_INSTANCE

# 6. Crear secrets
echo "🔐 [6/8] Creando secrets en Secret Manager..."

# JWT Secrets
echo -n "533b3cb012ea5bbbd3f7f206d01821a0880f851b19ae8860db9793d21d90ad23fb710ea124f04dcba1eb0c9ab0b9a61cd399f7324eaae61d1c66953aef1899ad" | \
  gcloud secrets create jwt-secret --data-file=-

echo -n "1dc7bbd4cba256d13f092a7b0dfd507c1782af938426b6a1b2f6bc17338ff2f83d0b9cf728873198789e93cf35491baabf4cb215004994b84081a6fddc66408a" | \
  gcloud secrets create jwt-refresh-secret --data-file=-

# DB Password
echo -n "$SQL_PASSWORD" | \
  gcloud secrets create db-password --data-file=-

# DB Connection String
DB_CONN="Server=$SQL_INSTANCE:1433;Database=DICRI;User Id=sqlserver;Password=$SQL_PASSWORD;Encrypt=true;TrustServerCertificate=true"
echo -n "$DB_CONN" | \
  gcloud secrets create db-connection-string --data-file=-

# 7. Crear cuenta de servicio para GitHub Actions
echo "👤 [7/8] Creando cuenta de servicio para CI/CD..."
SERVICE_ACCOUNT="github-actions"
gcloud iam service-accounts create $SERVICE_ACCOUNT \
  --display-name="GitHub Actions CI/CD"

# Asignar roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Crear clave JSON
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account="$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"

echo "✅ Clave de servicio guardada en: gcp-sa-key.json"

# 8. Resumen y próximos pasos
echo ""
echo "========================================"
echo "  ✅ Configuración Completada"
echo "========================================"
echo ""
echo "📝 Información importante:"
echo ""
echo "1. Instancia SQL Server:"
echo "   - Nombre: $SQL_INSTANCE"
echo "   - Contraseña: $SQL_PASSWORD"
echo "   - Base de datos: DICRI"
echo ""
echo "2. Secrets creados en Secret Manager:"
echo "   - jwt-secret"
echo "   - jwt-refresh-secret"
echo "   - db-password"
echo "   - db-connection-string"
echo ""
echo "3. Cuenta de servicio:"
echo "   - Email: $SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"
echo "   - Clave: gcp-sa-key.json"
echo ""
echo "🔧 Próximos pasos:"
echo ""
echo "1. Configurar GitHub Secrets:"
echo "   - Ve a: https://github.com/rivalTj7/PruebaTecnica-DICRI/settings/secrets/actions"
echo "   - Crea estos secrets:"
echo "     * GCP_PROJECT_ID = $PROJECT_ID"
echo "     * GCP_SA_KEY = (contenido de gcp-sa-key.json)"
echo ""
echo "2. Aplicar esquema de base de datos:"
echo "   gcloud sql connect $SQL_INSTANCE --user=sqlserver --database=DICRI"
echo "   (Luego ejecuta database/schema.sql y seed-data.sql)"
echo ""
echo "3. Hacer push a GitHub para activar deployment:"
echo "   git add ."
echo "   git commit -m 'feat: configure GCP deployment'"
echo "   git push origin main"
echo ""
echo "4. IMPORTANTE: Guarda esta información en lugar seguro y luego elimina:"
echo "   rm gcp-sa-key.json"
echo "   rm GCP-SETUP-SCRIPT.sh"
echo ""
echo "========================================"
