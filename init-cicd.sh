#!/bin/bash

# Script de Inicialización CI/CD - DICRI
# Uso: ./init-cicd.sh [--all] [--setup-branches] [--install-tools]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

SETUP_BRANCHES=false
INSTALL_TOOLS=false
ALL=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --all)
            ALL=true
            SETUP_BRANCHES=true
            INSTALL_TOOLS=true
            ;;
        --setup-branches)
            SETUP_BRANCHES=true
            ;;
        --install-tools)
            INSTALL_TOOLS=true
            ;;
    esac
done

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}   DICRI - CI/CD Initialization${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Función para verificar comandos
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Instalar herramientas
if [ "$INSTALL_TOOLS" = true ]; then
    echo -e "${BLUE}📦 Verificando herramientas necesarias...${NC}"
    
    # Node.js
    if ! command_exists node; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        echo "   Descárgalo de: https://nodejs.org"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
    
    # Git
    if ! command_exists git; then
        echo -e "${RED}❌ Git no está instalado${NC}"
        echo "   Instálalo con: sudo apt install git (Ubuntu/Debian)"
        exit 1
    fi
    echo -e "${GREEN}✓ Git $(git --version)${NC}"
    
    # Railway CLI
    if ! command_exists railway; then
        echo -e "${YELLOW}⚙️  Instalando Railway CLI...${NC}"
        npm install -g @railway/cli
        echo -e "${GREEN}✓ Railway CLI instalado${NC}"
    else
        echo -e "${GREEN}✓ Railway CLI $(railway --version)${NC}"
    fi
    
    echo ""
fi

# Configurar ramas
if [ "$SETUP_BRANCHES" = true ]; then
    echo -e "${BLUE}🌳 Configurando estructura de ramas...${NC}"
    
    # Verificar que estamos en un repo git
    if [ ! -d .git ]; then
        echo -e "${YELLOW}⚠️  No es un repositorio Git. Inicializando...${NC}"
        git init
        echo -e "${GREEN}✓ Repositorio Git inicializado${NC}"
    fi
    
    # Crear rama develop
    if git show-ref --verify --quiet refs/heads/develop; then
        echo -e "${GREEN}✓ Rama develop ya existe${NC}"
    else
        echo -e "${YELLOW}⚙️  Creando rama develop...${NC}"
        git checkout -b develop
        echo -e "${GREEN}✓ Rama develop creada${NC}"
    fi
    
    # Crear rama staging
    if git show-ref --verify --quiet refs/heads/staging; then
        echo -e "${GREEN}✓ Rama staging ya existe${NC}"
    else
        echo -e "${YELLOW}⚙️  Creando rama staging...${NC}"
        git checkout -b staging
        echo -e "${GREEN}✓ Rama staging creada${NC}"
    fi
    
    # Volver a main
    git checkout main 2>/dev/null || git checkout -b main
    
    echo ""
    echo -e "${CYAN}Ramas disponibles:${NC}"
    git branch -a
    echo ""
fi

# Verificar archivos de configuración
echo -e "${BLUE}🔍 Verificando archivos de configuración...${NC}"

REQUIRED_FILES=(
    ".github/workflows/ci.yml"
    ".github/workflows/deploy.yml"
    ".github/workflows/pr-checks.yml"
    "backend/railway.json"
    "frontend/railway.json"
    "railway.toml"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}❌ $file (FALTANTE)${NC}"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Archivos faltantes detectados:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
fi

echo ""

# Instrucciones de siguiente paso
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✓ Inicialización completada${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}📝 Próximos pasos:${NC}"
echo ""
echo -e "${YELLOW}1️⃣  Push de ramas al repositorio remoto:${NC}"
echo "    git push -u origin main"
echo "    git push -u origin develop"
echo "    git push -u origin staging"
echo ""

echo -e "${YELLOW}2️⃣  Configurar GitHub Secrets:${NC}"
echo "    - Ve a: Settings → Secrets and variables → Actions"
echo "    - Agrega: RAILWAY_TOKEN, JWT_SECRET, JWT_REFRESH_SECRET"
echo ""

echo -e "${YELLOW}3️⃣  Configurar Railway:${NC}"
echo "    railway login"
echo "    Ver guía completa en: RAILWAY-SETUP.md"
echo ""

echo -e "${YELLOW}4️⃣  Configurar protección de ramas:${NC}"
echo "    Ver guía en: .github/BRANCH_PROTECTION.md"
echo ""

echo -e "${CYAN}📚 Documentación:${NC}"
echo "   - CI/CD Guide: CICD-DEPLOYMENT-GUIDE.md"
echo "   - Railway Setup: RAILWAY-SETUP.md"
echo "   - Branch Strategy: .github/BRANCH_STRATEGY.md"
echo ""

echo -e "${CYAN}🚀 Para deployment:${NC}"
echo "   ./scripts/deploy.sh production"
echo ""
