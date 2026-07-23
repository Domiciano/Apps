// components/LessonParagraph.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '@/theme/ThemeContext';

const LessonParagraph = ({ children }) => {
  const { theme } = useThemeMode();
  return (
    // component="div" — Markdown can nest block content (images, loose list
    // items) inside what was authored as a paragraph; the default <p> tag
    // can't legally contain that (browsers force-close it, breaking layout).
    <Typography
      component="div"
      sx={{
        color: theme.textPrimary,
        fontSize: { xs: '1rem', md: '1.1rem' },
        mb: 2,
        lineHeight: 1.7,
        fontFamily: 'Roboto, Arial, sans-serif',
      }}
    >
      {children}
    </Typography>
  );
};

export default LessonParagraph;
