#!/bin/bash

# Script de inicio para Windows/WSL2
# Este script configura y levanta todos los servicios en Windows

echo "================================================"
echo "  DICRI - Sistema de Gestión de Evidencias"
echo "  Inicio para Windows/WSL2"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en WSL2
if ! grep -qEi "(Microsoft|WSL)" /proc/version &> /dev/null; then
    print_warning "No se detectó WSL2. Este script está diseñado para Windows/WSL2."
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado o no está en el PATH."
    exit 1
fi

print_info "Docker detectado: $(docker --version)"

# Verificar kernel parameter
AIO_MAX=$(cat /proc/sys/fs/aio-max-nr 2>/dev/null || echo "0")
print_info "Valor actual de fs.aio-max-nr: $AIO_MAX"

if [ "$AIO_MAX" -lt 1048576 ]; then
    print_warning "El valor de fs.aio-max-nr es bajo ($AIO_MAX)"
    print_warning "Recomendado: 1048576 o superior"
    print_warning "Consulta WINDOWS-WSL2-SETUP.md para instrucciones"
    echo ""

    read -p "¿Deseas continuar de todos modos? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Abortando. Por favor configura .wslconfig según WINDOWS-WSL2-SETUP.md"
        exit 1
    fi
fi

# Limpiar contenedores y volúmenes anteriores
print_info "Limpiando contenedores anteriores..."
docker-compose down -v 2>/dev/null

# Preguntar qué versión usar
echo ""
echo "Selecciona la configuración de Docker Compose:"
echo "  1) docker-compose.yml (Azure SQL Edge - para Mac ARM64)"
echo "  2) docker-compose.windows.yml (SQL Server 2022 - recomendado para Windows)"
echo ""
read -p "Opción (1 o 2) [default: 2]: " COMPOSE_CHOICE

if [ "$COMPOSE_CHOICE" == "1" ]; then
    COMPOSE_FILE="docker-compose.yml"
    print_info "Usando docker-compose.yml (Azure SQL Edge)"
else
    COMPOSE_FILE="docker-compose.windows.yml"
    print_info "Usando docker-compose.windows.yml (SQL Server 2022)"
fi

# Verificar que el archivo existe
if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Archivo $COMPOSE_FILE no encontrado"
    exit 1
fi

# Levantar servicios
print_info "Levantando servicios con $COMPOSE_FILE..."
echo ""

if [ "$COMPOSE_FILE" == "docker-compose.windows.yml" ]; then
    docker-compose -f docker-compose.windows.yml up -d
else
    docker-compose up -d
fi

if [ $? -ne 0 ]; then
    print_error "Error al levantar los servicios"
    print_info "Verifica los logs con: docker-compose logs -f"
    exit 1
fi

# Esperar y mostrar progreso
print_info "Esperando que los servicios inicien..."
echo ""

# Función para verificar estado de un servicio
check_service() {
    local service=$1
    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if docker-compose ps | grep -q "$service.*Up"; then
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    return 1
}

# Verificar base de datos
print_info "Verificando base de datos..."
for i in {1..60}; do
    if docker-compose ps | grep -q "dicri-database.*Up (healthy)"; then
        print_info "✓ Base de datos iniciada correctamente"
        break
    fi
    echo -n "."
    sleep 2

    if [ $i -eq 60 ]; then
        print_warning "Base de datos tardó más de lo esperado"
        print_info "Ver logs: docker-compose logs database"
    fi
done
echo ""

# Verificar backend
print_info "Verificando backend..."
for i in {1..30}; do
    if docker-compose ps | grep -q "dicri-backend.*Up"; then
        print_info "✓ Backend iniciado correctamente"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Verificar frontend
print_info "Verificando frontend..."
for i in {1..30}; do
    if docker-compose ps | grep -q "dicri-frontend.*Up"; then
        print_info "✓ Frontend iniciado correctamente"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Mostrar estado final
echo ""
print_info "Estado de los servicios:"
echo ""
docker-compose ps
echo ""

# Verificar que todos estén corriendo
ALL_UP=true
if ! docker-compose ps | grep -q "dicri-database.*Up"; then
    print_error "✗ Base de datos no está corriendo"
    ALL_UP=false
fi

if ! docker-compose ps | grep -q "dicri-backend.*Up"; then
    print_error "✗ Backend no está corriendo"
    ALL_UP=false
fi

if ! docker-compose ps | grep -q "dicri-frontend.*Up"; then
    print_error "✗ Frontend no está corriendo"
    ALL_UP=false
fi

if [ "$ALL_UP" = true ]; then
    echo ""
    print_info "================================================"
    print_info "  ✓ Sistema iniciado correctamente"
    print_info "================================================"
    echo ""
    echo "URLs de acceso:"
    echo "  - Frontend:    http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo "  - Swagger:     http://localhost:5000/api-docs"
    echo ""
    echo "Credenciales de prueba:"
    echo "  Técnico:"
    echo "    Email:    tecnico@mp.gob.gt"
    echo "    Password: Password123!"
    echo ""
    echo "  Coordinador:"
    echo "    Email:    coordinador@mp.gob.gt"
    echo "    Password: Password123!"
    echo ""
    echo "  Administrador:"
    echo "    Email:    admin@mp.gob.gt"
    echo "    Password: Password123!"
    echo ""
    print_info "Ver logs en tiempo real: docker-compose logs -f"
    print_info "Detener servicios: docker-compose down"
    echo ""
else
    echo ""
    print_error "================================================"
    print_error "  Algunos servicios no iniciaron correctamente"
    print_error "================================================"
    echo ""
    print_info "Para ver logs de un servicio específico:"
    echo "  docker-compose logs database"
    echo "  docker-compose logs backend"
    echo "  docker-compose logs frontend"
    echo ""
    print_info "Para reintentar:"
    echo "  docker-compose down -v"
    echo "  ./start-windows.sh"
    echo ""
    print_info "Consulta WINDOWS-WSL2-SETUP.md para troubleshooting"
    echo ""
fi
