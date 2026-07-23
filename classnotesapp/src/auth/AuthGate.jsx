// src/auth/AuthGate.jsx
// Switches the whole app on the auth `status`: it renders the children
// (the real app) only once the student is signed in with a complete profile.
// When Firebase isn't configured, status is 'ready' from the start → ungated.

import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useThemeMode } from '@/theme/ThemeContext';
import { useAuth } from './AuthContext';
import LoginScreen from './LoginScreen';
import ProfileForm from './ProfileForm';

const AuthGate = ({ children }) => {
  const { status } = useAuth();
  const { theme } = useThemeMode();

  if (status === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.background }}>
        <CircularProgress sx={{ color: theme.accent }} />
      </Box>
    );
  }
  if (status === 'signed-out') return <LoginScreen />;
  if (status === 'need-profile') return <ProfileForm />;
  return children;
};

export default AuthGate;
