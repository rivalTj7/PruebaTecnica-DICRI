# Configuración de Protección de Ramas

## Para configurar en GitHub

### Main Branch (Producción)

**Settings → Branches → Add rule**

- **Branch name pattern**: `main`
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - **Status checks**: 
    - `Backend Tests`
    - `Backend Lint`
    - `Frontend Build`
    - `Docker Validation`
- ✅ Require conversation resolution before merging
- ✅ Require signed commits
- ✅ Include administrators
- ✅ Restrict who can push to matching branches
  - Solo: Release Manager, DevOps Team

### Staging Branch (Pre-producción)

**Settings → Branches → Add rule**

- **Branch name pattern**: `staging`
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - **Status checks**: 
    - `Backend Tests`
    - `Backend Lint`
    - `Frontend Build`
- ✅ Require conversation resolution before merging
- ✅ Include administrators

### Develop Branch (Desarrollo)

**Settings → Branches → Add rule**

- **Branch name pattern**: `develop`
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
- ✅ Require status checks to pass before merging
  - **Status checks**: 
    - `Backend Tests`
    - `Frontend Build`
- ✅ Require conversation resolution before merging

## Rulesets Adicionales

### Feature Branches

**Settings → Branches → Add rule**

- **Branch name pattern**: `feature/*`
- ✅ Require linear history
- ✅ Do not allow bypassing the above settings

### Hotfix Branches

**Settings → Branches → Add rule**

- **Branch name pattern**: `hotfix/*`
- ✅ Require pull request before merging
- ✅ Require status checks to pass before merging
- ⚠️ Allow force pushes (solo para emergencias)

## Tags Protection

**Settings → Tags → Add rule**

- **Tag name pattern**: `v*`
- ✅ Require signed commits
- ✅ Restrict who can push matching tags
  - Solo: Release Manager

## GitHub Environments

### Production Environment

**Settings → Environments → New environment**

- **Name**: `production`
- ✅ Required reviewers: 2
- ✅ Wait timer: 5 minutes
- **Deployment branches**: Only `main`
- **Environment secrets**: RAILWAY_TOKEN, DB credentials

### Staging Environment

**Settings → Environments → New environment**

- **Name**: `staging`
- ✅ Required reviewers: 1
- **Deployment branches**: Only `staging`
- **Environment secrets**: RAILWAY_TOKEN, DB credentials

### Development Environment

**Settings → Environments → New environment**

- **Name**: `development`
- **Deployment branches**: Only `develop`
- **Environment secrets**: RAILWAY_TOKEN, DB credentials

## Auto-delete Head Branches

**Settings → General → Pull Requests**

- ✅ Automatically delete head branches

## Merge Options

**Settings → General → Pull Requests**

- ✅ Allow squash merging
- ✅ Allow merge commits
- ❌ Allow rebase merging (desactivar)
- ✅ Always suggest updating pull request branches
