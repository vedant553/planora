import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import heroImage from '../assets/hero-image.png';

const features = [
  {
    icon: GroupIcon,
    title: 'Collaborative Itineraries',
    description: 'Build perfect trips together. Create shared itineraries, add destinations, activities, and notes with your group.'
  },
  {
    icon: HowToVoteIcon,
    title: 'Activity Voting',
    description: "Decide as a team. Let everyone vote on activities and preferences to ensure everyone's happy."
  },
  {
    icon: ReceiptLongIcon,
    title: 'Expense Tracking',
    description: 'Split costs with ease. Effortlessly track shared expenses and settle up with friends.'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '500px', md: '600px' },
          overflow: 'hidden',
          borderRadius: { xs: 0, md: 4 },
          mx: { xs: 0, md: 4 },
          mt: { xs: 0, md: 4 },
          mb: 8
        }}
      >
        <Box
          component="img"
          src={heroImage}
          alt="Travel planning"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Plan Unforgettable Group Trips, Together.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Collaborate, vote, and track expenses seamlessly for stress-free adventures.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Start Planning Now
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Core Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 600, mb: 6 }}
        >
          Core Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Final CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          mb: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Ready to Plan Your Next Adventure?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of travelers making group trip planning effortless.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Sign Up Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;