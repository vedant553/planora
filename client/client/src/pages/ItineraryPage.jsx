import { Container, Typography, Button, Box, Stack } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ActivityCard from '../components/ActivityCard';
import { useTrip } from '../context/TripContext';

const ItineraryPage = () => {
  const { activities } = useTrip();

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
              >
                Add Activity
              </Button>
            </Box>
            <Stack spacing={2}>
              {dayActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
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
          >
            Add First Activity
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ItineraryPage;