import { Container, Typography, Button, Box, Stack } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { mockTrips } from '../utils/mockData';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleTripClick = (tripId) => {
    navigate('/trip/itinerary');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Your Trips
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          size="large"
        >
          Create New Trip
        </Button>
      </Box>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={3}
      >
        {mockTrips.map((trip) => (
          <Box key={trip.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
            <TripCard trip={trip} onClick={() => handleTripClick(trip.id)} />
          </Box>
        ))}
      </Stack>

      {mockTrips.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No trips yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start planning your next adventure!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;