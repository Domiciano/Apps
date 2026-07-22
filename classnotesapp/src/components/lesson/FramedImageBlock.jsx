import React from 'react';
import Box from '@mui/material/Box';

// For screenshots exported with a transparent background (isolated component
// crops). Wraps the image in a rounded card matching the design's own card
// color (#FCF8FF, sampled from the full-screen mockups) so text stays legible
// regardless of the app's light/dark theme.
const FramedImageBlock = ({ src, alt = 'Imagen' }) => {
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 4,
        boxShadow: 20,
        overflow: 'hidden',
        my: 2,
        backgroundColor: '#FCF8FF',
        display: 'flex',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default FramedImageBlock;
