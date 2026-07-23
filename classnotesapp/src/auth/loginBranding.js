// src/auth/loginBranding.js
//
// Per-course look of the login / profile gate. This is a variation axis like
// the theme: only the values below change per course, the rendering lives in
// the shared LoginScreen.jsx / LoginIllustration.jsx.
//
//   courseName:      shown on the login card.
//   backgroundImage: optional photo for the left panel (import an asset). When
//                    null, the generated prototype mosaic is used instead.
//   motif:           mosaic pattern when backgroundImage is null —
//                    'mobile' | 'network' | 'geometric'.

import campus from '@/assets/login-bg.jpg';

export const loginBranding = {
  courseName: 'Aplicaciones Móviles',
  backgroundImage: campus,
  motif: 'mobile',
};
