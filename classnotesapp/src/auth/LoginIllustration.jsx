// src/auth/LoginIllustration.jsx
//
// Decorative, full-bleed backdrop for the login side panel. The 'mobile' motif
// is a procedurally-generated, deliberately messy low-fidelity prototype board:
// wireframe screens scattered at random positions / sizes / tilts, drawn with a
// hand-shaky stroke and joined by wobbly arrows. Seeded, so it's stable across
// renders. Purely ornamental; motif chosen per course in loginBranding.js.

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { useThemeMode } from '@/theme/ThemeContext';
import { loginBranding } from './loginBranding';

const LINE = '#FFFFFF';
const PURPLE = '#C9C2F7';
const VBW = 1400;
const VBH = 1000;
const CELL = 300;

// Small deterministic PRNG so the "random" layout never changes between renders.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const j = (r, amt) => (r() * 2 - 1) * amt;

// A wonky rectangle: perimeter sampled at 8 points, each nudged off-true.
function roughRect(r, cx, cy, w, h, amt) {
  const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2;
  const p = (x, y) => `${(x + j(r, amt)).toFixed(1)} ${(y + j(r, amt)).toFixed(1)}`;
  return `M ${p(x0, y0)} L ${p((x0 + x1) / 2, y0)} L ${p(x1, y0)} L ${p(x1, (y0 + y1) / 2)} ` +
         `L ${p(x1, y1)} L ${p((x0 + x1) / 2, y1)} L ${p(x0, y1)} L ${p(x0, (y0 + y1) / 2)} Z`;
}

// A not-quite-straight line (quadratic with a jittered midpoint).
function roughLine(r, x1, y1, x2, y2, amt) {
  const mx = (x1 + x2) / 2 + j(r, amt), my = (y1 + y2) / 2 + j(r, amt);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function buildScene(seed) {
  const r = mulberry32(seed);
  const cols = Math.ceil(VBW / CELL), rows = Math.ceil(VBH / CELL);
  const cells = {}, screens = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (r() < 0.25) continue; // uneven gaps
      const w = 84 + Math.round(r() * 42);
      const h = Math.round(w * (1.5 + r() * 0.5));
      const cx = col * CELL + CELL * 0.5 + j(r, 78);
      const cy = row * CELL + CELL * 0.5 + j(r, 78);
      const rot = j(r, 16);
      const kind = Math.floor(r() * 3);
      const s = { row, col, cx, cy, w, h, rot, kind, seed: Math.floor(r() * 1e9) };
      cells[`${row}-${col}`] = s;
      screens.push(s);
    }
  }
  const arrows = [];
  for (const s of screens) {
    const right = cells[`${s.row}-${s.col + 1}`];
    if (right && r() < 0.7) arrows.push({ a: s, b: right, seed: Math.floor(r() * 1e9) });
    const down = cells[`${s.row + 1}-${s.col}`];
    if (down && r() < 0.4) arrows.push({ a: s, b: down, seed: Math.floor(r() * 1e9) });
  }
  return { screens, arrows };
}

function Screen({ s }) {
  const r = mulberry32(s.seed);
  const hw = s.w / 2, hh = s.h / 2, pad = 12;
  const parts = [];
  parts.push(<path key="frame" d={roughRect(r, 0, 0, s.w, s.h, 2.6)} strokeWidth="3" fill={LINE} fillOpacity="0.05" />);
  parts.push(<path key="hdr" d={roughLine(r, -hw + pad, -hh + 20, hw - pad, -hh + 20, 2.5)} strokeWidth="3" />);

  if (s.kind === 0) { // detail
    const iy = -hh + 20 + (s.h - 40) * 0.28;
    parts.push(<path key="img" d={roughRect(r, 0, iy, s.w - 2 * pad, s.h * 0.34, 2.2)} strokeWidth="2.4" />);
    parts.push(<path key="x1" d={roughLine(r, -hw + pad, iy - s.h * 0.17, hw - pad, iy + s.h * 0.17, 2)} strokeWidth="1.6" />);
    parts.push(<path key="x2" d={roughLine(r, hw - pad, iy - s.h * 0.17, -hw + pad, iy + s.h * 0.17, 2)} strokeWidth="1.6" />);
    parts.push(<path key="l1" d={roughLine(r, -hw + pad, hh - 44, hw - pad, hh - 44, 2)} strokeWidth="2.4" />);
    parts.push(<path key="l2" d={roughLine(r, -hw + pad, hh - 32, hw * 0.3, hh - 32, 2)} strokeWidth="2.4" />);
    parts.push(<path key="btn" d={roughRect(r, 0, hh - 16, s.w - 2 * pad, 14, 2)} strokeWidth="2.4" fill={PURPLE} fillOpacity="0.25" />);
  } else if (s.kind === 1) { // list
    for (let i = 0; i < 3; i++) {
      const ry = -hh + 46 + i * ((s.h - 60) / 3);
      parts.push(<path key={`sq${i}`} d={roughRect(r, -hw + pad + 8, ry, 16, 16, 1.8)} strokeWidth="2.2" />);
      parts.push(<path key={`ln${i}`} d={roughLine(r, -hw + pad + 26, ry, hw - pad, ry, 2)} strokeWidth="2.2" />);
    }
    parts.push(<path key="nav" d={roughRect(r, 0, hh - 16, s.w - 2 * pad, 16, 2)} strokeWidth="2.2" />);
  } else { // form
    for (let i = 0; i < 3; i++) {
      const fy = -hh + 46 + i * 24;
      parts.push(<path key={`in${i}`} d={roughRect(r, 0, fy, s.w - 2 * pad, 14, 2)} strokeWidth="2.2" />);
    }
    parts.push(<path key="fbtn" d={roughRect(r, 0, hh - 24, s.w * 0.55, 16, 2)} strokeWidth="2.4" fill={PURPLE} fillOpacity="0.25" />);
  }

  return (
    <g transform={`translate(${s.cx} ${s.cy}) rotate(${s.rot})`} fill="none" stroke={LINE} strokeLinecap="round" strokeLinejoin="round">
      {parts}
    </g>
  );
}

function Arrow({ a, b, seed }) {
  const r = mulberry32(seed);
  const dx = b.cx - a.cx, dy = b.cy - a.cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const sx = a.cx + ux * (a.w / 2 + 10), sy = a.cy + uy * (a.h / 2 + 10);
  const ex = b.cx - ux * (b.w / 2 + 14), ey = b.cy - uy * (b.h / 2 + 14);
  // perpendicular bow for a curved, imperfect arc
  const bow = j(r, 46) + 22;
  const mx = (sx + ex) / 2 - uy * bow, my = (sy + ey) / 2 + ux * bow;
  const path = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  // arrowhead from tangent (control → end)
  const ang = Math.atan2(ey - my, ex - mx);
  const hl = 11;
  const h1x = ex - hl * Math.cos(ang - 0.5), h1y = ey - hl * Math.sin(ang - 0.5);
  const h2x = ex - hl * Math.cos(ang + 0.5), h2y = ey - hl * Math.sin(ang + 0.5);
  return (
    <g fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" opacity="0.8">
      <path d={path} />
      <path d={`M ${h1x.toFixed(1)} ${h1y.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)} L ${h2x.toFixed(1)} ${h2y.toFixed(1)}`} />
    </g>
  );
}

const LoginIllustration = () => {
  const { theme } = useThemeMode();
  const scene = useMemo(() => buildScene(20250723), []);
  const isMobile = loginBranding.motif === 'mobile';

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <rect x="-100" y="-100" width={VBW + 200} height={VBH + 200} fill={theme.accent} />
        {isMobile ? (
          <g transform={`rotate(-4 ${VBW / 2} ${VBH / 2})`} opacity="0.9">
            {scene.arrows.map((ar, i) => <Arrow key={`a${i}`} {...ar} />)}
            {scene.screens.map((s, i) => <Screen key={`s${i}`} s={s} />)}
          </g>
        ) : (
          <g stroke={LINE} fill="none" opacity="0.85">
            {scene.screens.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.w / 3} strokeWidth="2.5" fill={i % 3 === 0 ? PURPLE : 'none'} fillOpacity="0.25" />
            ))}
          </g>
        )}
      </svg>
    </Box>
  );
};

export default LoginIllustration;
