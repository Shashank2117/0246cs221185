import React, { useState } from 'react';
import { createShortUrl } from '../utils/urlUtils';
import { Container, Typography, TextField, Button, Box, Card, CardContent, Alert, IconButton, Link as MuiLink } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Link } from 'react-router-dom';

const ShortenerPage = () => {
  const [inputs, setInputs] = useState(
    [
        { longUrl: '', customCode: '', validity: '' }
    ]
);
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const updateInputValue = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index][event.target.name] = event.target.value;
    setInputs(newInputs);
  };

  const addNewUrlField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: '', customCode: '', validity: '' }]);
    }
  };

  const removeUrlField = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleShortenClick = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setShortenedLinks([]);
    
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    let newResults = [];

    for (const input of inputs) {
      // a bit of a sanity check on the inputs
      if (!input.longUrl.trim()) {
        setErrorMessage('Make sure all URL fields are filled out.');
        return; // Stop processing
      }
      if (!urlRegex.test(input.longUrl)) {
        setErrorMessage(`This doesn't look like a valid URL: ${input.longUrl}`);
        return;
      }
      if (input.validity && (isNaN(parseInt(input.validity)) || parseInt(input.validity) < 1)) {
        setErrorMessage('If you set a validity period, it must be a positive number.');
        return;
      }

      const validityMins = input.validity ? parseInt(input.validity) : 30; // Default to 30
      const result = createShortUrl(input.longUrl, input.customCode || null, validityMins);
      
      if (!result.success) {
        setErrorMessage(result.error);
        return; // Stop on the first error
      }
      newResults.push(result.data);
    }

    setShortenedLinks(newResults);
    setInputs([{ longUrl: '', customCode: '', validity: '' }]); // Reset the form for a better UX
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create short, easy-to-share links.
        </Typography>
        <Button component={Link} to="/stats" variant="outlined" sx={{ my: 2 }}>
          Check Link Stats
        </Button>
      </Box>

      <form onSubmit={handleShortenClick}>
        {inputs.map((input, index) => (
          <Card key={index} sx={{ mb: 2, overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Your Long URL"
                  name="longUrl"
                  value={input.longUrl}
                  onChange={(e) => updateInputValue(index, e)}
                  variant="outlined"
                  required
                />
                {inputs.length > 1 && (
                  <IconButton onClick={() => removeUrlField(index)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Custom Name (Optional)"
                  name="customCode"
                  value={input.customCode}
                  onChange={(e) => updateInputValue(index, e)}
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Expires in (Minutes)"
                  name="validity"
                  type="number"
                  value={input.validity}
                  onChange={(e) => updateInputValue(index, e)}
                  variant="outlined"
                  sx={{ flex: 1 }}
                  placeholder="Default: 30"
                />
              </Box>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={addNewUrlField}
            disabled={inputs.length >= 5}
          >
            Add URL
          </Button>
          <Button type="submit" variant="contained" color="primary" size="large">
            Make it Short!
          </Button>
        </Box>
      </form>

      {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}
      
      {shortenedLinks.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Success! Here are your links:
          </Typography>
          {shortenedLinks.map((link, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography sx={{ wordBreak: 'break-all' }}>
                  <strong>Original:</strong> {link.longUrl}
                </Typography>
                <Typography>
                  <strong>Short:</strong>{' '}
                  <MuiLink href={link.shortUrl} target="_blank" rel="noopener">
                    {link.shortUrl}
                  </MuiLink>
                </Typography>
                 <Typography variant="caption" color="text.secondary">
                    Expires: {new Date(link.expiresAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;