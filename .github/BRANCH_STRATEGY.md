# Estrategia de Ramas - DICRI

## Ramas Principales

### `main` (Producción)
- **Propósito**: Código en producción
- **Protección**: Requiere PR aprobado y CI passing
- **Despliegue**: Automático a Railway (producción)
- **Política**: Solo merge desde `staging` después de QA

### `staging` (Pre-producción)
- **Propósito**: Testing final y QA
- **Protección**: Requiere PR aprobado y CI passing
- **Despliegue**: Automático a Railway (staging environment)
- **Política**: Solo merge desde `develop` después de feature complete

### `develop` (Desarrollo)
- **Propósito**: Integración continua de features
- **Protección**: Requiere PR aprobado y CI passing
- **Despliegue**: Automático a Railway (desarrollo)
- **Política**: Merge desde feature branches

## Ramas de Trabajo

### Feature Branches
- **Formato**: `feature/<ticket-id>-<description>`
- **Ejemplo**: `feature/DICRI-123-auth-module`
- **Base**: `develop`
- **Merge to**: `develop`

### Bugfix Branches
- **Formato**: `bugfix/<ticket-id>-<description>`
- **Ejemplo**: `bugfix/DICRI-456-fix-login`
- **Base**: `develop` o `staging`
- **Merge to**: `develop` o `staging`

### Hotfix Branches
- **Formato**: `hotfix/<ticket-id>-<description>`
- **Ejemplo**: `hotfix/DICRI-789-critical-bug`
- **Base**: `main`
- **Merge to**: `main` y `develop`

## Flujo de Trabajo

```
feature/xxx → develop → staging → main
                  ↑         ↑        ↑
               Features    QA    Production
```

## Comandos Útiles

### Crear rama de feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/DICRI-XXX-description
```

### Merge a develop
```bash
git checkout develop
git pull origin develop
git merge feature/DICRI-XXX-description
git push origin develop
```

### Promoción a staging
```bash
git checkout staging
git pull origin staging
git merge develop
git push origin staging
```

### Release a producción
```bash
git checkout main
git pull origin main
git merge staging
git push origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
