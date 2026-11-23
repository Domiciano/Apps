// src/agenda/PresentationCalendar.jsx
//
// Calendario minimalista de los meses con presentaciones: los días con franjas
// van en un círculo (al tocarlos, la página baja hasta ese día) y las semanas de
// AGENDA_WEEKS llevan una franja suave de lunes a viernes con su número grande a
// la izquierda.

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { AGENDA_WEEKS } from './agendaConfig';
import { monthGrid, monthLabel, monthsFor, weekBand } from './calendarGrid';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const COLUMNS = '44px repeat(7, 1fr)';

const Month = ({ year, month, presentationDays, theme, onPickDay }) => {
  const rows = monthGrid(year, month);
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme.textSecondary,
          mb: 1.25,
          pl: '44px',
        }}
      >
        {monthLabel(year, month)}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: COLUMNS, mb: 0.5 }}>
        <span />
        {WEEKDAYS.map((d, i) => (
          <Typography
            key={i}
            sx={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: theme.textSecondary, opacity: i > 4 ? 0.5 : 0.8 }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {rows.map((row, r) => {
        const band = weekBand(row, AGENDA_WEEKS);
        return (
          <Box
            key={r}
            sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', height: 40 }}
          >
            {band && (
              <Box
                aria-hidden
                sx={{
                  gridRow: 1,
                  gridColumn: `${band.from + 2} / ${band.to + 3}`,
                  height: 34,
                  borderRadius: 999,
                  background: alpha(theme.accent, 0.12),
                }}
              />
            )}
            <Typography
              sx={{
                gridRow: 1,
                gridColumn: 1,
                fontSize: '1.65rem',
                fontWeight: 800,
                lineHeight: 1,
                color: theme.accent,
                letterSpacing: '-0.03em',
                textAlign: 'center',
              }}
              title={band ? `Semana ${band.number}` : undefined}
            >
              {band?.number ?? ''}
            </Typography>
            {row.map((date, col) => {
              if (!date) return <Box key={col} sx={{ gridRow: 1, gridColumn: col + 2 }} />;
              const day = Number(date.slice(8));
              const presenting = presentationDays.has(date);
              const circle = {
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontVariantNumeric: 'tabular-nums',
              };
              return (
                <Box key={col} sx={{ gridRow: 1, gridColumn: col + 2, display: 'flex', justifyContent: 'center', zIndex: 1 }}>
                  {presenting ? (
                    <ButtonBase
                      onClick={() => onPickDay(date)}
                      aria-label={`Ir al ${day}`}
                      sx={{
                        ...circle,
                        border: `2px solid ${theme.accent}`,
                        color: theme.accent,
                        fontWeight: 800,
                        background: 'transparent',
                        transition: 'background 120ms',
                        '&:hover': { background: alpha(theme.accent, 0.18) },
                      }}
                    >
                      {day}
                    </ButtonBase>
                  ) : (
                    <Box sx={{ ...circle, color: theme.textPrimary, opacity: col > 4 ? 0.35 : 0.7 }}>{day}</Box>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

const PresentationCalendar = ({ dates, theme, card, onPickDay }) => {
  const presentationDays = useMemo(() => new Set(dates), [dates]);
  const months = useMemo(() => monthsFor(dates), [dates]);
  return (
    <Box sx={{ ...card, p: { xs: 2, sm: 2.5 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: `repeat(${months.length}, 1fr)` },
          gap: { xs: 3, sm: 4 },
        }}
      >
        {months.map((m) => (
          <Month
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            presentationDays={presentationDays}
            theme={theme}
            onPickDay={onPickDay}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mt: 1.5, pl: '44px', color: theme.textSecondary, fontSize: '0.75rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${theme.accent}` }} />
          Días de presentaciones
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 22, height: 10, borderRadius: 999, background: alpha(theme.accent, 0.12) }} />
          Semanas del semestre
        </Box>
      </Box>
    </Box>
  );
};

export default PresentationCalendar;
