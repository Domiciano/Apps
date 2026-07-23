// src/auth/ProfileForm.jsx
// Shown right after Google sign-in when the student hasn't provided their
// identity yet. Requires full name + GitHub profile before granting access.

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useThemeMode } from '@/theme/ThemeContext';
import { useAuth } from './AuthContext';

// Accepts "usuario", "github.com/usuario" or "https://github.com/usuario"
// (with optional trailing slash) and returns the bare handle, or null.
const parseGithubHandle = (input) => {
  const raw = input.trim();
  if (!raw) return null;
  const urlMatch = raw.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s?#]+)/i);
  const handle = (urlMatch ? urlMatch[1] : raw).replace(/^@/, '');
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(handle) ? handle : null;
};

const ProfileForm = () => {
  const { theme } = useThemeMode();
  const { user, saveProfile, signOutUser } = useAuth();

  const [fullName, setFullName] = useState(user?.displayName ?? '');
  const [github, setGithub] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = 'Escribe tu nombre completo.';
    const handle = parseGithubHandle(github);
    if (!handle) nextErrors.github = 'Ingresa un usuario o URL de GitHub válido.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await saveProfile({
        fullName,
        github: `https://github.com/${handle}`,
      });
    } catch (err) {
      console.error('[Auth] Error guardando el perfil:', err);
      setErrors({ form: 'No se pudo guardar. Inténtalo de nuevo.' });
      setSubmitting(false);
    }
  };

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
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 460,
          background: theme.backgroundLight,
          border: `1px solid ${theme.border}`,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="h5" sx={{ color: theme.textPrimary, fontWeight: 700, mb: 0.5 }}>
          Completa tu perfil
        </Typography>
        <Typography sx={{ color: theme.textSecondary, mb: 3, fontSize: '0.95rem' }}>
          Necesitamos estos datos para darte acceso al contenido.
        </Typography>

        <TextField
          label="Nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
          fullWidth
          autoFocus
          sx={{ mb: 2.5 }}
        />
        <TextField
          label="Perfil de GitHub"
          placeholder="tu-usuario  o  https://github.com/tu-usuario"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          error={!!errors.github}
          helperText={errors.github || 'Usuario o URL completa de tu perfil.'}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={submitting}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            py: 1.2,
            background: theme.accent,
            '&:hover': { background: theme.accent, filter: 'brightness(0.94)' },
          }}
        >
          {submitting ? 'Guardando…' : 'Entrar al curso'}
        </Button>

        {errors.form && (
          <Typography sx={{ color: theme.error, mt: 2, fontSize: '0.85rem' }}>
            {errors.form}
          </Typography>
        )}

        <Typography sx={{ color: theme.textSecondary, mt: 3, fontSize: '0.8rem', textAlign: 'center' }}>
          Conectado como {user?.email}.{' '}
          <Link component="button" type="button" onClick={signOutUser} sx={{ color: theme.accent }}>
            Cambiar de cuenta
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileForm;
