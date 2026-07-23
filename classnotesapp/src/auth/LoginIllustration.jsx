// src/auth/LoginIllustration.jsx
//
// Decorative, full-bleed backdrop for the login side panel. The 'mobile' motif
// is a procedurally-generated, deliberately messy low-fidelity prototype board:
// hand-shaky wireframe cards packed densely and joined by wobbly arrows, each
// card carrying flat accent colors (headers, buttons, checks). Seeded, so it's
// stable across renders. Ornamental; motif chosen per course in loginBranding.js.

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { useThemeMode } from '@/theme/ThemeContext';
import { loginBranding } from './loginBranding';

const INK = '#141821';
const PAPER = '#FFFFFF';
// Flat accent palette (deliberately not the panel blue, so cards pop).
const PALETTE = ['#FF6B6B', '#6C4CD6', '#FFC83D', '#2BC77A', '#4B49E6', '#FF8FB1'];
const GREEN = '#2BC77A';
const VBW = 1400;
const VBH = 1000;
const CELL = 208;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const j = (r, amt) => (r() * 2 - 1) * amt;

function roughRect(r, cx, cy, w, h, amt) {
  const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2;
  const p = (x, y) => `${(x + j(r, amt)).toFixed(1)} ${(y + j(r, amt)).toFixed(1)}`;
  return `M ${p(x0, y0)} L ${p((x0 + x1) / 2, y0)} L ${p(x1, y0)} L ${p(x1, (y0 + y1) / 2)} ` +
         `L ${p(x1, y1)} L ${p((x0 + x1) / 2, y1)} L ${p(x0, y1)} L ${p(x0, (y0 + y1) / 2)} Z`;
}

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
      if (r() < 0.08) continue; // few, small gaps → dense board
      const w = 78 + Math.round(r() * 36);
      const h = Math.round(w * (1.45 + r() * 0.45));
      const cx = col * CELL + CELL * 0.5 + j(r, 52);
      const cy = row * CELL + CELL * 0.5 + j(r, 52);
      const rot = j(r, 15);
      const kind = Math.floor(r() * 3);
      const accent = PALETTE[Math.floor(r() * PALETTE.length)];
      const check = r() < 0.4;
      const s = { row, col, cx, cy, w, h, rot, kind, accent, check, seed: Math.floor(r() * 1e9) };
      cells[`${row}-${col}`] = s;
      screens.push(s);
    }
  }
  const arrows = [];
  for (const s of screens) {
    const right = cells[`${s.row}-${s.col + 1}`];
    if (right && r() < 0.6) arrows.push({ a: s, b: right, seed: Math.floor(r() * 1e9) });
    const down = cells[`${s.row + 1}-${s.col}`];
    if (down && r() < 0.35) arrows.push({ a: s, b: down, seed: Math.floor(r() * 1e9) });
  }
  return { screens, arrows };
}

function Screen({ s }) {
  const r = mulberry32(s.seed);
  const hw = s.w / 2, hh = s.h / 2, pad = 11;
  const el = [];
  // card
  el.push(<path key="frame" d={roughRect(r, 0, 0, s.w, s.h, 2.6)} strokeWidth="3" fill={PAPER} />);
  // colored header
  el.push(<path key="hdr" d={roughRect(r, 0, -hh + 18, s.w - 2 * pad, 14, 2)} strokeWidth="2.4" fill={s.accent} />);

  if (s.kind === 0) { // detail
    const iy = -hh + 18 + (s.h - 36) * 0.3;
    el.push(<path key="img" d={roughRect(r, 0, iy, s.w - 2 * pad, s.h * 0.32, 2.2)} strokeWidth="2.4" fill={s.accent} fillOpacity="0.22" />);
    el.push(<path key="x1" d={roughLine(r, -hw + pad, iy - s.h * 0.16, hw - pad, iy + s.h * 0.16, 2)} strokeWidth="1.6" />);
    el.push(<path key="x2" d={roughLine(r, hw - pad, iy - s.h * 0.16, -hw + pad, iy + s.h * 0.16, 2)} strokeWidth="1.6" />);
    el.push(<path key="l1" d={roughLine(r, -hw + pad, hh - 42, hw - pad, hh - 42, 2)} strokeWidth="2.2" />);
    el.push(<path key="btn" d={roughRect(r, 0, hh - 18, s.w - 2 * pad, 16, 2)} strokeWidth="2.4" fill={s.accent} />);
  } else if (s.kind === 1) { // list
    for (let i = 0; i < 3; i++) {
      const ry = -hh + 42 + i * ((s.h - 56) / 3);
      el.push(<path key={`sq${i}`} d={roughRect(r, -hw + pad + 8, ry, 15, 15, 1.6)} strokeWidth="2" fill={i === 1 ? s.accent : 'none'} />);
      el.push(<path key={`ln${i}`} d={roughLine(r, -hw + pad + 24, ry, hw - pad, ry, 2)} strokeWidth="2" />);
    }
    el.push(<path key="nav" d={roughRect(r, 0, hh - 16, s.w - 2 * pad, 16, 2)} strokeWidth="2" fill={s.accent} fillOpacity="0.35" />);
  } else { // form
    for (let i = 0; i < 3; i++) {
      const fy = -hh + 42 + i * 22;
      el.push(<path key={`in${i}`} d={roughRect(r, 0, fy, s.w - 2 * pad, 13, 2)} strokeWidth="2" fill={i === 0 ? s.accent : 'none'} fillOpacity={i === 0 ? '0.25' : '1'} />);
    }
    el.push(<path key="fbtn" d={roughRect(r, 0, hh - 22, s.w * 0.55, 15, 2)} strokeWidth="2.4" fill={s.accent} />);
  }

  return (
    <g transform={`translate(${s.cx} ${s.cy}) rotate(${s.rot})`} fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      {el}
      {s.check && (
        <g>
          <path d={roughRect(r, hw - 6, -hh + 4, 26, 26, 2)} strokeWidth="3" fill={PAPER} />
          <path d={`M ${hw - 15} ${-hh + 4} L ${hw - 8} ${-hh + 11} L ${hw + 4} ${-hh - 4}`} stroke={GREEN} strokeWidth="4" />
        </g>
      )}
    </g>
  );
}

function Arrow({ a, b, seed }) {
  const r = mulberry32(seed);
  const dx = b.cx - a.cx, dy = b.cy - a.cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const sx = a.cx + ux * (a.w / 2 + 8), sy = a.cy + uy * (a.h / 2 + 8);
  const ex = b.cx - ux * (b.w / 2 + 12), ey = b.cy - uy * (b.h / 2 + 12);
  const bow = j(r, 40) + 18;
  const mx = (sx + ex) / 2 - uy * bow, my = (sy + ey) / 2 + ux * bow;
  const path = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  const ang = Math.atan2(ey - my, ex - mx);
  const hl = 11;
  const h1x = ex - hl * Math.cos(ang - 0.5), h1y = ey - hl * Math.sin(ang - 0.5);
  const h2x = ex - hl * Math.cos(ang + 0.5), h2y = ey - hl * Math.sin(ang + 0.5);
  return (
    <g fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" opacity="0.65">
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
          <g transform={`rotate(-4 ${VBW / 2} ${VBH / 2})`}>
            {scene.arrows.map((ar, i) => <Arrow key={`a${i}`} {...ar} />)}
            {scene.screens.map((s, i) => <Screen key={`s${i}`} s={s} />)}
          </g>
        ) : (
          <g stroke={INK} fill="none">
            {scene.screens.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.w / 3} strokeWidth="2.5" fill={s.accent} fillOpacity="0.6" />
            ))}
          </g>
        )}
      </svg>
    </Box>
  );
};

export default LoginIllustration;
