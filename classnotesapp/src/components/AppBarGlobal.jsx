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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '@/theme/ThemeContext';
import AccountMenu from '@/auth/AccountMenu';
import techlogo from '@/assets/techlogo.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useAnalytics } from '@/analytics/AnalyticsProvider';
import { EVENTS, THEME_MODE } from '@/analytics/events';

const AppBarGlobal = ({ onOpenMobileToc, onOpenMobileNav }) => {
  const { mode, toggleTheme, theme } = useThemeMode();
  const { track } = useAnalytics();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();

  // El evento se emite desde aquí y no desde ThemeContext porque el proveedor de
  // tema envuelve al de auth, y sin uid no hay a quién atribuir el evento.
  const handleToggleTheme = () => {
    track(EVENTS.THEME_TOGGLE, {
      to: mode === 'dark' ? THEME_MODE.LIGHT : THEME_MODE.DARK,
    });
    toggleTheme();
  };
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
          <Tooltip title="Agenda de presentaciones">
            {isMobile ? (
              <IconButton onClick={() => navigate('/agenda')} color="inherit" aria-label="Agenda de presentaciones">
                <EventAvailableIcon sx={{ color: theme.accent }} />
              </IconButton>
            ) : (
              <Button
                onClick={() => navigate('/agenda')}
                color="inherit"
                startIcon={<EventAvailableIcon sx={{ color: theme.accent }} />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Agenda
              </Button>
            )}
          </Tooltip>
          <IconButton onClick={handleToggleTheme} color="inherit" aria-label="Alternar modo claro/oscuro">
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