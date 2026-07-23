// src/auth/LoginScreen.jsx
// Two-panel login: a flat illustration panel (per-course motif) on the left,
// the sign-in form on the right. Sign-in is open — anyone with a Google
// account can enter; we only ask for identity afterwards.

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '@/theme/ThemeContext';
import { useAuth } from './AuthContext';
import LoginBackground from './LoginBackground';
import LoginIllustration from './LoginIllustration';
import { loginBranding } from './loginBranding';
import icesiLogo from '@/assets/icesi-logo.svg';

// Distinctive display face for the course title (loaded in index.html).
const DISPLAY_FONT = "'Space Grotesk', 'Segoe UI', sans-serif";
const INK = '#141821';

const GoogleG = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
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
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left — decorative prototype mosaic (hidden on small screens) */}
      <Box
        sx={{
          flex: '1.05',
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden',
          background: theme.accent,
          borderRight: `3px solid ${theme.border}`,
        }}
      >
        <LoginIllustration />
      </Box>

      {/* Right — sign-in panel */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          background: theme.background,
          overflow: 'hidden',
        }}
      >
        <LoginBackground />

        <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <img
            src={icesiLogo}
            alt="Universidad Icesi"
            style={{ height: 40, width: 'auto', display: 'block', margin: '0 auto 28px' }}
          />

          <Typography
            component="h1"
            sx={{
              fontFamily: DISPLAY_FONT,
              color: theme.textPrimary,
              fontWeight: 700,
              fontSize: { xs: '1.9rem', sm: '2.2rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            {loginBranding.courseName}
          </Typography>
          <Typography sx={{ color: theme.textSecondary, mb: 4, fontSize: '1rem' }}>
            Inicia sesión con tu cuenta de Google para entrar al contenido del curso.
          </Typography>

          <Button
            onClick={signInWithGoogle}
            fullWidth
            startIcon={
              <Box sx={{ display: 'flex', background: '#fff', borderRadius: '6px', p: '4px', border: `2px solid ${INK}` }}>
                <GoogleG />
              </Box>
            }
            disableRipple
            sx={{
              textTransform: 'none',
              fontFamily: DISPLAY_FONT,
              fontWeight: 600,
              fontSize: '1rem',
              py: 1.35,
              gap: 0.5,
              color: INK,
              background: '#fff',
              border: `2.5px solid ${INK}`,
              borderRadius: '14px',
              boxShadow: `5px 5px 0 ${theme.accent}`,
              transition: 'transform .12s ease, box-shadow .12s ease',
              '&:hover': {
                background: '#fff',
                transform: 'translate(2px, 2px)',
                boxShadow: `3px 3px 0 ${theme.accent}`,
              },
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
    </Box>
  );
};

export default LoginScreen;
