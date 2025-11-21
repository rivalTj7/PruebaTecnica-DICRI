# 🚀 Quick Start - CI/CD & Railway Deployment

## ⚡ Setup Rápido (5 minutos)

### 1. Inicializar CI/CD

**Windows:**
```powershell
.\init-cicd.ps1 -All
```

**Linux/Mac:**
```bash
chmod +x init-cicd.sh
./init-cicd.sh --all
```

### 2. Push Ramas

```bash
git push -u origin main
git push -u origin develop
git push -u origin staging
```

### 3. Configurar GitHub Secrets

En GitHub: **Settings → Secrets → New secret**

```
RAILWAY_TOKEN=<obtener-con: railway whoami --json>
JWT_SECRET=<generar-con: node generate-hash.js>
JWT_REFRESH_SECRET=<generar-con: node generate-hash.js>
PROD_API_URL=https://dicri-backend-prod.railway.app
STAGING_API_URL=https://dicri-backend-staging.railway.app
DEV_API_URL=https://dicri-backend-dev.railway.app
```

### 4. Setup Railway

```bash
# Login
railway login

# Crear proyectos (3 proyectos: prod, staging, dev)
railway init --name dicri-production
railway init --name dicri-staging
railway init --name dicri-development

# Para cada proyecto:
# 1. Agregar SQL Server Database
# 2. Crear Backend Service (root: /backend, branch: main/staging/develop)
# 3. Crear Frontend Service (root: /frontend, branch: main/staging/develop)
# 4. Configurar variables de entorno
```

Ver guía detallada: [RAILWAY-SETUP.md](RAILWAY-SETUP.md)

---

## 🎯 Estructura del Proyecto

```
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Tests y validación
│   │   ├── deploy.yml       # Deploy a Railway
│   │   └── pr-checks.yml    # Checks de PRs
│   ├── BRANCH_STRATEGY.md
│   └── BRANCH_PROTECTION.md
├── backend/
│   ├── railway.json         # Config Railway backend
│   └── .env.railway         # Template variables
├── frontend/
│   ├── railway.json         # Config Railway frontend
│   └── .env.railway         # Template variables
├── scripts/
│   ├── deploy.ps1           # Deploy manual (Windows)
│   ├── deploy.sh            # Deploy manual (Linux/Mac)
│   ├── setup-branches.ps1   # Setup ramas (Windows)
│   └── setup-branches.sh    # Setup ramas (Linux/Mac)
├── init-cicd.ps1            # Inicialización (Windows)
├── init-cicd.sh             # Inicialización (Linux/Mac)
├── CICD-DEPLOYMENT-GUIDE.md # Guía completa CI/CD
└── RAILWAY-SETUP.md         # Guía completa Railway
```

---

## 🌳 Flujo de Trabajo

### Desarrollo Normal

```bash
# 1. Crear feature branch
git checkout develop
git checkout -b feature/DICRI-123-new-feature

# 2. Hacer cambios
git add .
git commit -m "feat: add new feature"
git push origin feature/DICRI-123-new-feature

# 3. Crear PR a develop
# 4. CI runs automáticamente
# 5. Merge → Deploy automático a Railway Dev
```

### Release a Staging

```bash
git checkout staging
git merge develop
git push origin staging
# → Deploy automático a Railway Staging
```

### Release a Producción

```bash
git checkout main
git merge staging
git push origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
# → Deploy automático a Railway Production
```

---

## 🔧 Workflows GitHub Actions

### CI - Tests y Validación
- **Trigger**: Push/PR a main, staging, develop
- **Jobs**: Backend tests, lint, frontend build, docker validation

### CD - Deploy to Railway
- **Trigger**: Push a main, staging, develop
- **Jobs**: Deploy backend, deploy frontend, health checks

### PR Checks
- **Trigger**: Pull requests
- **Jobs**: Validate title, check size, run tests, comment results

---

## 🚂 Railway Environments

| Environment | Branch  | Backend URL | Frontend URL |
|-------------|---------|-------------|--------------|
| Production  | main    | dicri-backend-prod.railway.app | dicri-frontend-prod.railway.app |
| Staging     | staging | dicri-backend-staging.railway.app | dicri-frontend-staging.railway.app |
| Development | develop | dicri-backend-dev.railway.app | dicri-frontend-dev.railway.app |

---

## 📋 Checklist Completo

### GitHub
- [ ] Repositorio creado
- [ ] Ramas creadas (main, staging, develop)
- [ ] Ramas pusheadas a remote
- [ ] GitHub Secrets configurados
- [ ] Branch protection rules aplicadas
- [ ] Workflows verificados

### Railway
- [ ] Cuenta creada
- [ ] Railway CLI instalado
- [ ] 3 proyectos creados
- [ ] SQL Server agregado a cada proyecto
- [ ] Backend services configurados
- [ ] Frontend services configurados
- [ ] Variables de entorno configuradas
- [ ] Dominios generados
- [ ] Primer deploy exitoso

### Testing
- [ ] CI workflow passing
- [ ] Deploy workflow passing
- [ ] Backend health check OK
- [ ] Frontend accessible
- [ ] Database connection OK
- [ ] API endpoints working
- [ ] CORS configurado

---

## 🛠️ Comandos Útiles

### Railway
```bash
railway login                    # Login a Railway
railway list                     # Listar proyectos
railway link                     # Link a proyecto
railway up                       # Deploy
railway logs                     # Ver logs
railway variables                # Ver variables
railway open                     # Abrir en browser
```

### Git
```bash
git checkout develop             # Cambiar a develop
git checkout -b feature/xxx      # Crear feature branch
git merge develop                # Merge develop
git tag -a v1.0.0                # Crear tag
```

### Deploy Manual
```bash
# Windows
.\scripts\deploy.ps1 -Environment production

# Linux/Mac
./scripts/deploy.sh production
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [CICD-DEPLOYMENT-GUIDE.md](CICD-DEPLOYMENT-GUIDE.md) | Guía completa de CI/CD y deployment |
| [RAILWAY-SETUP.md](RAILWAY-SETUP.md) | Configuración paso a paso de Railway |
| [.github/BRANCH_STRATEGY.md](.github/BRANCH_STRATEGY.md) | Estrategia de ramas |
| [.github/BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md) | Configuración de protección |
| [.github/workflows/README.md](.github/workflows/README.md) | Documentación de workflows |

---

## 🐛 Troubleshooting

### CI Fails
```bash
# Ver logs en GitHub Actions
# Ejecutar localmente:
cd backend && npm test
cd frontend && npm run build
```

### Deploy Fails
```bash
# Ver logs
railway logs --service dicri-backend-prod

# Verificar variables
railway variables

# Redeploy
railway up
```

### Database Issues
```bash
# Verificar conexión
railway variables | grep MSSQL

# Test desde Railway
railway run node -e "require('mssql').connect('...')"
```

---

## 🆘 Soporte

- **Documentación completa**: Ver archivos MD en el proyecto
- **Railway Docs**: https://docs.railway.app
- **GitHub Actions**: https://docs.github.com/actions
- **Railway Discord**: https://discord.gg/railway

---

## ✅ Next Steps

1. ✅ CI/CD configurado
2. ✅ Workflows creados
3. ✅ Scripts de deployment listos
4. ⏭️ Configurar GitHub Secrets
5. ⏭️ Setup Railway projects
6. ⏭️ Primer deployment
7. ⏭️ Configurar branch protection
8. ⏭️ Testing completo

---

**¡Listo para producción! 🚀**
