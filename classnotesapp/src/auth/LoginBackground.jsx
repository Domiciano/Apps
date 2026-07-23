// src/auth/LoginBackground.jsx
//
// Minimalist, theme-aware backdrop for the login / profile gate. The motif is
// chosen per course in loginBranding.js. Purely decorative: absolutely
// positioned, non-interactive, and drawn at low opacity so it never competes
// with the card on top.

import React from 'react';
import Box from '@mui/material/Box';
import { useThemeMode } from '@/theme/ThemeContext';
import { loginBranding } from './loginBranding';

// Rounded "app icon" grid — reads unmistakably as a phone home screen.
const AppGrid = ({ color }) => (
  <>
    <defs>
      <pattern id="appgrid" width="88" height="88" patternUnits="userSpaceOnUse">
        <rect x="20" y="20" width="48" height="48" rx="14" fill="none" stroke={color} strokeWidth="2" />
      </pattern>
    </defs>
    <rect width="1200" height="800" fill="url(#appgrid)" opacity="0.10" />
  </>
);

// A simple phone silhouette with a speaker slit and a home indicator.
const Phone = ({ x, y, color, rotate = 0, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity="0.16">
    <rect x="0" y="0" width="150" height="300" rx="26" fill="none" stroke={color} strokeWidth="3" />
    <line x1="58" y1="20" x2="92" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="280" x2="95" y2="280" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </g>
);

const Node = ({ x, y, r, color }) => (
  <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="2.5" opacity="0.18" />
);

const motifContent = (motif, color) => {
  switch (motif) {
    case 'mobile':
      return (
        <>
          <AppGrid color={color} />
          <Phone x={-40} y={470} color={color} rotate={-12} />
          <Phone x={1010} y={-70} color={color} rotate={14} scale={1.15} />
        </>
      );
    case 'network':
      return (
        <>
          <g stroke={color} strokeWidth="1.5" opacity="0.16">
            <line x1="140" y1="180" x2="420" y2="300" />
            <line x1="420" y1="300" x2="700" y2="160" />
            <line x1="420" y1="300" x2="560" y2="560" />
            <line x1="700" y1="160" x2="980" y2="320" />
            <line x1="560" y1="560" x2="900" y2="620" />
          </g>
          <Node x={140} y={180} r={10} color={color} />
          <Node x={420} y={300} r={16} color={color} />
          <Node x={700} y={160} r={12} color={color} />
          <Node x={560} y={560} r={14} color={color} />
          <Node x={980} y={320} r={10} color={color} />
          <Node x={900} y={620} r={12} color={color} />
        </>
      );
    default: // 'geometric'
      return (
        <>
          <defs>
            <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="2.5" fill={color} />
            </pattern>
          </defs>
          <rect width="1200" height="800" fill="url(#dots)" opacity="0.10" />
          <circle cx="1050" cy="120" r="120" fill="none" stroke={color} strokeWidth="2" opacity="0.12" />
          <circle cx="120" cy="680" r="90" fill="none" stroke={color} strokeWidth="2" opacity="0.12" />
        </>
      );
  }
};

const LoginBackground = () => {
  const { theme } = useThemeMode();

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        // Soft gradient wash behind the motif.
        background: `radial-gradient(1100px 620px at 78% -8%, ${theme.accent}22, transparent 60%),
                     radial-gradient(900px 560px at 12% 108%, ${theme.accent}18, transparent 60%)`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: 'block' }}
      >
        {motifContent(loginBranding.motif, theme.accent)}
      </svg>
    </Box>
  );
};

export default LoginBackground;
