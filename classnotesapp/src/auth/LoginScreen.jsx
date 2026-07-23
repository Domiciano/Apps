// src/auth/LoginScreen.jsx
// Full-screen gate shown when nobody is signed in. Sign-in is open — anyone
// with a Google account can enter; we only ask for identity afterwards.

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { useThemeMode } from '@/theme/ThemeContext';
import { useAuth } from './AuthContext';

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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: theme.background,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          background: theme.backgroundLight,
          border: `1px solid ${theme.border}`,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}
      >
        <Box
          sx={{
            width: 56, height: 56, mx: 'auto', mb: 2, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme.accent,
          }}
        >
          <SchoolRoundedIcon sx={{ color: theme.appBarText, fontSize: 30 }} />
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
          variant="outlined"
          startIcon={<GoogleG />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            py: 1.2,
            borderColor: theme.border,
            color: theme.textPrimary,
            background: '#fff',
            '&:hover': { borderColor: theme.accent, background: '#fff' },
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
