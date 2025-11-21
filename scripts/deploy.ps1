# Script de Deploy Manual para Railway (PowerShell)
# Uso: .\deploy.ps1 -Environment production
# Environments: production, staging, development

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('production', 'staging', 'development')]
    [string]$Environment = 'production'
)

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "   DICRI - Railway Deployment Script" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Validar Railway CLI
try {
    $null = Get-Command railway -ErrorAction Stop
    Write-Host "✓ Railway CLI encontrado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Railway CLI no está instalado" -ForegroundColor Red
    Write-Host "Instálalo con: npm install -g @railway/cli"
    exit 1
}

# Validar token
if (-not $env:RAILWAY_TOKEN) {
    Write-Host "❌ RAILWAY_TOKEN no está configurado" -ForegroundColor Red
    Write-Host "Configura tu token con: `$env:RAILWAY_TOKEN = '<tu-token>'"
    exit 1
}

Write-Host "✓ RAILWAY_TOKEN configurado" -ForegroundColor Green

# Información del deployment
Write-Host ""
Write-Host "Environment: " -NoNewline
Write-Host $Environment -ForegroundColor Blue

$branch = git branch --show-current
Write-Host "Branch: " -NoNewline
Write-Host $branch -ForegroundColor Blue

$commit = git rev-parse --short HEAD
Write-Host "Commit: " -NoNewline
Write-Host $commit -ForegroundColor Blue

# Confirmar deployment
Write-Host ""
$confirm = Read-Host "¿Continuar con el deployment? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Deployment cancelado"
    exit 0
}

# Deploy Backend
Write-Host ""
Write-Host "Deploying Backend..." -ForegroundColor Blue
Push-Location backend
try {
    railway up --service "dicri-backend-$Environment"
    Write-Host "✓ Backend deployed" -ForegroundColor Green
}
finally {
    Pop-Location
}

# Deploy Frontend
Write-Host ""
Write-Host "Deploying Frontend..." -ForegroundColor Blue
Push-Location frontend
try {
    railway up --service "dicri-frontend-$Environment"
    Write-Host "✓ Frontend deployed" -ForegroundColor Green
}
finally {
    Pop-Location
}

# Verificar servicios
Write-Host ""
Write-Host "Verificando servicios..." -ForegroundColor Blue
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "   ✓ Deployment completado exitosamente" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "Revisa los logs con:"
Write-Host "  railway logs --service dicri-backend-$Environment"
Write-Host "  railway logs --service dicri-frontend-$Environment"
