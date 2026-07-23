// src/pages/LessonPage.jsx

import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import LessonParser from '@/components/lesson/LessonParser';
import TableOfContents from '@/components/lesson/TableOfContents';
import { useThemeMode } from '@/theme/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import { useContentSpy } from '@/hooks/useContentSpy';
import { useLessonContentCache } from '@/theme/LessonContentCache';

// Named constants — match Layout.jsx drawerWidth and TableOfContents desktop width
const DRAWER_WIDTH = 280;
const TOC_WIDTH = 235;
const CONTENT_LEFT_OFFSET = DRAWER_WIDTH - 40;  // 240px
const CONTENT_RIGHT_OFFSET = TOC_WIDTH - 15;    // 220px

const SkeletonBlock = ({ height, width, theme }) => (
  <Box
    sx={{
      height,
      width,
      borderRadius: 1,
      backgroundColor: theme.backgroundLight,
      animation: 'lesson-skeleton-pulse 1.4s ease-in-out infinite',
      '@keyframes lesson-skeleton-pulse': {
        '0%': { opacity: 1 },
        '50%': { opacity: 0.4 },
        '100%': { opacity: 1 },
      },
    }}
  />
);

const LessonPage = forwardRef(({ sections }, ref) => {
  const { lessonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState({ elements: null, subtitles: [], lessonTitle: '' });
  const [showMobileToc, setShowMobileToc] = useState(false);
  const { theme } = useThemeMode();
  const { getOrFetch } = useLessonContentCache();

  const { activeSection } = useContentSpy(parsedContent.subtitles);

  const lessonMap = useMemo(() => {
    const map = new Map();
    sections.forEach(sec => {
      if (sec.type === 'lesson') map.set(sec.id, sec);
    });
    return map;
  }, [sections]);

  useEffect(() => {
    const section = lessonMap.get(lessonId);

    if (!section) {
      const error = `# Lección no encontrada\n\nLa lección con ID "${lessonId}" no fue encontrada.`;
      setParsedContent(LessonParser({ content: error }));
      setLoading(false);
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    getOrFetch(lessonId, section.url).then(rawContent => {
      setParsedContent(LessonParser({ content: rawContent }));
      setLoading(false);
      window.scrollTo(0, 0);
    });
  }, [lessonId, lessonMap]);

  useImperativeHandle(ref, () => ({
    openMobileToc: () => setShowMobileToc(true),
    closeMobileToc: () => setShowMobileToc(false),
  }));

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800 }}>
        <SkeletonBlock height="48px" width="60%" theme={theme} />
        <SkeletonBlock height="28px" width="40%" theme={theme} />
        <SkeletonBlock height="120px" width="100%" theme={theme} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: { xs: 'column', lg: 'row' }, minWidth: 0 }}>
      <Box
        sx={{
          flex: 1,
          right: { lg: CONTENT_RIGHT_OFFSET, xs: 10 },
          left: { lg: CONTENT_LEFT_OFFSET, xs: 10 },
          position: 'absolute',
          overflow: 'scroll',
          height: '100vh',
          bottom: 0,
        }}
        className="hide-scrollbar"
      >
        {parsedContent.elements}
      </Box>

      <Box sx={{
        width: { lg: TOC_WIDTH },
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
        mr: 2,
        position: 'fixed',
        right: 0,
        top: 64,
      }}>
        <TableOfContents
          subtitles={parsedContent.subtitles}
          lessonTitle={parsedContent.lessonTitle}
          activeSection={activeSection}
          lessonId={lessonId}
        />
      </Box>

      {showMobileToc && (
        <Box sx={{
          position: 'fixed', top: 0, right: 0,
          width: '85vw', maxWidth: 320, height: '100vh',
          backgroundColor: theme.background, zIndex: 2000, boxShadow: 6, p: 2,
          display: { xs: 'block', lg: 'none' },
        }}>
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2100 }}>
            <button onClick={() => setShowMobileToc(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              aria-label="Cerrar TOC">
              <CloseIcon sx={{ color: theme.primaryTitle, fontSize: 28 }} />
            </button>
          </Box>
          <Box sx={{ pt: 4 }}>
            <TableOfContents
              subtitles={parsedContent.subtitles}
              lessonTitle={parsedContent.lessonTitle}
              activeSection={activeSection}
              lessonId={lessonId}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default LessonPage;
