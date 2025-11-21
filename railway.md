# Railway Configuration

Este es un proyecto monorepo con dos servicios:

## Servicios

### Backend (Node.js API)
- **Root Directory**: `backend/`
- **Build Command**: `npm ci`
- **Start Command**: `npm run migrate && npm start`
- **Port**: 5000
- **Environment Variables**: Ver `backend/.env.railway`

### Frontend (Vite/React)
- **Root Directory**: `frontend/`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Port**: 3000
- **Environment Variables**: Ver `frontend/.env.railway`

## Setup en Railway

1. Crea dos servicios separados:
   - Backend service apuntando a `backend/`
   - Frontend service apuntando a `frontend/`

2. Agrega SQL Server database

3. Configura variables de entorno según templates

Ver guía completa: RAILWAY-SETUP.md
