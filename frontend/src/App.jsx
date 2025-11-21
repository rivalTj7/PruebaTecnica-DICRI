import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expedientes from './pages/Expedientes';
import ExpedienteDetalle from './pages/ExpedienteDetalle';
import NuevoExpediente from './pages/NuevoExpediente';
import Aprobaciones from './pages/Aprobaciones';
import Reportes from './pages/Reportes';
import Perfil from './pages/Perfil';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="expedientes" element={<Expedientes />} />
        <Route path="expedientes/nuevo" element={<NuevoExpediente />} />
        <Route path="expedientes/:id" element={<ExpedienteDetalle />} />
        <Route
          path="aprobaciones"
          element={
            <PrivateRoute roles={['Coordinador', 'Administrador']}>
              <Aprobaciones />
            </PrivateRoute>
          }
        />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
