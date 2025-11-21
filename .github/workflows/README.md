# GitHub Actions Workflows

Este directorio contiene los workflows de CI/CD para el proyecto DICRI.

## 📋 Workflows Disponibles

### 1. CI - Tests y Validación (`ci.yml`)

**Trigger**: Push y PR a `main`, `staging`, `develop`

Ejecuta tests automáticos y validaciones de código:
- ✅ Backend Tests con cobertura
- ✅ Backend Lint (ESLint)
- ✅ Frontend Build
- ✅ Docker Build Validation
- ✅ Pipeline Status Summary

**Badges**:
```markdown
![CI](https://github.com/rivalTj7/PruebaTecnica-DICRI/workflows/CI%20-%20Tests%20y%20Validación/badge.svg)
```

### 2. CD - Deploy to Railway (`deploy.yml`)

**Trigger**: Push a `main`, `staging`, `develop`

Despliega automáticamente a Railway:
- 🚀 Deploy Backend
- 🚀 Deploy Frontend
- ✅ Health Checks
- 📢 Notifications

**Environments**:
- `main` → Production
- `staging` → Staging
- `develop` → Development

### 3. PR Checks (`pr-checks.yml`)

**Trigger**: Pull Requests

Valida PRs antes de merge:
- ✅ Validate PR title (conventional commits)
- ✅ Check PR size
- ✅ Run tests
- 💬 Comment results in PR

## 🔐 Secrets Requeridos

Configurar en: **Settings → Secrets and variables → Actions**

### Secrets Obligatorios

```
RAILWAY_TOKEN              # Token de Railway CLI
JWT_SECRET                 # Secret para JWT tokens
JWT_REFRESH_SECRET         # Secret para refresh tokens
```

### Secrets por Ambiente

```
# Production
PROD_API_URL              # https://dicri-backend-prod.railway.app

# Staging
STAGING_API_URL           # https://dicri-backend-staging.railway.app

# Development
DEV_API_URL               # https://dicri-backend-dev.railway.app
```

### Obtener Railway Token

```bash
railway login
railway whoami --json | jq -r .token
```

## 🚀 Uso

### Trigger Manual

Para ejecutar un workflow manualmente:

1. Ve a **Actions** en GitHub
2. Selecciona el workflow
3. Click en **Run workflow**
4. Selecciona la rama
5. Click en **Run workflow**

### Deploy Manual

```bash
# Trigger deploy haciendo push
git push origin main        # Deploy a production
git push origin staging     # Deploy a staging
git push origin develop     # Deploy a development
```

## 📊 Status Checks

Los siguientes status checks deben pasar para merge:

### Para `main`:
- ✅ Backend Tests
- ✅ Backend Lint
- ✅ Frontend Build
- ✅ Docker Validation

### Para `staging`:
- ✅ Backend Tests
- ✅ Frontend Build

### Para `develop`:
- ✅ Backend Tests
- ✅ Frontend Build

## 🐛 Troubleshooting

### Workflow Falla

1. **Check logs**: Click en el workflow fallido → Ver logs detallados
2. **Re-run**: Click en "Re-run failed jobs"
3. **Local test**: Ejecutar localmente antes de push

```bash
# Tests backend
cd backend && npm test

# Build frontend
cd frontend && npm run build
```

### Secrets no Definidos

```bash
# Error: "Secret RAILWAY_TOKEN is not defined"
```

**Solución**: Agregar secret en Settings → Secrets

### Railway Deploy Timeout

```bash
# Error: "Deployment timeout"
```

**Solución**: Aumentar `healthcheckTimeout` en `railway.json`

## 📝 Convenciones

### PR Titles

Los títulos de PR deben seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve database connection issue
docs: update deployment guide
style: format code with prettier
refactor: restructure auth module
perf: optimize database queries
test: add unit tests for auth
build: update dependencies
ci: improve deployment workflow
chore: update .gitignore
```

### Commit Messages

```bash
# Good
git commit -m "feat: add login endpoint"
git commit -m "fix: resolve CORS issue"

# Bad
git commit -m "updates"
git commit -m "fix bug"
```

## 🔄 Maintenance

### Actualizar Workflows

```bash
# 1. Editar workflow
vim .github/workflows/ci.yml

# 2. Commit cambios
git add .github/workflows/ci.yml
git commit -m "ci: update CI workflow"

# 3. Push
git push origin main
```

### Verificar Workflows

```bash
# Validar sintaxis YAML
yamllint .github/workflows/*.yml

# O usar GitHub CLI
gh workflow list
gh workflow view ci.yml
```

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Deployment](https://docs.railway.app)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🆘 Soporte

Si tienes problemas con los workflows:

1. Revisa los logs en GitHub Actions
2. Consulta la documentación en `CICD-DEPLOYMENT-GUIDE.md`
3. Contacta al equipo DevOps

---

**Última actualización**: 21 de noviembre de 2025
