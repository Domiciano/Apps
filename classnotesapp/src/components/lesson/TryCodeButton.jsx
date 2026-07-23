import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DartPadEmbed from '../embed/DartPadEmbed';
import { useThemeMode } from '@/theme/ThemeContext';

const TryCodeButton = ({ gistId, codeBlock }) => {
  const [showDartPad, setShowDartPad] = useState(false);
  const { theme } = useThemeMode();
  
  return (
    <Box sx={{ my: 2 }}>
      {/* Pestañas */}
      <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', mb: 0 }}>
        <Button
          variant={!showDartPad ? 'contained' : 'text'}
          onClick={() => setShowDartPad(false)}
          sx={{
            borderRadius: '8px 8px 0 0',
            borderBottom: !showDartPad ? 'none' : '1px solid',
            borderColor: 'divider',
            minWidth: 'auto',
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: !showDartPad ? 'primary.main' : 'transparent',
            color: !showDartPad ? 'white' : theme.textSecondary,
            boxShadow: 'none',
            outline: 'none',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:hover': {
              backgroundColor: !showDartPad ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Código
        </Button>
        <Button
          variant={showDartPad ? 'contained' : 'text'}
          onClick={() => setShowDartPad(true)}
          sx={{
            borderRadius: '8px 8px 0 0',
            borderBottom: showDartPad ? 'none' : '1px solid',
            borderColor: 'divider',
            minWidth: 'auto',
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: showDartPad ? 'primary.main' : 'transparent',
            color: showDartPad ? 'white' : theme.textSecondary,
            boxShadow: 'none',
            outline: 'none',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:hover': {
              backgroundColor: showDartPad ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Fire it up!
        </Button>
      </Box>
      
      {/* Contenido de las pestañas */}
      <Box sx={{ 
        border: 1, 
        borderColor: 'divider', 
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        overflow: 'hidden',
        mt: 0,
        p: 0
      }}>
        {showDartPad ? (
          <DartPadEmbed gistId={gistId} />
        ) : (
          <Box>
            {codeBlock}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TryCodeButton; 