// src/components/lesson/MermaidBlock.jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import Box from '@mui/material/Box';
import { useThemeMode } from '@/theme/ThemeContext';

let initialized = false;

const MermaidBlock = ({ chart }) => {
  const { mode } = useThemeMode();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
      initialized = true;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !chart?.trim()) return;

    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: mode === 'dark' ? 'dark' : 'default',
    });

    mermaid
      .render(id, chart.trim())
      .then(({ svg }) => {
        if (containerRef.current) containerRef.current.innerHTML = svg;
      })
      .catch(err => {
        console.error('[MermaidBlock]', err);
        if (containerRef.current)
          containerRef.current.textContent = `Error rendering diagram: ${err.message}`;
      });
  }, [chart, mode]);

  return (
    <Box
      ref={containerRef}
      sx={{
        my: 2,
        p: 2,
        borderRadius: 2,
        overflowX: 'auto',
        '& svg': { maxWidth: '100%', height: 'auto' },
      }}
    />
  );
};

export default MermaidBlock;
