// src/content/config.js
// SPEC-10: Single build-time artifact that points the app at its content source.
//
// The app fetches content at runtime from the `second` remote
// (DomicianoRincon/FlutterApps) — that's the repo raw.githubusercontent serves,
// so content changes must be pushed there to go live. See CLAUDE.md "Git Remotes".

const courseConfig = {
  tocUrl: 'https://raw.githubusercontent.com/DomicianoRincon/FlutterApps/refs/heads/main/toc.md',
};

export default courseConfig;
