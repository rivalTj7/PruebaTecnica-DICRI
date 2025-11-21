# Script de Limpieza Profunda para Windows
# Elimina TODAS las imagenes y contenedores del proyecto
# Ejecutar desde PowerShell

Write-Host ""
Write-Host "================================================" -ForegroundColor Red
Write-Host "  LIMPIEZA PROFUNDA - Eliminando cache ARM64" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red
Write-Host ""
Write-Host "ADVERTENCIA: Esto eliminara todas las imagenes y contenedores" -ForegroundColor Yellow
Write-Host "del proyecto para forzar la descarga de versiones AMD64 correctas." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s" -and $confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelado." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "[1/8] Deteniendo todos los contenedores del proyecto..." -ForegroundColor Yellow
docker-compose down 2>$null
docker-compose -f docker-compose.windows.yml down 2>$null
docker-compose -f docker-compose.windows-simple.yml down 2>$null

Write-Host "[2/8] Eliminando contenedores DICRI..." -ForegroundColor Yellow
docker rm -f dicri-database dicri-backend dicri-frontend 2>$null

Write-Host "[3/8] Eliminando volumenes..." -ForegroundColor Yellow
docker volume rm pruebatecnicads_sqlserver_data 2>$null
docker volume prune -f

Write-Host "[4/8] Eliminando imagenes ARM64 del proyecto..." -ForegroundColor Yellow
docker rmi -f pruebatecnicads-backend 2>$null
docker rmi -f pruebatecnicads-frontend 2>$null
docker rmi -f pruebatecnicads_backend 2>$null
docker rmi -f pruebatecnicads_frontend 2>$null

Write-Host "[5/8] Eliminando imagen de Azure SQL Edge (ARM64)..." -ForegroundColor Yellow
docker rmi -f mcr.microsoft.com/azure-sql-edge:latest 2>$null

Write-Host "[6/8] Limpiando cache de construccion..." -ForegroundColor Yellow
docker builder prune -f

Write-Host "[7/8] Descargando imagen correcta de SQL Server 2022 (AMD64)..." -ForegroundColor Yellow
docker pull --platform linux/amd64 mcr.microsoft.com/mssql/server:2022-latest

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No se pudo descargar SQL Server 2022" -ForegroundColor Red
    Write-Host "Verifica tu conexion a internet y que Docker Desktop este corriendo" -ForegroundColor Yellow
    exit 1
}

Write-Host "[8/8] Verificando imagen descargada..." -ForegroundColor Yellow
$imageInfo = docker inspect mcr.microsoft.com/mssql/server:2022-latest | ConvertFrom-Json
$architecture = $imageInfo[0].Architecture

Write-Host ""
if ($architecture -eq "amd64") {
    Write-Host "Imagen correcta descargada: $architecture" -ForegroundColor Green
} else {
    Write-Host "ADVERTENCIA: Arquitectura inesperada: $architecture" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Limpieza Completada" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes iniciar el proyecto con:" -ForegroundColor Cyan
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "O usar el script de inicio:" -ForegroundColor Cyan
Write-Host "  .\start.ps1" -ForegroundColor White
Write-Host ""
