# Script de Inicializacion CI/CD - DICRI
param(
    [switch]$SetupBranches,
    [switch]$InstallTools,
    [switch]$All
)

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DICRI - CI/CD Initialization" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Funcion para verificar comandos
function Test-CommandExists {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Instalar herramientas
if ($InstallTools -or $All) {
    Write-Host "Verificando herramientas necesarias..." -ForegroundColor Blue
    
    if (-not (Test-CommandExists node)) {
        Write-Host "ERROR: Node.js no esta instalado" -ForegroundColor Red
        Write-Host "   Descargalo de: https://nodejs.org"
        exit 1
    }
    Write-Host "OK Node.js $(node --version)" -ForegroundColor Green
    
    if (-not (Test-CommandExists git)) {
        Write-Host "ERROR: Git no esta instalado" -ForegroundColor Red
        Write-Host "   Descargalo de: https://git-scm.com"
        exit 1
    }
    Write-Host "OK Git encontrado" -ForegroundColor Green
    
    if (-not (Test-CommandExists railway)) {
        Write-Host "Instalando Railway CLI..." -ForegroundColor Yellow
        npm install -g @railway/cli
        Write-Host "OK Railway CLI instalado" -ForegroundColor Green
    }
    else {
        Write-Host "OK Railway CLI encontrado" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Configurar ramas
if ($SetupBranches -or $All) {
    Write-Host "Configurando estructura de ramas..." -ForegroundColor Blue
    
    if (-not (Test-Path .git)) {
        Write-Host "No es un repositorio Git. Inicializando..." -ForegroundColor Yellow
        git init
        Write-Host "OK Repositorio Git inicializado" -ForegroundColor Green
    }
    
    # Crear rama develop
    $null = git show-ref --verify refs/heads/develop 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Rama develop ya existe" -ForegroundColor Green
    }
    else {
        Write-Host "Creando rama develop..." -ForegroundColor Yellow
        $null = git checkout -b develop 2>&1
        Write-Host "OK Rama develop creada" -ForegroundColor Green
    }
    
    # Crear rama staging
    $null = git show-ref --verify refs/heads/staging 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Rama staging ya existe" -ForegroundColor Green
    }
    else {
        Write-Host "Creando rama staging..." -ForegroundColor Yellow
        $null = git checkout -b staging 2>&1
        Write-Host "OK Rama staging creada" -ForegroundColor Green
    }
    
    # Volver a main
    $null = git checkout main 2>&1
    if ($LASTEXITCODE -ne 0) {
        $null = git checkout -b main 2>&1
    }
    
    Write-Host ""
    Write-Host "Ramas disponibles:" -ForegroundColor Cyan
    git branch -a
    Write-Host ""
}

# Verificar archivos de configuracion
Write-Host "Verificando archivos de configuracion..." -ForegroundColor Blue

$requiredFiles = @(
    ".github\workflows\ci.yml",
    ".github\workflows\deploy.yml",
    ".github\workflows\pr-checks.yml",
    "backend\railway.json",
    "frontend\railway.json",
    "railway.toml"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "OK $file" -ForegroundColor Green
    }
    else {
        Write-Host "FALTA $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Archivos faltantes detectados:" -ForegroundColor Yellow
    $missingFiles | ForEach-Object { Write-Host "   - $_" }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   Inicializacion completada" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push de ramas al repositorio remoto:" -ForegroundColor Yellow
Write-Host "   git push -u origin main"
Write-Host "   git push -u origin develop"
Write-Host "   git push -u origin staging"
Write-Host ""

Write-Host "2. Configurar GitHub Secrets:" -ForegroundColor Yellow
Write-Host "   - Ve a: Settings > Secrets and variables > Actions"
Write-Host "   - Agrega: RAILWAY_TOKEN, JWT_SECRET, JWT_REFRESH_SECRET"
Write-Host ""

Write-Host "3. Configurar Railway:" -ForegroundColor Yellow
Write-Host "   railway login"
Write-Host "   Ver guia completa en: RAILWAY-SETUP.md"
Write-Host ""

Write-Host "Documentacion:" -ForegroundColor Cyan
Write-Host "   - CI/CD Guide: CICD-DEPLOYMENT-GUIDE.md"
Write-Host "   - Railway Setup: RAILWAY-SETUP.md"
Write-Host ""
