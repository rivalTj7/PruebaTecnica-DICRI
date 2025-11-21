# Solución para Windows con WSL2

## Problema
Azure SQL Edge falla con el error: "Unable to create a new asynchronous I/O context. Please increase sysctl fs.aio-max-nr."

Este error ocurre porque el kernel de Linux en WSL2 tiene un límite muy bajo para operaciones asíncronas de I/O.

## Solución

### Opción 1: Aumentar parámetros del kernel WSL2 (Recomendado)

#### 1. Crear/Editar archivo .wslconfig

Abre PowerShell o CMD en Windows y ejecuta:

```powershell
# Navegar a tu directorio home de Windows
cd ~

# Crear o editar .wslconfig con notepad
notepad .wslconfig
```

#### 2. Agregar la siguiente configuración:

```ini
[wsl2]
# Aumentar memoria disponible para WSL2
memory=4GB

# Aumentar límites del kernel
kernelCommandLine = sysctl.fs.aio-max-nr=1048576
```

#### 3. Guardar el archivo y cerrar WSL2 completamente

```powershell
# En PowerShell (Windows), ejecutar:
wsl --shutdown

# Esperar 10 segundos
timeout /t 10

# Reiniciar WSL2 abriendo una nueva terminal Ubuntu/WSL
```

#### 4. Limpiar contenedores y volúmenes anteriores

```bash
# Desde WSL2/Ubuntu, en la carpeta del proyecto:
cd ~/PruebaTecnicaDS

# Detener y limpiar todo
docker-compose down -v

# Limpiar sistema Docker (opcional pero recomendado)
docker system prune -a --volumes -f
```

#### 5. Iniciar el sistema nuevamente

```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

#### 6. Verificar que funcione

```bash
# Esperar 1-2 minutos y verificar estado
docker-compose ps

# Deberías ver:
# dicri-database    Up (healthy)
# dicri-backend     Up
# dicri-frontend    Up
```

---

### Opción 2: Usar SQL Server regular en lugar de Azure SQL Edge

Si la Opción 1 no funciona, podemos cambiar a SQL Server estándar (que puede tener mejor compatibilidad con WSL2).

#### 1. Actualizar docker-compose.yml

Edita `docker-compose.yml` y cambia el servicio database:

```yaml
database:
  image: mcr.microsoft.com/mssql/server:2022-latest
  container_name: dicri-database
  # platform: linux/arm64  # QUITAR ESTA LÍNEA
  environment:
    - ACCEPT_EULA=Y
    - MSSQL_SA_PASSWORD=DicrI2024!Secure
    # Agregar estos parámetros para reducir uso de memoria
    - MSSQL_MEMORY_LIMIT_MB=2048
  ports:
    - "1433:1433"
  volumes:
    - sqlserver_data:/var/opt/mssql
    - ./database:/docker-entrypoint-initdb.d
  networks:
    - dicri-network
  healthcheck:
    test: ["CMD-SHELL", "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure -Q 'SELECT 1' -b -o /dev/null || exit 1"]
    interval: 15s
    timeout: 10s
    retries: 10
    start_period: 60s
```

#### 2. Limpiar y reiniciar

```bash
docker-compose down -v
docker-compose up -d
docker-compose logs -f
```

---

### Opción 3: Aumentar parámetros directamente en WSL2

Si .wslconfig no funciona, puedes configurar directamente en WSL2:

```bash
# Desde WSL2/Ubuntu:

# Ver valor actual
cat /proc/sys/fs/aio-max-nr

# Si necesitas aumentarlo (temporal, se pierde al reiniciar):
echo 1048576 | sudo tee /proc/sys/fs/aio-max-nr

# Hacer permanente (agregar a /etc/sysctl.conf):
echo "fs.aio-max-nr = 1048576" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Reiniciar Docker
sudo service docker restart

# Levantar servicios
cd ~/PruebaTecnicaDS
docker-compose down -v
docker-compose up -d
```

---

## Verificación Final

### 1. Verificar que los 3 contenedores estén corriendo

```bash
docker-compose ps
```

Deberías ver:

```
NAME                STATUS
dicri-database      Up (healthy)
dicri-backend       Up
dicri-frontend      Up
```

### 2. Verificar logs sin errores

```bash
# Ver logs de base de datos
docker-compose logs database | grep "ready for client connections"

# Deberías ver:
# SQL Server is now ready for client connections

# Ver logs de backend
docker-compose logs backend | grep "listening"

# Deberías ver:
# Server listening on port 5000
```

### 3. Probar conectividad

```bash
# Probar backend
curl http://localhost:5000/health

# Deberías ver:
# {"status":"ok"}

# Abrir en navegador
# http://localhost:3000
```

---

## Troubleshooting Adicional

### Si aún falla con fs.aio-max-nr:

1. **Verificar versión de WSL2:**
   ```powershell
   wsl --version
   ```
   Actualiza a la última versión si es necesario.

2. **Actualizar Docker Desktop:**
   - Asegúrate de tener Docker Desktop 4.x o superior
   - Settings → Resources → WSL Integration habilitado

3. **Verificar recursos asignados:**
   ```powershell
   # En PowerShell, ver memoria asignada a WSL2
   wsl -l -v
   ```

### Si la base de datos no inicia:

```bash
# Ver logs completos
docker-compose logs database

# Entrar al contenedor (si está corriendo)
docker-compose exec database /bin/bash

# Ver procesos
docker-compose exec database ps aux
```

### Si backend no se conecta:

```bash
# Verificar que la base de datos esté realmente lista
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure -Q "SELECT @@VERSION"

# Reiniciar solo backend
docker-compose restart backend
```

---

## Comandos Útiles para Windows/WSL2

```powershell
# En PowerShell (Windows):

# Ver estado de WSL2
wsl --status

# Listar distribuciones
wsl -l -v

# Apagar WSL2 completamente
wsl --shutdown

# Reiniciar distribución específica
wsl --terminate Ubuntu

# Ver uso de recursos
wsl --system
```

```bash
# En WSL2 (Ubuntu):

# Ver recursos del sistema
free -h
df -h

# Ver límites del kernel
sysctl -a | grep aio

# Monitorear Docker
docker stats

# Ver todos los contenedores (incluso detenidos)
docker ps -a
```

---

## Notas Importantes

1. **Memoria RAM**: SQL Server necesita al menos 2GB de RAM. Asegúrate de asignar suficiente memoria a WSL2 en `.wslconfig`.

2. **Disco**: Verifica que tengas al menos 10GB libres en el disco donde Docker almacena datos.

3. **Antivirus**: Algunos antivirus bloquean Docker. Agrega excepciones si es necesario.

4. **Firewall**: Asegúrate de que los puertos 1433, 3000 y 5000 no estén bloqueados.

---

## Credenciales de Prueba (una vez funcionando)

```
Técnico:
  Email: tecnico@mp.gob.gt
  Password: Password123!

Coordinador:
  Email: coordinador@mp.gob.gt
  Password: Password123!

Administrador:
  Email: admin@mp.gob.gt
  Password: Password123!
```

---

## URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

---

**Prueba primero la Opción 1, que es la más limpia. Si no funciona, prueba la Opción 2. ¡Todo debería funcionar después de aplicar estos cambios! 🚀**
