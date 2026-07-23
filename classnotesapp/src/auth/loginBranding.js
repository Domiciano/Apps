// src/auth/loginBranding.js
//
// Per-course look of the login / profile gate. This is a variation axis like
// the theme: only the values below change per course, the rendering lives in
// the shared LoginScreen.jsx / LoginBackground.jsx.
//
//   courseName: shown on the login card.
//   motif:      background pattern drawn by LoginBackground.jsx —
//               'mobile'   -> app-icon grid + phone outlines (mobile-apps courses)
//               'network'  -> nodes + links (networking / internet courses)
//               'geometric'-> neutral dots & shapes (default / template)

export const loginBranding = {
  courseName: 'Aplicaciones Móviles',
  motif: 'mobile',
};
