// src/auth/LoginIllustration.jsx
//
// Decorative, full-bleed SVG mosaic for the login side panel — a tiled
// <pattern> of flat, bold-outline prototype/UI elements (phone mockups, form
// fields, buttons, checks, image placeholders). Purely ornamental; the motif
// is chosen per course in loginBranding.js. No external assets.

import React from 'react';
import Box from '@mui/material/Box';
import { useThemeMode } from '@/theme/ThemeContext';
import { loginBranding } from './loginBranding';

const INK = '#141821';
const PAPER = '#FFFFFF';
const PLACE = '#E9E6FB';
const PURPLE = '#4B49E6';
const CORAL = '#FF7A6B';
const GREEN = '#28C76F';

// One 300×300 tile packed with self-contained prototype widgets so it reads as
// UI design when repeated. Everything stays inside the tile so it tiles cleanly.
const MobileTile = () => (
  <g fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    {/* phone mock */}
    <rect x="24" y="24" width="86" height="122" rx="14" fill={PAPER} />
    <line x1="54" y1="36" x2="80" y2="36" strokeWidth="2.5" />
    <rect x="36" y="58" width="62" height="50" rx="4" fill={PLACE} strokeWidth="2" />
    <path d="M36 58 L98 108 M98 58 L36 108" strokeWidth="1.6" />
    <rect x="36" y="120" width="62" height="14" rx="4" strokeWidth="2" />

    {/* form card */}
    <rect x="150" y="24" width="126" height="122" rx="10" fill={PAPER} />
    <rect x="165" y="42" width="96" height="14" rx="4" strokeWidth="2" />
    <rect x="165" y="66" width="96" height="14" rx="4" strokeWidth="2" />
    <rect x="165" y="90" width="60" height="14" rx="4" strokeWidth="2" />
    <rect x="165" y="114" width="54" height="20" rx="6" fill={CORAL} strokeWidth="2.5" />

    {/* pill button + checkbox row */}
    <rect x="24" y="180" width="112" height="30" rx="15" fill={PURPLE} strokeWidth="3" />
    <rect x="24" y="228" width="30" height="30" rx="7" fill={PAPER} strokeWidth="3" />
    <path d="M31 243 L38 250 L48 236" stroke={GREEN} strokeWidth="4" />
    <rect x="64" y="236" width="72" height="12" rx="4" fill={PAPER} strokeWidth="2" />
    <rect x="64" y="254" width="48" height="10" rx="4" strokeWidth="2" />

    {/* media card with avatar row */}
    <rect x="150" y="168" width="126" height="108" rx="10" fill={PAPER} />
    <rect x="162" y="180" width="102" height="48" rx="5" fill={PLACE} strokeWidth="2" />
    <path d="M162 180 L264 228 M264 180 L162 228" strokeWidth="1.6" />
    <circle cx="176" cy="252" r="11" fill={CORAL} strokeWidth="2.5" />
    <rect x="196" y="244" width="66" height="9" rx="4" strokeWidth="2" />
    <rect x="196" y="259" width="44" height="9" rx="4" strokeWidth="2" />
  </g>
);

const NetworkTile = () => (
  <g fill="none" stroke={PAPER} strokeWidth="2.5" strokeLinecap="round">
    <line x1="60" y1="70" x2="170" y2="150" opacity="0.8" />
    <line x1="170" y1="150" x2="250" y2="60" opacity="0.8" />
    <line x1="170" y1="150" x2="120" y2="250" opacity="0.8" />
    <line x1="170" y1="150" x2="260" y2="240" opacity="0.8" />
    <circle cx="60" cy="70" r="12" fill={PURPLE} strokeWidth="3" />
    <circle cx="170" cy="150" r="20" fill={PURPLE} strokeWidth="3" />
    <circle cx="250" cy="60" r="14" fill={PURPLE} strokeWidth="3" />
    <circle cx="120" cy="250" r="14" fill={PURPLE} strokeWidth="3" />
    <circle cx="260" cy="240" r="12" fill={PURPLE} strokeWidth="3" />
  </g>
);

const GeometricTile = () => (
  <g fill="none" stroke={PAPER} strokeWidth="2.5">
    <circle cx="80" cy="80" r="42" />
    <rect x="180" y="40" width="80" height="80" rx="14" fill={PURPLE} strokeWidth="3" />
    <circle cx="220" cy="220" r="50" />
    <rect x="40" y="180" width="80" height="80" rx="14" strokeWidth="3" />
  </g>
);

const TILE = { mobile: <MobileTile />, network: <NetworkTile />, geometric: <GeometricTile /> };

const LoginIllustration = () => {
  const { theme } = useThemeMode();
  const tile = TILE[loginBranding.motif] || TILE.geometric;

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <defs>
          <pattern id="protoMosaic" width="300" height="300" patternUnits="userSpaceOnUse">
            {tile}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={theme.accent} />
        <rect width="100%" height="100%" fill="url(#protoMosaic)" opacity="0.9" />
      </svg>
    </Box>
  );
};

export default LoginIllustration;
