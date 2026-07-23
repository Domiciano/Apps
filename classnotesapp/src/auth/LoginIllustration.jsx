// src/auth/LoginIllustration.jsx
//
// Decorative, full-bleed SVG mosaic for the login side panel. The 'mobile'
// motif tiles a low-fidelity prototype flow — distinct wireframe screens joined
// by arrows — and the whole pattern is slightly rotated. Purely ornamental;
// the motif is chosen per course in loginBranding.js. No external assets.

import React from 'react';
import Box from '@mui/material/Box';
import { useThemeMode } from '@/theme/ThemeContext';
import { loginBranding } from './loginBranding';

const LINE = '#FFFFFF';
const PURPLE = '#4B49E6';

// 360×280 tile. The flow runs along y=140 and is drawn so the arrow leaving the
// right edge meets the arrow entering the next tile's left edge → a continuous
// wireframe flow when repeated. Two different screens: a list and a detail view.
const MobileTile = () => (
  <g fill="none" stroke={LINE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {/* connecting arrows along the flow */}
    <g strokeWidth="2.5" opacity="0.9">
      <line x1="0" y1="140" x2="30" y2="140" />
      <path d="M22 134 L30 140 L22 146" />
      <line x1="150" y1="140" x2="230" y2="140" />
      <path d="M222 134 L230 140 L222 146" />
      <line x1="350" y1="140" x2="360" y2="140" />
    </g>

    {/* Screen A — list view */}
    <rect x="30" y="40" width="120" height="200" rx="16" fill={LINE} fillOpacity="0.06" />
    <rect x="44" y="54" width="92" height="16" rx="4" strokeWidth="2" />
    <g strokeWidth="2">
      <rect x="44" y="84" width="18" height="18" rx="4" />
      <line x1="70" y1="93" x2="136" y2="93" />
      <rect x="44" y="112" width="18" height="18" rx="4" />
      <line x1="70" y1="121" x2="136" y2="121" />
      <rect x="44" y="140" width="18" height="18" rx="4" />
      <line x1="70" y1="149" x2="120" y2="149" />
    </g>
    <rect x="44" y="206" width="92" height="20" rx="6" strokeWidth="2" />

    {/* Screen B — detail view */}
    <rect x="230" y="40" width="120" height="200" rx="16" fill={LINE} fillOpacity="0.06" />
    <rect x="244" y="54" width="92" height="14" rx="4" strokeWidth="2" />
    <rect x="244" y="80" width="92" height="66" rx="4" strokeWidth="2" />
    <path d="M244 80 L336 146 M336 80 L244 146" strokeWidth="1.6" />
    <line x1="244" y1="162" x2="336" y2="162" strokeWidth="2" />
    <line x1="244" y1="176" x2="300" y2="176" strokeWidth="2" />
    <rect x="244" y="196" width="92" height="24" rx="12" strokeWidth="2.5" />
  </g>
);

const NetworkTile = () => (
  <g fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round">
    <g opacity="0.85">
      <line x1="60" y1="70" x2="170" y2="150" />
      <line x1="170" y1="150" x2="250" y2="60" />
      <line x1="170" y1="150" x2="120" y2="250" />
      <line x1="170" y1="150" x2="260" y2="240" />
    </g>
    {[[60, 70, 12], [170, 150, 20], [250, 60, 14], [120, 250, 14], [260, 240, 12]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={PURPLE} strokeWidth="3" />
    ))}
  </g>
);

const GeometricTile = () => (
  <g fill="none" stroke={LINE} strokeWidth="2.5">
    <circle cx="80" cy="80" r="42" />
    <rect x="180" y="40" width="80" height="80" rx="14" fill={PURPLE} strokeWidth="3" />
    <circle cx="220" cy="220" r="50" />
    <rect x="40" y="180" width="80" height="80" rx="14" strokeWidth="3" />
  </g>
);

const TILES = {
  mobile: { w: 360, h: 280, node: <MobileTile /> },
  network: { w: 300, h: 300, node: <NetworkTile /> },
  geometric: { w: 300, h: 300, node: <GeometricTile /> },
};

const LoginIllustration = () => {
  const { theme } = useThemeMode();
  const { w, h, node } = TILES[loginBranding.motif] || TILES.geometric;

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <defs>
          {/* slight tilt so the flow reads as a hand-laid prototype board */}
          <pattern id="protoMosaic" width={w} height={h} patternUnits="userSpaceOnUse" patternTransform="rotate(-9)">
            {node}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={theme.accent} />
        <rect width="100%" height="100%" fill="url(#protoMosaic)" opacity="0.92" />
      </svg>
    </Box>
  );
};

export default LoginIllustration;
