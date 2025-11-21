# Script para crear las ramas de Git necesarias (PowerShell)
# Uso: .\setup-branches.ps1

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "   DICRI - Git Branch Setup" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Verificar que estamos en un repositorio git
try {
    git rev-parse --git-dir | Out-Null
}
catch {
    Write-Host "⚠️  No es un repositorio Git. Inicializando..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repositorio Git inicializado" -ForegroundColor Green
}

# Crear rama develop si no existe
try {
    git show-ref --verify refs/heads/develop | Out-Null
    Write-Host "✓ Rama develop ya existe" -ForegroundColor Green
}
catch {
    Write-Host "Creando rama develop..." -ForegroundColor Blue
    git checkout -b develop
    Write-Host "✓ Rama develop creada" -ForegroundColor Green
}

# Crear rama staging si no existe
try {
    git show-ref --verify refs/heads/staging | Out-Null
    Write-Host "✓ Rama staging ya existe" -ForegroundColor Green
}
catch {
    Write-Host "Creando rama staging..." -ForegroundColor Blue
    git checkout -b staging
    Write-Host "✓ Rama staging creada" -ForegroundColor Green
}

# Volver a main
try {
    git checkout main
}
catch {
    git checkout -b main
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "   ✓ Ramas configuradas exitosamente" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "Ramas disponibles:"
git branch -a
Write-Host ""
Write-Host "Para push a remote:"
Write-Host "  git push -u origin main"
Write-Host "  git push -u origin develop"
Write-Host "  git push -u origin staging"
