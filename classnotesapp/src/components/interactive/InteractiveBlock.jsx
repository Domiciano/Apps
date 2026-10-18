// src/components/interactive/InteractiveBlock.jsx
import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '@/theme/ThemeContext';
import { SIMS, parseSpec } from '@/components/interactive/flutterStateSims';

// ```interactive fences: the first word names the simulator, the rest are its options.
// Simulators are plain DOM (shared with the session decks), so React only hands them a node.
const InteractiveBlock = ({ spec }) => {
  const { theme } = useThemeMode();
  const containerRef = useRef(null);
  const { name, args } = parseSpec(spec);
  const mount = SIMS[name];
  const argsKey = args.join(' ');

  useEffect(() => {
    if (!mount || !containerRef.current) return undefined;
    return mount(containerRef.current, argsKey ? argsKey.split(' ') : []);
  }, [mount, argsKey]);

  if (!mount) {
    return (
      <Box sx={{ my: '12px', p: 2, border: `1px dashed ${theme.textSecondary}`, borderRadius: 2 }}>
        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
          Diagrama interactivo desconocido: «{name || 'sin nombre'}».
        </Typography>
      </Box>
    );
  }

  return <Box ref={containerRef} sx={{ my: '12px' }} data-interactive={name} />;
};

export default InteractiveBlock;
