// src/auth/LoginScreen.jsx
// Full-screen gate shown when nobody is signed in. Sign-in is open — anyone
// with a Google account can enter; we only ask for identity afterwards.

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '@/theme/ThemeContext';
import { useAuth } from './AuthContext';
import LoginBackground from './LoginBackground';
import icesiLogo from '@/assets/icesi-logo.svg';

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
  </svg>
);

const LoginScreen = () => {
  const { theme } = useThemeMode();
  const { signInWithGoogle, authError } = useAuth();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: theme.background,
      }}
    >
      <LoginBackground />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 420,
          background: theme.backgroundLight,
          border: `1px solid ${theme.border}`,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Logo institucional sobre chip blanco para asegurar contraste */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            borderRadius: 2,
            px: 2.5,
            py: 1.5,
            mb: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
          }}
        >
          <img src={icesiLogo} alt="Universidad Icesi" style={{ height: 40, width: 'auto', display: 'block' }} />
        </Box>

        <Typography variant="h5" sx={{ color: theme.textPrimary, fontWeight: 700, mb: 1 }}>
          Inicia sesión para continuar
        </Typography>
        <Typography sx={{ color: theme.textSecondary, mb: 3, fontSize: '0.95rem' }}>
          Accede con tu cuenta de Google para entrar al contenido del curso.
        </Typography>

        <Button
          onClick={signInWithGoogle}
          fullWidth
          startIcon={<GoogleG />}
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            py: 1.2,
            color: '#3c4043',
            background: '#fff',
            border: '1px solid #dadce0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            '&:hover': { background: '#f7f8f8', borderColor: '#c9ccd1', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
          }}
        >
          Continuar con Google
        </Button>

        {authError && (
          <Typography sx={{ color: theme.error, mt: 2, fontSize: '0.85rem' }}>
            {authError}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoginScreen;
