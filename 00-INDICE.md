# 📖 ÍNDICE DE DOCUMENTACIÓN - Sistema DICRI

**Proyecto:** Sistema de Gestión de Evidencias - DICRI  
**Desarrollador:** Rivaldo Alexander Tojín  
**Fecha:** 21 de noviembre de 2025  
**Repositorio:** https://github.com/rivalTj7/PruebaTecnicaDS

---

## 🎯 ¿POR DÓNDE EMPEZAR?

### 🔥 **URGENTE - Lee primero:**
1. **📄 [RESUMEN-EJECUTIVO.md](./RESUMEN-EJECUTIVO.md)** ⭐⭐⭐
   - Estado actual del proyecto
   - Checklist pre-entrevista
   - Comandos rápidos
   - **👉 EMPIEZA AQUÍ**

2. **📄 [TUS-PROXIMOS-PASOS.md](./TUS-PROXIMOS-PASOS.md)** ⭐⭐⭐
   - Guía práctica de deployment
   - Decisión: PostgreSQL vs Azure SQL
   - Pasos específicos para Railway
   - **👉 SI VAS A DESPLEGAR**

---

## 📚 DOCUMENTACIÓN POR CATEGORÍA

### 🚀 **Para la Entrevista**

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| [README.md](./README.md) | Documentación principal del proyecto | ⭐⭐⭐ |
| [MANUAL-TECNICO.md](./MANUAL-TECNICO.md) | Manual técnico con capturas de código (117KB) | ⭐⭐⭐ |
| [ENTREGABLES-CHECKLIST.md](./ENTREGABLES-CHECKLIST.md) | Checklist completo de entregables | ⭐⭐⭐ |
| [RESUMEN-EJECUTIVO.md](./RESUMEN-EJECUTIVO.md) | Resumen ejecutivo del estado | ⭐⭐⭐ |

### 🏗️ **Arquitectura y Diseño**

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| [ARQUITECTURA.md](./ARQUITECTURA.md) | Diagrama de arquitectura de 3 capas | ⭐⭐⭐ |
| [DIAGRAMA-ER.md](./DIAGRAMA-ER.md) | Modelo entidad-relación normalizado | ⭐⭐⭐ |
| [ROLES-Y-PERMISOS.md](./ROLES-Y-PERMISOS.md) | Matriz de roles y permisos (RBAC) | ⭐⭐ |

### 🚀 **Deployment en Railway**

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| [TUS-PROXIMOS-PASOS.md](./TUS-PROXIMOS-PASOS.md) | **LEE ESTE PRIMERO** - Guía práctica | ⭐⭐⭐ |
| [RAILWAY-QUICKSTART.md](./RAILWAY-QUICKSTART.md) | Guía rápida de Railway | ⭐⭐ |
| [RAILWAY-DEPLOYMENT-GUIDE.md](./RAILWAY-DEPLOYMENT-GUIDE.md) | Guía detallada paso a paso | ⭐⭐ |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guía original con Docker Compose | ⭐ |

### 🔧 **Setup y Troubleshooting**

| Archivo | Descripción | Cuándo usarlo |
|---------|-------------|---------------|
| [WINDOWS-WSL2-SETUP.md](./WINDOWS-WSL2-SETUP.md) | Configuración WSL2 en Windows | Si usas WSL2 |
| [MAC-ARM64-SETUP.md](./MAC-ARM64-SETUP.md) | Setup para Mac con chip M1/M2 | Si usas Mac ARM |
| [FIX-ARM64-ERROR.md](./FIX-ARM64-ERROR.md) | Solucionar errores ARM64 | Si tienes problemas |
| [troubleshoot-database.md](./troubleshoot-database.md) | Troubleshooting de base de datos | Si hay problemas con SQL Server |

### 📁 **Otros Documentos**

| Archivo | Descripción |
|---------|-------------|
| [RESUMEN-ROLES.txt](./RESUMEN-ROLES.txt) | Resumen de roles en texto plano |
| [README-OLD.md](./README-OLD.md) | Versión anterior del README (backup) |

---

## 🗂️ **Estructura de Carpetas**

```
PruebaTecnicaDS/
│
├── 📄 RESUMEN-EJECUTIVO.md          ⭐ EMPIEZA AQUÍ
├── 📄 TUS-PROXIMOS-PASOS.md         ⭐ Si vas a desplegar
├── 📄 README.md                     ⭐ Documentación principal
├── 📄 MANUAL-TECNICO.md             ⭐ Con capturas de código
├── 📄 ENTREGABLES-CHECKLIST.md      ⭐ Checklist completo
│
├── 📄 ARQUITECTURA.md               🏗️ Arquitectura
├── 📄 DIAGRAMA-ER.md                🏗️ Modelo de datos
├── 📄 ROLES-Y-PERMISOS.md           🏗️ RBAC
│
├── 📄 RAILWAY-QUICKSTART.md         🚀 Railway - Guía rápida
├── 📄 RAILWAY-DEPLOYMENT-GUIDE.md   🚀 Railway - Detallado
├── 📄 DEPLOYMENT.md                 🚀 Docker Compose
│
├── 📄 WINDOWS-WSL2-SETUP.md         🔧 Setup Windows
├── 📄 MAC-ARM64-SETUP.md            🔧 Setup Mac
├── 📄 troubleshoot-database.md      🔧 Troubleshooting
│
├── 📁 backend/                      💻 Código Backend
│   ├── src/
│   ├── package.json
│   └── railway.json
│
├── 📁 frontend/                     🎨 Código Frontend
│   ├── src/
│   ├── package.json
│   └── railway.json
│
├── 📁 database/                     🗄️ Scripts SQL
│   ├── schema.sql
│   ├── stored-procedures.sql
│   └── seed-data.sql
│
├── 📁 docs/                         📚 Documentación adicional
│   ├── arquitectura.md
│   ├── diagrama-er.md
│   └── manual-tecnico.md
│
├── 📁 .github/                      🔄 CI/CD
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml               🐳 Orquestación
├── railway.toml                     🚂 Config Railway
└── .railwayignore                   🚂 Ignore Railway
```

---

## 📋 **Guía Rápida de Uso**

### **Situación 1: Prepararse para la Entrevista**
```
1. Lee: RESUMEN-EJECUTIVO.md
2. Lee: ENTREGABLES-CHECKLIST.md
3. Revisa: MANUAL-TECNICO.md (capturas de código)
4. Prepara tu demo con Docker local
```

### **Situación 2: Desplegar a Railway**
```
1. Lee: TUS-PROXIMOS-PASOS.md (decisión PostgreSQL vs Azure)
2. Sigue: RAILWAY-QUICKSTART.md (pasos rápidos)
3. Si tienes dudas: RAILWAY-DEPLOYMENT-GUIDE.md (detallado)
```

### **Situación 3: Entender la Arquitectura**
```
1. Lee: ARQUITECTURA.md (diagrama de 3 capas)
2. Lee: DIAGRAMA-ER.md (modelo de datos)
3. Lee: ROLES-Y-PERMISOS.md (RBAC completo)
```

### **Situación 4: Problemas Técnicos**
```
1. Docker no funciona: troubleshoot-database.md
2. Mac con chip M1/M2: MAC-ARM64-SETUP.md
3. Windows con WSL2: WINDOWS-WSL2-SETUP.md
4. Errores ARM64: FIX-ARM64-ERROR.md
```

---

## 🎯 **Checklist de Lectura Pre-Entrevista**

### Obligatorio (30 min):
- [ ] RESUMEN-EJECUTIVO.md
- [ ] ENTREGABLES-CHECKLIST.md
- [ ] README.md (solo introducción y características)

### Recomendado (1 hora):
- [ ] MANUAL-TECNICO.md (revisar capturas de código)
- [ ] ARQUITECTURA.md (entender la arquitectura)
- [ ] ROLES-Y-PERMISOS.md (comprender el RBAC)

### Opcional (si tienes tiempo):
- [ ] DIAGRAMA-ER.md (modelo de datos detallado)
- [ ] TUS-PROXIMOS-PASOS.md (opciones de deployment)

---

## 🔑 **Información Clave Rápida**

### URLs del Proyecto:
- **Repositorio:** https://github.com/rivalTj7/PruebaTecnicaDS
- **Rama principal:** `main`
- **Frontend local:** http://localhost:3001
- **Backend local:** http://localhost:5001
- **Swagger:** http://localhost:5001/api-docs

### Usuarios de Prueba:
| Email | Password | Rol |
|-------|----------|-----|
| tecnico@mp.gob.gt | Password123! | Técnico |
| coordinador@mp.gob.gt | Password123! | Coordinador |
| admin@mp.gob.gt | Password123! | Administrador |

### Comandos Esenciales:
```bash
# Levantar sistema
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener sistema
docker-compose down
```

---

## 📊 **Métricas del Proyecto**

| Métrica | Valor |
|---------|-------|
| **Total líneas de código** | ~8,000 |
| **Archivos creados** | 56 |
| **Commits** | 20+ |
| **Documentos Markdown** | 15+ |
| **Tamaño total documentación** | ~200KB |
| **Tests implementados** | 2 archivos |
| **Días de desarrollo** | ~5 días |

---

## 💡 **Atajos Útiles**

### Ver solo documentación esencial:
```bash
# En la raíz del proyecto
ls -la *.md | grep -E "(RESUMEN|TUS-PROXIMOS|MANUAL|README)"
```

### Buscar algo específico en toda la documentación:
```bash
# En Windows PowerShell
Select-String -Path *.md -Pattern "Railway"

# En Linux/Mac
grep -r "Railway" *.md
```

---

## 🎓 **Notas Importantes**

1. **Para la entrevista:** El sistema funcionando en local es suficiente
2. **Railway es opcional:** Es un plus, no obligatorio
3. **PostgreSQL vs SQL Server:** Si despliegas, decide según costo/tiempo
4. **Documentación:** Está sobre-documentado intencionalmente
5. **CI/CD:** Ya funciona, cada push a `main` ejecuta tests

---

## 📞 **Configuración Recomendada de GitHub**

### Hacer `main` la rama por defecto:

1. Ve a: https://github.com/rivalTj7/PruebaTecnicaDS/settings
2. **Branches** (menú izquierdo)
3. Cambiar "Default branch" a `main`
4. Confirmar el cambio

---

## ✅ **Estado Actual del Proyecto**

- ✅ **Código:** Completo y funcional (100%)
- ✅ **Documentación:** Excelente (15+ archivos)
- ✅ **CI/CD:** Configurado y funcionando
- ✅ **Docker:** Funcionando localmente
- ✅ **Railway:** Configuración preparada
- ✅ **Git:** Rama `main` actualizada
- ✅ **Tests:** 2 archivos implementados
- ✅ **Listo para entrevista:** SÍ ✅

---

## 🎯 **Resumen en 3 Puntos**

1. **Lee:** RESUMEN-EJECUTIVO.md (10 min)
2. **Practica:** Demo local con Docker (15 min)
3. **Revisa:** MANUAL-TECNICO.md capturas (30 min)

**Total:** 1 hora de preparación = Listo para entrevista ✅

---

## 📧 **Contacto y Referencias**

- **Desarrollador:** Rivaldo Alexander Tojín
- **GitHub:** https://github.com/rivalTj7
- **Proyecto:** Sistema DICRI - Ministerio Público Guatemala
- **Fecha:** Noviembre 2024

---

**¡Éxito en tu entrevista! 🚀**

**Siguiente acción:** Lee [RESUMEN-EJECUTIVO.md](./RESUMEN-EJECUTIVO.md) 👈
