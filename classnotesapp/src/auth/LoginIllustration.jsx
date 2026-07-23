// src/auth/LoginIllustration.jsx
//
// Flat, bold-outline illustration for the login side panel. The 'mobile' motif
// is a UI-design flow (wireframe → prototype → form with a checkmark), fitting
// a front-end / mobile-apps course. Chosen per course in loginBranding.js.
// Pure SVG, no external assets.

import React from 'react';
import Box from '@mui/material/Box';
import { loginBranding } from './loginBranding';

const INK = '#141821';
const PAPER = '#FFFFFF';
const LAV = '#CFC9F7';
const PURPLE = '#4B49E6';
const CORAL = '#FF7A6B';
const GREEN = '#28C76F';

const MobileFlow = () => (
  <g fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
    {/* Device A — wireframe */}
    <rect x="70" y="96" width="250" height="384" rx="26" fill={PAPER} />
    <rect x="256" y="126" width="36" height="36" rx="7" fill={PAPER} strokeWidth="3.5" />
    <path d="M258 128 L290 160 M290 128 L258 160" strokeWidth="3" />
    <rect x="104" y="188" width="182" height="150" rx="6" strokeWidth="3.5" />
    <path d="M104 188 L286 338 M286 188 L104 338" strokeWidth="3" />
    <rect x="104" y="366" width="182" height="44" rx="9" strokeWidth="3.5" />

    {/* Device B — prototype */}
    <rect x="372" y="76" width="256" height="404" rx="30" fill={LAV} />
    <path d="M548 106 H588 M548 118 H588 M548 130 H588" stroke={PURPLE} strokeWidth="4" />
    {/* bowtie banner */}
    <polygon points="420,188 500,258 420,328" fill={PAPER} strokeWidth="3.5" />
    <polygon points="580,188 500,258 580,328" fill={PAPER} strokeWidth="3.5" />
    {/* flower */}
    <g strokeWidth="3">
      <circle cx="500" cy="238" r="18" fill={CORAL} />
      <circle cx="478" cy="258" r="18" fill={CORAL} />
      <circle cx="522" cy="258" r="18" fill={CORAL} />
      <circle cx="490" cy="278" r="18" fill={CORAL} />
      <circle cx="510" cy="278" r="18" fill={CORAL} />
      <circle cx="500" cy="258" r="11" fill={PAPER} />
    </g>
    <rect x="493" y="292" width="14" height="40" rx="6" fill={PURPLE} strokeWidth="3" />
    {/* primary button + connector node */}
    <rect x="412" y="418" width="176" height="40" rx="10" fill={PURPLE} strokeWidth="3.5" />
    <circle cx="600" cy="438" r="7" fill={PAPER} strokeWidth="3" />

    {/* Flow arrow B → C */}
    <path d="M607 438 C 668 438 668 262 736 262" strokeWidth="3.5" />
    <path d="M726 250 L742 262 L726 274" strokeWidth="3.5" />

    {/* Device C — form */}
    <rect x="742" y="96" width="286" height="360" rx="26" fill={LAV} />
    <path d="M986 122 L1006 142 M1006 122 L986 142" stroke={PURPLE} strokeWidth="4" />
    <rect x="782" y="176" width="206" height="40" rx="8" fill={PAPER} strokeWidth="3.5" />
    <rect x="782" y="230" width="206" height="40" rx="8" fill={PAPER} strokeWidth="3.5" />
    <rect x="782" y="284" width="128" height="40" rx="8" fill={PAPER} strokeWidth="3.5" />
    {/* check badge */}
    <rect x="912" y="352" width="120" height="120" rx="18" fill={PAPER} />
    <path d="M948 412 L972 436 L1000 392" stroke={GREEN} strokeWidth="9" />
  </g>
);

const NetworkArt = () => (
  <g fill="none" stroke={PAPER} strokeWidth="4" strokeLinecap="round">
    <g strokeWidth="2.5" opacity="0.85">
      <line x1="200" y1="180" x2="500" y2="300" />
      <line x1="500" y1="300" x2="820" y2="170" />
      <line x1="500" y1="300" x2="620" y2="520" />
      <line x1="820" y1="170" x2="900" y2="420" />
    </g>
    {[[200, 180, 16], [500, 300, 26], [820, 170, 20], [620, 520, 22], [900, 420, 16]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={PURPLE} strokeWidth="3.5" />
    ))}
  </g>
);

const GeometricArt = () => (
  <g fill="none" stroke={PAPER} strokeWidth="3">
    <circle cx="360" cy="270" r="130" />
    <circle cx="700" cy="360" r="90" fill={PURPLE} strokeWidth="4" />
    <rect x="560" y="120" width="120" height="120" rx="20" strokeWidth="4" />
  </g>
);

const LoginIllustration = () => {
  const art =
    loginBranding.motif === 'mobile' ? <MobileFlow /> :
    loginBranding.motif === 'network' ? <NetworkArt /> :
    <GeometricArt />;

  return (
    <Box sx={{ width: '100%', maxWidth: 560 }}>
      <svg width="100%" viewBox="0 0 1080 560" role="img" aria-label="Ilustración del curso" style={{ display: 'block' }}>
        {art}
      </svg>
    </Box>
  );
};

export default LoginIllustration;
