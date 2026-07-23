import React from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import { useThemeMode } from '@/theme/ThemeContext';

const Link = ({ displayname, url }) => {
  const { theme } = useThemeMode();
  return (
    // display: inline-flex (not a wrapping <div>) so this stays valid nested
    // inside a <p> — standard Markdown links are almost always inline text.
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: theme.accent,
        textDecoration: 'none',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        position: 'relative',
        transition: 'color 0.2s',
      }}
      onMouseOver={e => (e.currentTarget.style.color = theme.contentTitle)}
      onMouseOut={e => (e.currentTarget.style.color = theme.accent)}
    >
      <span style={{lineHeight: 1}}>{displayname}</span>
      <LaunchIcon sx={{ fontSize: '1.1em', marginLeft: 0.5, verticalAlign: 'middle' }} />
    </a>
  );
};

export default Link; 