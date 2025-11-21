# Script de reinicio completo para Windows
# Ejecutar desde PowerShell en el directorio del proyecto

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  DICRI - Sistema de Gestión de Evidencias" -ForegroundColor Cyan
Write-Host "  Reinicio Completo para Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".\docker-compose.windows-simple.yml")) {
    Write-Host "ERROR: docker-compose.windows-simple.yml no encontrado" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde el directorio PruebaTecnicaDS" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/7] Deteniendo todos los contenedores..." -ForegroundColor Yellow
docker-compose -f docker-compose.windows-simple.yml down 2>$null
docker-compose -f docker-compose.windows.yml down 2>$null
docker-compose down 2>$null

Write-Host "[2/7] Eliminando contenedores existentes..." -ForegroundColor Yellow
docker rm -f dicri-database dicri-backend dicri-frontend 2>$null

Write-Host "[3/7] Eliminando volúmenes..." -ForegroundColor Yellow
docker volume rm pruebatecnicads_sqlserver_data 2>$null
docker volume rm $(docker volume ls -q | Select-String "pruebatecnicads") 2>$null

Write-Host "[4/7] Limpiando sistema Docker..." -ForegroundColor Yellow
docker system prune -f

Write-Host "[5/7] Verificando imágenes..." -ForegroundColor Yellow
if (-not (docker images | Select-String "mssql/server:2022")) {
    Write-Host "    Descargando imagen de SQL Server 2022..." -ForegroundColor Cyan
    docker pull mcr.microsoft.com/mssql/server:2022-latest
}

Write-Host "[6/7] Iniciando servicios con docker-compose.windows-simple.yml..." -ForegroundColor Yellow
docker-compose -f docker-compose.windows-simple.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo al iniciar los servicios" -ForegroundColor Red
    Write-Host "Ver logs con: docker-compose -f docker-compose.windows-simple.yml logs -f" -ForegroundColor Yellow
    exit 1
}

Write-Host "[7/7] Esperando que los servicios inicien..." -ForegroundColor Yellow
Write-Host ""

# Función para verificar si un contenedor está saludable
function Test-ContainerHealth {
    param($ContainerName)
    $status = docker inspect --format='{{.State.Health.Status}}' $ContainerName 2>$null
    return $status -eq "healthy"
}

# Función para verificar si un contenedor está corriendo
function Test-ContainerRunning {
    param($ContainerName)
    $status = docker inspect --format='{{.State.Running}}' $ContainerName 2>$null
    return $status -eq "true"
}

# Esperar por la base de datos (máximo 2 minutos)
Write-Host "Esperando base de datos..." -ForegroundColor Cyan
$maxAttempts = 60
$attempt = 0

while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++

    if (Test-ContainerHealth "dicri-database") {
        Write-Host "✓ Base de datos iniciada correctamente (después de $($attempt * 2) segundos)" -ForegroundColor Green
        break
    }

    Write-Host "." -NoNewline

    if ($attempt -eq $maxAttempts) {
        Write-Host ""
        Write-Host "✗ Base de datos no está saludable después de $($maxAttempts * 2) segundos" -ForegroundColor Red
        Write-Host ""
        Write-Host "Ver logs de base de datos:" -ForegroundColor Yellow
        docker logs dicri-database --tail 30
        exit 1
    }
}
Write-Host ""

# Esperar por backend (máximo 1 minuto)
Write-Host "Esperando backend..." -ForegroundColor Cyan
$attempt = 0
$maxAttempts = 30

while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++

    if (Test-ContainerRunning "dicri-backend") {
        Write-Host "✓ Backend iniciado correctamente" -ForegroundColor Green
        break
    }

    Write-Host "." -NoNewline

    if ($attempt -eq $maxAttempts) {
        Write-Host ""
        Write-Host "✗ Backend no inició correctamente" -ForegroundColor Red
        Write-Host "Ver logs: docker logs dicri-backend" -ForegroundColor Yellow
    }
}
Write-Host ""

# Esperar por frontend (máximo 1 minuto)
Write-Host "Esperando frontend..." -ForegroundColor Cyan
$attempt = 0
$maxAttempts = 30

while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++

    if (Test-ContainerRunning "dicri-frontend") {
        Write-Host "✓ Frontend iniciado correctamente" -ForegroundColor Green
        break
    }

    Write-Host "." -NoNewline

    if ($attempt -eq $maxAttempts) {
        Write-Host ""
        Write-Host "✗ Frontend no inició correctamente" -ForegroundColor Red
        Write-Host "Ver logs: docker logs dicri-frontend" -ForegroundColor Yellow
    }
}
Write-Host ""

# Mostrar estado final
Write-Host ""
Write-Host "Estado de los servicios:" -ForegroundColor Cyan
Write-Host ""
docker-compose -f docker-compose.windows-simple.yml ps

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Sistema Iniciado" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor Cyan
Write-Host "  - Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  - Swagger:     http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "  Técnico:" -ForegroundColor Yellow
Write-Host "    Email:    tecnico@mp.gob.gt" -ForegroundColor White
Write-Host "    Password: Password123!" -ForegroundColor White
Write-Host ""
Write-Host "  Coordinador:" -ForegroundColor Yellow
Write-Host "    Email:    coordinador@mp.gob.gt" -ForegroundColor White
Write-Host "    Password: Password123!" -ForegroundColor White
Write-Host ""
Write-Host "  Administrador:" -ForegroundColor Yellow
Write-Host "    Email:    admin@mp.gob.gt" -ForegroundColor White
Write-Host "    Password: Password123!" -ForegroundColor White
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Cyan
Write-Host "  Ver logs:          docker-compose -f docker-compose.windows-simple.yml logs -f" -ForegroundColor White
Write-Host "  Detener servicios: docker-compose -f docker-compose.windows-simple.yml down" -ForegroundColor White
Write-Host "  Reiniciar todo:    .\restart-windows.ps1" -ForegroundColor White
Write-Host ""
