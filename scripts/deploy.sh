#!/bin/bash

# Script de Deploy Manual para Railway
# Uso: ./deploy.sh [environment]
# Environments: production, staging, development

set -e

ENVIRONMENT=${1:-production}
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   DICRI - Railway Deployment Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Validar Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI no está instalado${NC}"
    echo "Instálalo con: npm install -g @railway/cli"
    exit 1
fi

echo -e "${GREEN}✓${NC} Railway CLI encontrado"

# Validar token
if [ -z "$RAILWAY_TOKEN" ]; then
    echo -e "${RED}❌ RAILWAY_TOKEN no está configurado${NC}"
    echo "Configura tu token con: export RAILWAY_TOKEN=<tu-token>"
    exit 1
fi

echo -e "${GREEN}✓${NC} RAILWAY_TOKEN configurado"

# Confirmar deployment
echo ""
echo -e "Environment: ${BLUE}${ENVIRONMENT}${NC}"
echo -e "Branch: ${BLUE}$(git branch --show-current)${NC}"
echo -e "Commit: ${BLUE}$(git rev-parse --short HEAD)${NC}"
echo ""
read -p "¿Continuar con el deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelado"
    exit 0
fi

# Deploy Backend
echo ""
echo -e "${BLUE}Deploying Backend...${NC}"
cd backend
railway up --service dicri-backend-${ENVIRONMENT}
cd ..

echo -e "${GREEN}✓${NC} Backend deployed"

# Deploy Frontend
echo ""
echo -e "${BLUE}Deploying Frontend...${NC}"
cd frontend
railway up --service dicri-frontend-${ENVIRONMENT}
cd ..

echo -e "${GREEN}✓${NC} Frontend deployed"

# Verificar health checks
echo ""
echo -e "${BLUE}Verificando servicios...${NC}"
sleep 10

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✓ Deployment completado exitosamente${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Revisa los logs con:"
echo "  railway logs --service dicri-backend-${ENVIRONMENT}"
echo "  railway logs --service dicri-frontend-${ENVIRONMENT}"
