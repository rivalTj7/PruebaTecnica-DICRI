# Script de configuración automática para GCP (Windows PowerShell)
# Ejecutar: .\GCP-SETUP-SCRIPT.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================"
Write-Host "  Configuracion Automatica GCP - DICRI"
Write-Host "========================================"

# Variables
$PROJECT_ID = "dicri-prod"
$REGION = "us-central1"
$SQL_INSTANCE = "dicri-sqlserver"

# Generar contraseña SQL aleatoria
$SQL_PASSWORD = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host ""
Write-Host "Configuracion:"
Write-Host "  Proyecto: $PROJECT_ID"
Write-Host "  Region: $REGION"
Write-Host "  Instancia SQL: $SQL_INSTANCE"
Write-Host ""

# 1. Crear proyecto
Write-Host "[1/8] Creando proyecto GCP..."
try {
    gcloud projects create $PROJECT_ID --name="DICRI Sistema" 2>$null
} catch {
    Write-Host "Proyecto ya existe"
}
gcloud config set project $PROJECT_ID

# 2. Habilitar facturación (manual)
Write-Host "[2/8] ACCION REQUERIDA:"
Write-Host "    Habilita facturacion en: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
Read-Host "    Presiona ENTER cuando hayas habilitado facturacion"

# 3. Habilitar APIs
Write-Host "[3/8] Habilitando APIs necesarias..."
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable compute.googleapis.com

# 4. Crear instancia Cloud SQL
Write-Host "[4/8] Creando instancia Cloud SQL (esto puede tardar 5-10 minutos)..."
gcloud sql instances create $SQL_INSTANCE `
  --database-version=SQLSERVER_2019_STANDARD `
  --tier=db-custom-2-7680 `
  --region=$REGION `
  --root-password="$SQL_PASSWORD" `
  --network=default `
  --allocated-ip-range-name=google-managed-services-default

Write-Host "Contraseña SQL Server generada: $SQL_PASSWORD"
Write-Host "   (guarda esto en lugar seguro)"

# 5. Crear base de datos
Write-Host "[5/8] Creando base de datos..."
gcloud sql databases create DICRI --instance=$SQL_INSTANCE

# 6. Crear secrets
Write-Host "[6/8] Creando secrets en Secret Manager..."

# JWT Secrets
$JWT_SECRET = "533b3cb012ea5bbbd3f7f206d01821a0880f851b19ae8860db9793d21d90ad23fb710ea124f04dcba1eb0c9ab0b9a61cd399f7324eaae61d1c66953aef1899ad"
$JWT_REFRESH_SECRET = "1dc7bbd4cba256d13f092a7b0dfd507c1782af938426b6a1b2f6bc17338ff2f83d0b9cf728873198789e93cf35491baabf4cb215004994b84081a6fddc66408a"

Write-Output $JWT_SECRET | gcloud secrets create jwt-secret --data-file=-
Write-Output $JWT_REFRESH_SECRET | gcloud secrets create jwt-refresh-secret --data-file=-

# DB Password
Write-Output $SQL_PASSWORD | gcloud secrets create db-password --data-file=-

# DB Connection String
$DB_CONN = "Server=$SQL_INSTANCE:1433;Database=DICRI;User Id=sqlserver;Password=$SQL_PASSWORD;Encrypt=true;TrustServerCertificate=true"
Write-Output $DB_CONN | gcloud secrets create db-connection-string --data-file=-

# 7. Crear cuenta de servicio para GitHub Actions
Write-Host "[7/8] Creando cuenta de servicio para CI/CD..."
$SERVICE_ACCOUNT = "github-actions"

gcloud iam service-accounts create $SERVICE_ACCOUNT `
  --display-name="GitHub Actions CI/CD"

# Asignar roles
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/iam.serviceAccountUser"

# Crear clave JSON
gcloud iam service-accounts keys create gcp-sa-key.json `
  --iam-account="$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"

Write-Host "Clave de servicio guardada en: gcp-sa-key.json"

# 8. Guardar información en archivo
$INFO = @"
======================================
  INFORMACION SENSIBLE - GUARDAR SEGURO
======================================

PROYECTO GCP: $PROJECT_ID
REGION: $REGION

SQL SERVER:
  Instancia: $SQL_INSTANCE
  Usuario: sqlserver
  Contraseña: $SQL_PASSWORD
  Base de datos: DICRI
  Connection String: $DB_CONN

SECRETS CREADOS:
  jwt-secret
  jwt-refresh-secret  
  db-password
  db-connection-string

CUENTA DE SERVICIO:
  Email: $SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com
  Clave JSON: gcp-sa-key.json

GITHUB SECRETS A CONFIGURAR:
  GCP_PROJECT_ID = $PROJECT_ID
  GCP_SA_KEY = (contenido de gcp-sa-key.json)

======================================
"@

$INFO | Out-File -FilePath "GCP-INFO-CONFIDENCIAL.txt" -Encoding UTF8

# 9. Resumen
Write-Host ""
Write-Host "========================================"
Write-Host "  Configuracion Completada"
Write-Host "========================================"
Write-Host ""
Write-Host "Se ha guardado toda la informacion en: GCP-INFO-CONFIDENCIAL.txt"
Write-Host ""
Write-Host "Proximos pasos:"
Write-Host ""
Write-Host "1. Configurar GitHub Secrets:"
Write-Host "   - Ve a: https://github.com/rivalTj7/PruebaTecnica-DICRI/settings/secrets/actions"
Write-Host "   - Crea estos secrets:"
Write-Host "     * GCP_PROJECT_ID = $PROJECT_ID"
Write-Host "     * GCP_SA_KEY = (contenido de gcp-sa-key.json)"
Write-Host ""
Write-Host "2. Aplicar esquema de base de datos:"
Write-Host "   gcloud sql connect $SQL_INSTANCE --user=sqlserver --database=DICRI"
Write-Host "   (Luego ejecuta database/schema.sql y seed-data.sql)"
Write-Host ""
Write-Host "3. Hacer push a GitHub para activar deployment:"
Write-Host "   git add ."
Write-Host "   git commit -m 'feat: configure GCP deployment'"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "4. IMPORTANTE: Despues de configurar GitHub Secrets, elimina:"
Write-Host "   rm gcp-sa-key.json"
Write-Host "   rm GCP-INFO-CONFIDENCIAL.txt"
Write-Host "   rm GCP-SETUP-SCRIPT.ps1"
Write-Host ""
Write-Host "========================================"
