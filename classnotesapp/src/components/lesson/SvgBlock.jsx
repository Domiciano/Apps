// src/components/lesson/SvgBlock.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useThemeMode } from '@/theme/ThemeContext';
import { STEP_HOLD, readSteps, stepAt, timelineAnimations, wrapStep } from '@/utils/svgSteps';

const TICK_MS = 100;

// 'play' loops on its own; 'step' plays one step and then rests; 'pause' is at rest.
const SvgBlock = ({ svg }) => {
  const { theme } = useThemeMode();
  const containerRef = useRef(null);
  const stopAtRef = useRef(null);
  const [timeline, setTimeline] = useState(null);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('play');
  const html = useMemo(() => ({ __html: svg }), [svg]);

  const allAnimations = useCallback(() => {
    const root = containerRef.current?.querySelector('svg');
    return typeof root?.getAnimations === 'function' ? root.getAnimations({ subtree: true }) : [];
  }, []);

  useEffect(() => {
    const found = readSteps(containerRef.current?.querySelector('svg'));
    const animated = found && timelineAnimations(allAnimations(), found).length > 0;
    stopAtRef.current = null;
    setTimeline(animated ? found : null);
    setStep(0);
    setMode('play');
  }, [svg, allAnimations]);

  useEffect(() => {
    if (!timeline || mode === 'pause') return undefined;
    const id = setInterval(() => {
      const all = allAnimations();
      const main = timelineAnimations(all, timeline);
      if (main.length === 0) return;
      const total = timeline.steps * timeline.stepMs;
      const inCycle = (Number(main[0].currentTime) || 0) % total;
      setStep(stepAt(inCycle, timeline));
      if (stopAtRef.current !== null && inCycle >= stopAtRef.current) {
        all.forEach((a) => a.pause());
        stopAtRef.current = null;
        setMode('pause');
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [timeline, mode, allAnimations]);

  const goTo = (index) => {
    if (!timeline) return;
    const target = wrapStep(index, timeline.steps);
    const all = allAnimations();
    timelineAnimations(all, timeline).forEach((a) => {
      a.currentTime = target * timeline.stepMs;
    });
    setStep(target);
    if (mode === 'play') return;
    stopAtRef.current = (target + STEP_HOLD) * timeline.stepMs;
    all.forEach((a) => a.play());
    setMode('step');
  };

  const togglePlay = () => {
    const all = allAnimations();
    stopAtRef.current = null;
    if (mode === 'play') {
      all.forEach((a) => a.pause());
      setMode('pause');
    } else {
      all.forEach((a) => a.play());
      setMode('play');
    }
  };

  const buttonSx = { color: theme.textSecondary };

  return (
    <Box sx={{ my: '12px' }}>
      <div ref={containerRef} style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={html} />
      {timeline && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
          <IconButton size="small" aria-label="Paso anterior" onClick={() => goTo(step - 1)} sx={buttonSx}>
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label={mode === 'play' ? 'Pausar' : 'Reproducir'} onClick={togglePlay} sx={buttonSx}>
            {mode === 'play' ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" aria-label="Paso siguiente" onClick={() => goTo(step + 1)} sx={buttonSx}>
            <SkipNextIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ ml: 1, minWidth: 84, color: theme.textSecondary }}>
            Paso {step + 1} de {timeline.steps}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SvgBlock;
