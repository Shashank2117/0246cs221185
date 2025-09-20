import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findUrlByShortCode, logClick } from '../utils/urlUtils';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const [statusText, setStatusText] = useState('Finding your link...');

  useEffect(() => {
    const mapping = findUrlByShortCode(shortCode);

    if (mapping) {
      logClick(shortCode);
      window.location.replace(mapping.longUrl);
    } else {
      setTimeout(() => setStatusText('Sorry, this link was not found or has expired.'), 500);
    }
  }, [shortCode]);

  return (
    <Container>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          textAlign: 'center'
        }}
      >
        <CircularProgress sx={{ mb: 2 }}/>
        <Typography variant="h5">{statusText}</Typography>
      </Box>
    </Container>
  );
};

export default RedirectHandler;