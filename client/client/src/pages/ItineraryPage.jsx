import { useState } from 'react';
import { Container, Typography, Button, Box, Stack, CircularProgress } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ActivityCard from '../components/ActivityCard';
import AddActivityModal from '../components/AddActivityModal';
import { useTrip } from '../context/TripContext';

const ItineraryPage = () => {
  const { currentTrip, loading } = useTrip();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Get activities from currentTrip if available, otherwise use empty array
  const activities = currentTrip?.activities || [];

  const handleOpenModal = (day = null) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Group activities by day
  const activitiesByDay = activities.reduce((acc, activity) => {
    if (!acc[activity.day]) {
      acc[activity.day] = [];
    }
    acc[activity.day].push(activity);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Itinerary
      </Typography>

      <Stack spacing={4}>
        {Object.entries(activitiesByDay).map(([day, dayActivities]) => (
          <Box key={day}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Day {day}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlinedIcon />}
                size="small"
                onClick={() => handleOpenModal(parseInt(day))}
              >
                Add Activity
              </Button>
            </Box>
            <Stack spacing={2}>
              {dayActivities.map((activity, idx) => (
                <ActivityCard key={activity.id || `${day}-${idx}`} activity={activity} />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>

      {activities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No activities scheduled
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlinedIcon />}
            sx={{ mt: 2 }}
            onClick={() => handleOpenModal()}
          >
            Add First Activity
          </Button>
        </Box>
      )}

      <AddActivityModal
        open={isModalOpen}
        onClose={handleCloseModal}
        selectedDay={selectedDay}
      />
    </Container>
  );
};

export default ItineraryPage;