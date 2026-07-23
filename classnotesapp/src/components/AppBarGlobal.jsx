import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import { useThemeMode } from '@/theme/ThemeContext';
import AccountMenu from '@/auth/AccountMenu';
import techlogo from '@/assets/techlogo.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const AppBarGlobal = ({ onOpenMobileToc, onOpenMobileNav }) => {
  const { mode, toggleTheme, theme } = useThemeMode();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('lg'));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: theme.appBarBg,
        color: theme.appBarText,
        zIndex: 1300,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onOpenMobileNav} color="inherit" aria-label="Abrir menú de navegación" sx={{ mr: 1 }}>
              <MenuIcon sx={{ color: theme.accent }} />
            </IconButton>
          )}
          <img src={techlogo} alt="Logo" style={{ height: 36, width: 36 }} />
          <Typography
            variant="h6"
            sx={{
              color: theme.appBarText,
              fontWeight: 700,
              letterSpacing: isMobile ? '0.01em' : '0.04em',
              fontSize: isMobile ? '1rem' : '1.25rem',
              maxWidth: isMobile ? 120 : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isMobile ? 'Apps' : 'Aplicaciones Móviles'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleTheme} color="inherit" aria-label="Alternar modo claro/oscuro">
            {mode === 'dark' ? <LightModeIcon sx={{ color: theme.accent }} /> : <DarkModeIcon sx={{ color: theme.accent }} />}
          </IconButton>
          {isMobile && (
            <IconButton onClick={onOpenMobileToc} color="inherit" aria-label="Mostrar tabla de contenido">
              <MenuBookIcon sx={{ color: theme.accent }} />
            </IconButton>
          )}
          <AccountMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarGlobal; 