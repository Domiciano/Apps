import React from 'react';
import Box from '@mui/material/Box';

// SPEC-08 P5: corrected aspect ratio — 56.25% = 9/16 (true 16:9)
const YouTubeEmbed = ({ videoId, title = "YouTube video" }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3,
        my: 3,
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?vq=hd1080&rel=0`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default YouTubeEmbed;
