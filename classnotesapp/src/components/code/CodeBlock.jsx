// components/CodeBlock.jsx
import React, { useEffect, useRef } from "react";
import Prism from "prismjs"; 
import "prismjs/components/prism-dart";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-java";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-ini";

// Importar lenguajes personalizados
import "@/prism/languages/prism-http.js";
import "@/prism/languages/prism-sql-enhanced.js";
import "@/prism/languages/prism-java-enhanced.js";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "@/styles/flutter-like.css";
import { useAnalytics } from "@/analytics/AnalyticsProvider";
import { EVENTS } from "@/analytics/events";

// `source` distingue el código de una lección del que devuelve el asistente de
// IA. Copiar del material y copiar la solución que te dio el modelo son dos
// conductas distintas; mezclarlas en el mismo evento estropea H5 (razón
// copiar/ejecutar) y H7 (ayuda ejecutiva). Ver datadict.md § 2.3.
const CodeBlock = ({ children, language, className = "", source = "lesson" }) => {
  const codeRef = useRef(null);
  const { track } = useAnalytics();

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    // `lines` distingue copiar un fragmento de copiar el ejercicio entero (H5).
    track(EVENTS.CODE_COPY, {
      lines: String(children ?? '').split('\n').length,
      language: language ?? null,
      source,
    });
  };

  return (
    <Box
      className={`flutter-code ${className}`}
      sx={{ 
        position: "relative", 
        my: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'auto',
        '& pre': {
          border: 'none !important',
          boxShadow: 'none !important',
          whiteSpace: 'pre-wrap !important',
          wordBreak: 'break-word !important',
        },
        '& code': {
          border: 'none !important',
          boxShadow: 'none !important',
          whiteSpace: 'pre-wrap !important',
          wordBreak: 'break-word !important',
        },
      }}
    >
      <IconButton
        onClick={copyToClipboard}
        sx={{ position: "absolute", top: 8, right: 8, color: "#fff", background: 'rgba(0,0,0,0.18)', '&:hover': { background: 'rgba(0,0,0,0.32)' } }}
        size="small"
        aria-label="Copiar código"
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      <pre style={{ margin: 0, marginBottom: 0, width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'auto', paddingBottom: 8, display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        <code className={`language-${language}`} ref={codeRef} style={{ width: '100%', maxWidth: '100%', display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {children}
        </code>
      </pre>
    </Box>
  );
};

export default CodeBlock;