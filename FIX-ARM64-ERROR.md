# 🔴 ERROR: Platform ARM64 vs AMD64

## El Error

```
The requested image's platform (linux/arm64) does not match
the detected host platform (linux/amd64/v3)
```

## ¿Por Qué Pasa?

Docker tiene **imágenes en caché** del intento anterior cuando el proyecto estaba configurado para Mac Apple Silicon (ARM64). Aunque ya corregimos el `docker-compose.yml`, Docker sigue intentando usar las imágenes viejas.

## 🚀 Solución Rápida

### Opción 1: Script Automático de Limpieza (RECOMENDADO)

Ejecuta desde PowerShell en el directorio del proyecto:

```powershell
.\clean-docker.ps1
```

Este script:
- ✅ Elimina todos los contenedores del proyecto
- ✅ Elimina todos los volúmenes
- ✅ Elimina imágenes ARM64 en caché
- ✅ Descarga la imagen correcta de SQL Server 2022 para AMD64
- ✅ Verifica que la arquitectura sea correcta

Luego inicia el proyecto:

```powershell
.\start.ps1
```

---

### Opción 2: Comandos Manuales

Si prefieres hacerlo manualmente:

```powershell
# 1. Detener y eliminar contenedores
docker-compose down -v
docker rm -f dicri-database dicri-backend dicri-frontend

# 2. Eliminar volúmenes
docker volume rm pruebatecnicads_sqlserver_data
docker volume prune -f

# 3. Eliminar imágenes ARM64
docker rmi -f mcr.microsoft.com/azure-sql-edge:latest
docker rmi -f pruebatecnicads-backend
docker rmi -f pruebatecnicads-frontend

# 4. Limpiar cache de construcción
docker builder prune -f

# 5. Descargar imagen correcta
docker pull --platform linux/amd64 mcr.microsoft.com/mssql/server:2022-latest

# 6. Verificar arquitectura
docker inspect mcr.microsoft.com/mssql/server:2022-latest | findstr Architecture
# Debe mostrar: "Architecture": "amd64"

# 7. Iniciar proyecto
docker-compose up -d
```

---

### Opción 3: Limpieza Nuclear (Si nada funciona)

**⚠️ ADVERTENCIA**: Esto eliminará TODOS los contenedores, imágenes y volúmenes de Docker (no solo del proyecto)

```powershell
# Detener todos los contenedores
docker stop $(docker ps -aq)

# Eliminar todos los contenedores
docker rm $(docker ps -aq)

# Eliminar todas las imágenes
docker rmi $(docker images -q) -f

# Eliminar todos los volúmenes
docker volume rm $(docker volume ls -q)

# Limpieza completa del sistema
docker system prune -a --volumes -f

# Reiniciar Docker Desktop
# (Right-click en el ícono de Docker Desktop → Restart)

# Descargar imagen correcta
docker pull --platform linux/amd64 mcr.microsoft.com/mssql/server:2022-latest

# Iniciar proyecto
cd "ruta\al\proyecto\PruebaTecnicaDS"
docker-compose up -d
```

---

## 🔍 Verificación

Después de la limpieza, verifica que todo esté correcto:

### 1. Verificar que la imagen sea AMD64

```powershell
docker inspect mcr.microsoft.com/mssql/server:2022-latest | findstr Architecture
```

Debe mostrar: `"Architecture": "amd64"`

### 2. Verificar contenedores corriendo

```powershell
docker-compose ps
```

Debes ver:
```
NAME              STATUS
dicri-database    Up (healthy)
dicri-backend     Up
dicri-frontend    Up
```

### 3. Verificar logs de la base de datos

```powershell
docker-compose logs database | findstr "ready for client connections"
```

Debes ver: `SQL Server is now ready for client connections`

### 4. Probar conectividad

```powershell
# Probar backend
curl http://localhost:5000/health

# Abrir en navegador
start http://localhost:3000
```

---

## ❓ Por Qué Pasó Esto

1. **Configuración inicial**: El proyecto estaba configurado con `platform: linux/arm64` para Mac Apple Silicon
2. **Tu sistema**: Windows con procesador Intel/AMD (arquitectura AMD64)
3. **El conflicto**: Docker intentó usar imágenes ARM64 en un sistema AMD64
4. **La solución**: Eliminamos las especificaciones de plataforma y limpiamos la caché

---

## 📚 Entendiendo las Arquitecturas

| Arquitectura | Procesadores | Dispositivos |
|--------------|-------------|--------------|
| **AMD64** (x86_64) | Intel, AMD | La mayoría de PCs Windows/Linux |
| **ARM64** (aarch64) | Apple Silicon, ARM | Mac M1/M2/M3, Raspberry Pi |

Docker en Windows siempre usa **Linux** (vía WSL2), pero la arquitectura del procesador (AMD64 vs ARM64) sí importa.

---

## 🎯 Resumen

**El problema NO es Windows vs Linux**

Es: **ARM64 (Mac) vs AMD64 (tu PC)**

**La solución**: Limpiar imágenes ARM64 en caché y forzar descarga de AMD64

**Comando más rápido**:
```powershell
.\clean-docker.ps1
.\start.ps1
```

---

## 🆘 Si Aún No Funciona

1. **Verifica Docker Desktop esté corriendo**:
   ```powershell
   Get-Process "Docker Desktop"
   ```

2. **Verifica WSL2 esté habilitado**:
   ```powershell
   wsl --status
   ```

3. **Reinicia Docker Desktop**:
   - Right-click en el ícono → Restart

4. **Verifica recursos asignados** (Settings → Resources):
   - Memory: 4 GB mínimo
   - CPUs: 2 cores mínimo

5. **Consulta troubleshooting completo**:
   - [troubleshoot-database.md](troubleshoot-database.md)

---

## ✅ Una Vez Funcionando

Accede a:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Swagger**: http://localhost:5000/api-docs

**Credenciales de prueba**:
- Email: `tecnico@mp.gob.gt`
- Password: `Password123!`
