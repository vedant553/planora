import { useState } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import CreateTripModal from '../components/CreateTripModal';
import { mockTrips } from '../utils/mockData';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTripClick = (tripId) => {
    navigate('/trip/itinerary');
  };

  const handleCreateTrip = (tripData) => {
    console.log('Creating trip:', tripData);
    // In a real app, this would call an API to create the trip
    // For now, just log the data and close the modal
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
          onClick={() => setIsModalOpen(true)}
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

      <CreateTripModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </Container>
  );
};

export default DashboardPage;