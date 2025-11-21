# Solución para Mac Apple Silicon (M1/M2/M3)

## Problema
SQL Server no tiene soporte nativo para arquitectura ARM64 (Apple Silicon).

## Solución Implementada
Hemos actualizado `docker-compose.yml` para usar **Azure SQL Edge**, que es 100% compatible con SQL Server y tiene soporte nativo para ARM64.

### Cambios realizados:
1. ✅ Cambiado de `mssql/server:2022-latest` a `azure-sql-edge:latest`
2. ✅ Agregado `platform: linux/arm64` a todos los servicios
3. ✅ Ajustado tiempos de espera para mejor estabilidad

## Instrucciones

### 1. Detener y limpiar contenedores existentes

```bash
# Detener todos los contenedores
docker-compose down -v

# Verificar que no haya contenedores corriendo
docker ps -a

# Opcional: Limpiar todo (si hay problemas)
docker system prune -a --volumes
```

### 2. Iniciar el sistema actualizado

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### 3. Verificar que todo esté funcionando

```bash
# Ver estado de contenedores
docker-compose ps

# Deberías ver algo como:
# NAME                 STATUS
# dicri-database       Up (healthy)
# dicri-backend        Up
# dicri-frontend       Up
```

### 4. Esperar inicialización (importante)

El primer inicio puede tomar 1-2 minutos:
- **30-60 segundos**: Base de datos inicializando
- **20-30 segundos**: Migraciones ejecutándose
- **10-20 segundos**: Backend y frontend iniciando

### 5. Acceder a la aplicación

Una vez que todos los servicios estén "Up (healthy)":

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs

### Credenciales de Prueba

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

## Diferencias entre SQL Server y Azure SQL Edge

Azure SQL Edge es prácticamente idéntico a SQL Server, con las siguientes características:
- ✅ Misma sintaxis T-SQL
- ✅ Stored procedures funcionan igual
- ✅ Mismo driver (mssql para Node.js)
- ✅ Puerto 1433
- ✅ Mismas herramientas de gestión

**Para la prueba técnica no hay ninguna diferencia funcional.**

## Troubleshooting

### Si el backend no se conecta:

```bash
# Ver logs del backend
docker-compose logs backend

# Ver logs de la base de datos
docker-compose logs database

# Reiniciar el backend
docker-compose restart backend
```

### Si la base de datos no inicia:

```bash
# Verificar logs
docker-compose logs database

# Reintentar desde cero
docker-compose down -v
docker-compose up -d
```

### Si el frontend no carga:

```bash
# Ver logs
docker-compose logs frontend

# Verificar que el backend esté corriendo
curl http://localhost:5000/health
```

## Comandos Útiles

```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f database
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar un servicio
docker-compose restart database

# Entrar a un contenedor
docker-compose exec backend sh
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DicrI2024!Secure

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (reinicio completo)
docker-compose down -v
```

## Nota para la Presentación

En tu presentación puedes mencionar:
- "Se adaptó el proyecto para funcionar en Mac Apple Silicon"
- "Se usó Azure SQL Edge que es 100% compatible con SQL Server"
- "El código y funcionalidad son idénticos"
- "En producción se puede usar SQL Server regular en servidores x86_64"

---

**Todo debería funcionar perfectamente ahora! 🚀**
