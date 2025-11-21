# Troubleshooting - Base de Datos SQL Server en Windows/WSL2

## Problema: La base de datos no inicia

### Diagnóstico Rápido

Ejecuta estos comandos en PowerShell para diagnosticar:

```powershell
# 1. Ver estado del contenedor
docker ps -a | findstr dicri-database

# 2. Ver logs de la base de datos
docker logs dicri-database --tail 50

# 3. Verificar que Docker Desktop esté corriendo
Get-Process "Docker Desktop"

# 4. Verificar versión de WSL2
wsl --status
```

---

## Soluciones Comunes

### Solución 1: Reinicio Completo con Script Automático

Usa el script de PowerShell que limpia todo y reinicia correctamente:

```powershell
# Desde PowerShell en el directorio del proyecto
.\restart-windows.ps1
```

Este script:
- Detiene todos los contenedores
- Elimina volúmenes antiguos
- Limpia el sistema Docker
- Inicia todo de nuevo con la configuración correcta

---

### Solución 2: Reinicio Manual

Si prefieres hacerlo manualmente:

```powershell
# 1. Detener todos los contenedores
docker-compose -f docker-compose.windows-simple.yml down -v

# 2. Limpiar completamente
docker rm -f dicri-database dicri-backend dicri-frontend
docker volume prune -f
docker system prune -f

# 3. Iniciar solo la base de datos primero
docker-compose -f docker-compose.windows-simple.yml up -d database

# 4. Esperar 30 segundos y verificar logs
Start-Sleep -Seconds 30
docker logs dicri-database --tail 20

# 5. Si la base de datos está corriendo, iniciar los demás servicios
docker-compose -f docker-compose.windows-simple.yml up -d backend frontend
```

---

### Solución 3: Verificar y Aumentar Recursos de Docker Desktop

La base de datos necesita recursos suficientes:

**Pasos:**

1. Abre Docker Desktop
2. Ve a Settings → Resources
3. Asegúrate de tener:
   - **Memory**: Mínimo 4 GB (recomendado 6 GB)
   - **CPUs**: Mínimo 2 cores
   - **Disk**: Mínimo 20 GB libres
4. Haz clic en "Apply & Restart"
5. Espera a que Docker Desktop se reinicie
6. Ejecuta de nuevo el script de reinicio

---

### Solución 4: Verificar Puerto 1433

El puerto 1433 puede estar ocupado por otra instancia de SQL Server:

```powershell
# Verificar qué está usando el puerto 1433
netstat -ano | findstr :1433

# Si hay algo, detenerlo o cambiar el puerto en docker-compose
```

Si el puerto está ocupado, puedes cambiar el puerto en `docker-compose.windows-simple.yml`:

```yaml
ports:
  - "1434:1433"  # Cambiar 1433 a 1434 en el lado del host
```

Y actualizar la variable de entorno en backend:

```yaml
environment:
  - DB_PORT=1433  # Este sigue siendo 1433 (puerto interno del contenedor)
```

---

### Solución 5: Actualizar Docker Desktop y WSL2

Asegúrate de tener las versiones más recientes:

```powershell
# Actualizar WSL2
wsl --update

# Verificar versión
wsl --version
```

Luego actualiza Docker Desktop a la última versión desde:
https://www.docker.com/products/docker-desktop/

---

### Solución 6: Ejecutar SQL Server con Configuración Mínima

Si la base de datos sigue sin iniciar, prueba con una configuración ultra-simple:

```powershell
# Detener todo
docker-compose down -v

# Ejecutar SQL Server directamente (sin docker-compose)
docker run -d `
  --name dicri-database-test `
  -e ACCEPT_EULA=Y `
  -e MSSQL_SA_PASSWORD=DicrI2024!Secure `
  -e MSSQL_PID=Developer `
  -p 1433:1433 `
  mcr.microsoft.com/mssql/server:2022-latest

# Esperar 30 segundos
Start-Sleep -Seconds 30

# Ver logs
docker logs dicri-database-test

# Probar conexión
docker exec -it dicri-database-test /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure -Q "SELECT @@VERSION"
```

Si esto funciona, el problema está en la configuración de docker-compose.

---

## Errores Específicos y Soluciones

### Error: "fs.aio-max-nr"

**Síntoma:**
```
Unable to create a new asynchronous I/O context.
Please increase sysctl fs.aio-max-nr.
```

**Solución:**

Crea o edita `C:\Users\TuUsuario\.wslconfig`:

```ini
[wsl2]
memory=4GB
kernelCommandLine = sysctl.fs.aio-max-nr=1048576
```

Luego reinicia WSL2:

```powershell
wsl --shutdown
# Esperar 10 segundos
timeout /t 10
# Abrir WSL2 de nuevo
```

---

### Error: "Cannot allocate memory"

**Síntoma:**
```
Cannot allocate memory for the buffer pool
```

**Solución:**

1. Aumenta la memoria en Docker Desktop (Settings → Resources → Memory a 6 GB)
2. O agrega límite de memoria a SQL Server en docker-compose:

```yaml
environment:
  - MSSQL_MEMORY_LIMIT_MB=2048
```

---

### Error: "Password validation failed"

**Síntoma:**
```
The password does not meet SQL Server password policy requirements
```

**Solución:**

La contraseña `DicrI2024!Secure` ya cumple los requisitos. Si cambias la contraseña, debe tener:
- Mínimo 8 caracteres
- Mayúsculas y minúsculas
- Números
- Caracteres especiales

---

### Error: Contenedor inicia pero después se detiene

**Síntoma:**
```
docker ps -a muestra "Exited (1)"
```

**Solución:**

```powershell
# Ver logs completos
docker logs dicri-database

# Si hay error de volumen corrupto:
docker volume rm pruebatecnicads_sqlserver_data
docker-compose -f docker-compose.windows-simple.yml up -d database
```

---

## Verificación de que la Base de Datos Está Funcionando

### Test 1: Contenedor Corriendo

```powershell
docker ps | findstr dicri-database
```

Debes ver: **Up** y **(healthy)**

### Test 2: Conexión SQL

```powershell
docker exec -it dicri-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure -Q "SELECT 1 AS Test"
```

Debes ver:
```
Test
----
   1
```

### Test 3: Base de Datos DICRI_DB Existe

```powershell
docker exec -it dicri-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure -Q "SELECT name FROM sys.databases"
```

Debes ver `DICRI_DB` en la lista.

---

## Logs Útiles

```powershell
# Ver logs en tiempo real
docker logs dicri-database -f

# Ver últimas 50 líneas
docker logs dicri-database --tail 50

# Ver logs con timestamps
docker logs dicri-database --timestamps

# Buscar errores específicos
docker logs dicri-database 2>&1 | Select-String "error" -Context 2
docker logs dicri-database 2>&1 | Select-String "failed" -Context 2
```

---

## Contactar Soporte

Si ninguna solución funciona, por favor proporciona:

1. Salida de: `docker --version`
2. Salida de: `wsl --version`
3. Salida de: `docker logs dicri-database --tail 100`
4. Salida de: `docker inspect dicri-database`
5. Recursos asignados en Docker Desktop (Settings → Resources)

---

## Cambiar a Azure SQL Edge (Alternativa)

Si SQL Server 2022 no funciona, puedes intentar con Azure SQL Edge:

En `docker-compose.windows-simple.yml`, cambia:

```yaml
database:
  image: mcr.microsoft.com/azure-sql-edge:latest  # Cambiar esta línea
  # ... resto de la configuración igual
```

Luego:

```powershell
docker-compose -f docker-compose.windows-simple.yml down -v
docker pull mcr.microsoft.com/azure-sql-edge:latest
docker-compose -f docker-compose.windows-simple.yml up -d
```

---

## Comandos de Limpieza Profunda (Úsalos con cuidado)

**ADVERTENCIA**: Estos comandos eliminarán TODOS los contenedores, imágenes y volúmenes de Docker:

```powershell
# Detener TODOS los contenedores
docker stop $(docker ps -aq)

# Eliminar TODOS los contenedores
docker rm $(docker ps -aq)

# Eliminar TODAS las imágenes
docker rmi $(docker images -q)

# Eliminar TODOS los volúmenes
docker volume rm $(docker volume ls -q)

# Limpieza completa del sistema
docker system prune -a --volumes -f

# Reiniciar Docker Desktop
# (desde la interfaz gráfica: right-click → Restart)
```

Después de esto, descarga las imágenes de nuevo:

```powershell
docker pull mcr.microsoft.com/mssql/server:2022-latest
docker-compose -f docker-compose.windows-simple.yml up -d
```
