import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useThemeMode } from '@/theme/ThemeContext';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// SPEC-08 P4: use the context hook directly instead of window.useStudiedLessons
import { useStudiedLessons } from '@/theme/StudiedLessonsContext';

const createSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

const TableOfContents = ({ subtitles = [], lessonTitle, activeSection = '', lessonId }) => {
  const { theme } = useThemeMode();
  const { studiedLessons, toggleStudied } = useStudiedLessons();
  const isStudied = lessonId != null && studiedLessons.includes(String(lessonId));

  const scrollToSubtitle = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.offsetTop - offset, behavior: 'smooth' });
      const subtitle = subtitles.find(sub => sub.id === id);
      if (subtitle) {
        window.history.replaceState(null, null, `#${createSlug(subtitle.text)}`);
      }
    }
  };

  if (subtitles.length === 0) return null;

  return (
    <Box
      sx={{
        width: '100%',
        position: 'sticky',
        top: { xs: '56px', sm: '64px' },
        pt: 2,
        background: { lg: theme.background, xs: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', pt: 2, pb: 2 }}>
        {lessonId != null && (
          <IconButton
            onClick={() => toggleStudied(String(lessonId))}
            sx={{ mt: 0.5, p: 0 }}
            aria-label={isStudied ? 'Marcar como no completado' : 'Marcar como completado'}
          >
            {isStudied
              ? <CheckCircleIcon sx={{ color: theme.accent }} fontSize="small" />
              : <CheckCircleOutlineIcon sx={{ color: theme.accent }} fontSize="small" />}
          </IconButton>
        )}
        <Typography
          variant="h6"
          sx={{
            ml: 1,
            color: theme.textPrimary,
            fontWeight: 700,
            fontSize: '1.1rem',
            textTransform: 'none',
            letterSpacing: '0.01em',
          }}
        >
          {lessonTitle}
        </Typography>
      </Box>
      <List dense sx={{ p: 0 }}>
        {subtitles.map((subtitle) => (
          <ListItem key={subtitle.id} sx={{ p: 0, mb: 0.5 }}>
            <ListItemButton
              onClick={() => scrollToSubtitle(subtitle.id)}
              sx={{
                borderRadius: 1,
                py: 0.5,
                px: 1,
                backgroundColor: activeSection === subtitle.id
                  ? 'rgba(66, 165, 245, 0.15)'
                  : 'transparent',
                border: activeSection === subtitle.id
                  ? `1px solid ${theme.accent}`
                  : '1px solid transparent',
                '&:hover': {
                  backgroundColor: activeSection === subtitle.id
                    ? 'rgba(66, 165, 245, 0.22)'
                    : 'rgba(66, 165, 245, 0.08)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: activeSection === subtitle.id ? theme.primaryTitle : theme.textSecondary,
                      fontSize: '0.875rem',
                      fontWeight: activeSection === subtitle.id ? 600 : 400,
                      lineHeight: 1.3,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {subtitle.text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TableOfContents;
