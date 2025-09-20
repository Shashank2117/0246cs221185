import React, { useState, useEffect } from 'react';
import { getAllLinks } from '../utils/urlUtils';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const StatsPage = () => {
  const [allLinks, setAllLinks] = useState([]);
  const [modalData, setModalData] = useState(null); // Data for the currently open modal

  // When the component first loads, grab all the data from localStorage.
  useEffect(() => {
    setAllLinks(getAllLinks());
  }, []);

  const openDetailsModal = (link) => setModalData(link);
  const closeDetailsModal = () => setModalData(null);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Link Statistics
        </Typography>
        <Button component={Link} to="/" variant="outlined">
          Shorten Another URL
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Short Link</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell align="right">Clicks</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="center">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allLinks.map((link) => (
              <TableRow key={link.shortCode}>
                <TableCell>
                   <MuiLink href={link.shortUrl} target="_blank" rel="noopener">
                      {link.shortUrl.replace(/^https?:\/\//, '')}
                   </MuiLink>
                </TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.longUrl}
                </TableCell>
                <TableCell align="right">{link.clickCount}</TableCell>
                <TableCell>{new Date(link.expiresAt).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" size="small" onClick={() => openDetailsModal(link)}>
                    View Clicks
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* This is our modal for showing click details */}
      <Modal
        open={!!modalData} // The modal is open if modalData is not null
        onClose={closeDetailsModal}
      >
        <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: 600 }, // Responsive width
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
         }}>
          <Typography variant="h6" component="h2">
            Click History
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all' }}>
            for {modalData?.shortUrl}
          </Typography>
          
          {modalData?.clicks.length > 0 ? (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                 <Table stickyHeader size="small">
                     <TableHead>
                         <TableRow>
                            <TableCell>Time of Click</TableCell>
                            <TableCell>Source</TableCell>
                         </TableRow>
                     </TableHead>
                     <TableBody>
                        {modalData.clicks.map((click, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{click.source}</TableCell>
                            </TableRow>
                        ))}
                     </TableBody>
                 </Table>
            </TableContainer>
          ) : (
             <Typography sx={{ mt: 2 }}>This link hasn't been clicked yet.</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default StatsPage;