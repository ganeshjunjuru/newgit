import React from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, Link } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactUsPage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, you'd collect form data and send it to a backend.
    // For now, let's just log it.
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Form submitted:', data);
    alert('Message sent! (Form submission logic is mocked)');
    // You might want to reset the form fields here
    // event.currentTarget.reset();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 4 }, // Responsive padding
        backgroundColor: '#f0f2f5', // Light grey background matching image
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center content vertically
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }} maxWidth="lg"> {/* Max width for larger screens */}
        {/* Reach Us Here Form Section */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={3} // Shadow effect
            sx={{
              p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              borderRadius: '8px',
              backgroundColor: '#ffffff', // White background
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: '#333',
                fontWeight: 'bold', // Matches the bold look in the image
                mb: { xs: 2, md: 3 }, // Margin below heading
              }}
            >
              Reach Us Here
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName" // Add name attribute for form data
                    variant="outlined"
                    required
                    size="small" // Make fields a bit smaller to match density
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName" // Add name attribute
                    variant="outlined"
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mobile Number *"
                    name="mobileNumber" // Add name attribute
                    variant="outlined"
                    type="tel"
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email *"
                    name="email" // Add name attribute
                    variant="outlined"
                    type="email"
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject" // Add name attribute
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message *"
                    name="message" // Add name attribute
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#1976d2', // Blue color similar to the image
                      '&:hover': {
                        backgroundColor: '#1565c0', // Slightly darker blue on hover
                      },
                      py: { xs: 1, sm: 1.5 }, // Responsive padding
                      px: { xs: 3, sm: 4 },   // Responsive padding
                      borderRadius: '4px',
                      textTransform: 'none', // Prevent uppercase text
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 'bold',
                      mt: { xs: 1, sm: 2 }, // Margin top
                    }}
                  >
                    Submit Form
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Administrative Office Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              height: '100%', // Ensure it takes full height of the grid item
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                color: '#333',
                fontWeight: 'bold',
                mb: { xs: 2, md: 3 },
              }}
            >
              ADMINISTRATIVE OFFICE
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#555', fontWeight: 'medium' }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}> {/* Increased mb for spacing */}
                <PhoneIcon sx={{ mr: 1.5, color: '#1976d2' }} /> {/* Increased mr */}
                <Typography variant="body1" sx={{ color: '#333' }}>
                  +91 9703073871
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <EmailIcon sx={{ mr: 1.5, color: '#1976d2' }} />
                <Typography variant="body1" sx={{ color: '#333' }}>
                  sreepaada.ug@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}> {/* Adjusted alignment and mb */}
                <LocationOnIcon sx={{ mr: 1.5, color: '#1976d2', mt: 0.5 }} />
                <Typography variant="body1" sx={{ color: '#333' }}>
                  D.NO:39-33-2/3, HIG-96, RTA OFFICE ROAD, MADHAVADHARA, VISAKHAPATNAM, PINCODE-530018
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ color: '#555', fontWeight: 'medium', mt: { xs: 2, md: 3 } }}>
              Locate Our Campus:
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: '300px', borderRadius: '8px', overflow: 'hidden', mb: 1.5 }}>
              {/* IMPORTANT: Replace this src with your actual Google Maps embed URL.
                  You can get this from Google Maps -> Search location -> Share -> Embed a map.
                  Using a placeholder URL here. */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.000000000000!2d83.31000000000000!3d17.75000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a201c1f4e1f4a4f%3A0x4a4f4e1f4a4f4e1f!2sSreepaada%20Degree%20College!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sreepaada Degree College Location"
              ></iframe>
            </Box>
             <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#777', fontSize: '0.8rem' }}> {/* Smaller font size */}
                    Sreepaada Degree College
                </Typography>
                <Link
                    href="https://www.google.com/maps/dir/?api=1&destination=Sreepaada+Degree+College,+D.NO:39-33-2/3,+HIG-96,+RTA+OFFICE+ROAD,+MADHAVADHARA,+VISAKHAPATNAM,+PINCODE-530018"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                    <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 'medium', fontSize: '0.8rem' }}>
                        Directions
                    </Typography>
                    {/* You can add a directions icon here if desired, e.g., <DirectionsIcon sx={{ ml: 0.5, fontSize: 'small' }} /> */}
                </Link>
            </Box>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}> {/* Adjusted spacing */}
                <Typography variant="body2" sx={{ color: '#333', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 'bold' }}>4.3</span>
                    <span style={{ margin: '0 4px' }}>⭐</span> {/* Adjusted margin for star */}
                    <Link href="#" color="primary" sx={{ ml: 0.5, textDecoration: 'underline' }}> {/* Added underline for link */}
                        194 reviews
                    </Link>
                </Typography>
            </Box>
            <Box sx={{ mt: 0.5 }}>
                <Link
                    href="https://www.google.com/maps/place/Sreepaada+Degree+College" // Link to the place directly
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}
                >
                    <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 'medium', fontSize: '0.9rem', textDecoration: 'underline' }}>
                        View larger map
                    </Typography>
                </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactUsPage;