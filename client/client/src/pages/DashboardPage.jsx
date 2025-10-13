import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Stack, CircularProgress, Alert } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import CreateTripModal from '../components/CreateTripModal';
import tripService from '../services/tripService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for trips data
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trips on component mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tripService.getAllTrips();
        
        // Transform backend response to match frontend expectations
        const transformedTrips = data.map(trip => ({
          ...trip,
          id: trip._id, // Add id field for frontend compatibility
          startDate: trip.dates.start,
          endDate: trip.dates.end
        }));
        
        setTrips(transformedTrips);
      } catch (err) {
        setError(err.message || 'Failed to load trips. Please try again.');
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleTripClick = (tripId) => {
    navigate(`/trips/${tripId}/itinerary`);
  };

  const handleCreateTrip = async (tripData) => {
    try {
      // Format the data to match the backend API expectations
      const formattedData = {
        name: tripData.tripName,
        destination: tripData.destination,
        startDate: tripData.startDate.toISOString().split('T')[0],
        endDate: tripData.endDate.toISOString().split('T')[0]
      };

      // Call the API to create the trip and get the new trip data
      const newTrip = await tripService.createTrip(formattedData);
      
      // Transform the backend response to match frontend expectations
      const transformedTrip = {
        ...newTrip,
        id: newTrip._id, // Add id field for frontend compatibility
        startDate: newTrip.dates.start,
        endDate: newTrip.dates.end
      };
      
      // Add the new trip to the existing trips list
      setTrips(prevTrips => [...prevTrips, transformedTrip]);
      
      setIsModalOpen(false);
      
      // Navigate to the new trip's itinerary page
      const tripId = newTrip._id || newTrip.id;
      if (tripId) {
        navigate(`/trips/${tripId}/itinerary`);
      }
    } catch (err) {
      console.error('Error creating trip:', err);
      setError(err.message || 'Failed to create trip. Please try again.');
    }
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

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && trips.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            You have no trips yet. Create one to get started!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start planning your next adventure by clicking the "Create New Trip" button above.
          </Typography>
        </Box>
      )}

      {/* Trips Grid */}
      {!loading && !error && trips.length > 0 && (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={3}
        >
          {trips.map((trip) => (
            <Box key={trip.id || trip._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <TripCard trip={trip} onClick={() => handleTripClick(trip.id || trip._id)} />
            </Box>
          ))}
        </Stack>
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