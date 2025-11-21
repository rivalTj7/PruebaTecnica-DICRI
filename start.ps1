# Script de Inicio Rápido para Windows AMD64
# Ejecutar desde PowerShell

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DICRI - Inicio Rápido" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Limpiando contenedores anteriores..." -ForegroundColor Yellow
docker-compose down -v 2>$null
docker rm -f dicri-database dicri-backend dicri-frontend 2>$null

Write-Host "[2/5] Limpiando volúmenes..." -ForegroundColor Yellow
docker volume prune -f 2>$null

Write-Host "[3/5] Limpiando imágenes incorrectas (ARM64)..." -ForegroundColor Yellow
docker rmi -f mcr.microsoft.com/azure-sql-edge:latest 2>$null
docker rmi -f pruebatecnicads-backend pruebatecnicads-frontend 2>$null
docker rmi -f pruebatecnicads_backend pruebatecnicads_frontend 2>$null

Write-Host "[4/5] Iniciando servicios..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR al iniciar servicios" -ForegroundColor Red
    Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor Yellow
    exit 1
}

Write-Host "[5/5] Esperando que los servicios inicien..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Esto puede tardar 1-2 minutos..." -ForegroundColor Cyan
Write-Host ""

# Esperar 60 segundos
Start-Sleep -Seconds 60

Write-Host ""
Write-Host "Estado de los servicios:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Listo!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Accede a la aplicación:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  Swagger:   http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "Login de prueba:" -ForegroundColor Cyan
Write-Host "  Email:     tecnico@mp.gob.gt" -ForegroundColor White
Write-Host "  Password:  Password123!" -ForegroundColor White
Write-Host ""
Write-Host "Ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f" -ForegroundColor White
Write-Host ""
