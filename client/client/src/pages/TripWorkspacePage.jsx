import { useEffect } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useTrip } from '../context/TripContext';
import MainLayout from '../layouts/MainLayout';

const TripWorkspacePage = () => {
  const { tripId } = useParams();
  const { currentTrip, loading, error, fetchTrip } = useTrip();

  useEffect(() => {
    if (tripId) {
      fetchTrip(tripId);
    }
  }, [tripId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (currentTrip && currentTrip._id) {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  }

  // Show loading if we're still waiting for trip data
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default TripWorkspacePage;