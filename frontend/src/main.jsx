import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Tema profesional para el Ministerio Público de Guatemala
const theme = createTheme({
  palette: {
    primary: {
      main: '#003D82', // Azul gubernamental de Guatemala
      dark: '#002952',
      light: '#336ba3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B0000', // Rojo institucional
      dark: '#5f0000',
      light: '#b33333',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 61, 130, 0.05)',
    '0px 4px 8px rgba(0, 61, 130, 0.08)',
    '0px 8px 16px rgba(0, 61, 130, 0.1)',
    '0px 12px 24px rgba(0, 61, 130, 0.12)',
    '0px 16px 32px rgba(0, 61, 130, 0.14)',
    '0px 20px 40px rgba(0, 61, 130, 0.16)',
    '0px 24px 48px rgba(0, 61, 130, 0.18)',
    '0px 28px 56px rgba(0, 61, 130, 0.2)',
    '0px 32px 64px rgba(0, 61, 130, 0.22)',
    '0px 36px 72px rgba(0, 61, 130, 0.24)',
    '0px 40px 80px rgba(0, 61, 130, 0.26)',
    '0px 44px 88px rgba(0, 61, 130, 0.28)',
    '0px 48px 96px rgba(0, 61, 130, 0.3)',
    '0px 52px 104px rgba(0, 61, 130, 0.32)',
    '0px 56px 112px rgba(0, 61, 130, 0.34)',
    '0px 60px 120px rgba(0, 61, 130, 0.36)',
    '0px 64px 128px rgba(0, 61, 130, 0.38)',
    '0px 68px 136px rgba(0, 61, 130, 0.4)',
    '0px 72px 144px rgba(0, 61, 130, 0.42)',
    '0px 76px 152px rgba(0, 61, 130, 0.44)',
    '0px 80px 160px rgba(0, 61, 130, 0.46)',
    '0px 84px 168px rgba(0, 61, 130, 0.48)',
    '0px 88px 176px rgba(0, 61, 130, 0.5)',
    '0px 92px 184px rgba(0, 61, 130, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 61, 130, 0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0px 2px 8px rgba(0, 61, 130, 0.12)',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 61, 130, 0.08)',
          borderRadius: 16,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 61, 130, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 61, 130, 0.06)',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 61, 130, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0, 61, 130, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 16px rgba(0, 61, 130, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0px 0px 0px 3px rgba(0, 61, 130, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0px 0px 0px 3px rgba(0, 61, 130, 0.1)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#f8f9fa',
          color: '#003D82',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 61, 130, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 61, 130, 0.08)',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
