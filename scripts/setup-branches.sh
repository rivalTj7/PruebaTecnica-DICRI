#!/bin/bash

# Script para crear las ramas de Git necesarias
# Uso: ./setup-branches.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   DICRI - Git Branch Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  No es un repositorio Git. Inicializando...${NC}"
    git init
    echo -e "${GREEN}✓${NC} Repositorio Git inicializado"
fi

# Crear rama develop si no existe
if ! git show-ref --verify --quiet refs/heads/develop; then
    echo -e "${BLUE}Creando rama develop...${NC}"
    git checkout -b develop
    echo -e "${GREEN}✓${NC} Rama develop creada"
else
    echo -e "${GREEN}✓${NC} Rama develop ya existe"
fi

# Crear rama staging si no existe
if ! git show-ref --verify --quiet refs/heads/staging; then
    echo -e "${BLUE}Creando rama staging...${NC}"
    git checkout -b staging
    echo -e "${GREEN}✓${NC} Rama staging creada"
else
    echo -e "${GREEN}✓${NC} Rama staging ya existe"
fi

# Volver a main
git checkout main 2>/dev/null || git checkout -b main

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✓ Ramas configuradas exitosamente${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Ramas disponibles:"
git branch -a
echo ""
echo "Para push a remote:"
echo "  git push -u origin main"
echo "  git push -u origin develop"
echo "  git push -u origin staging"
