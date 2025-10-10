import { Paper, Stack, Typography, Box } from '@mui/material';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { formatTime } from '../utils/formatters';

const activityIcons = {
  flight: FlightOutlinedIcon,
  accommodation: BedOutlinedIcon,
  restaurant: RestaurantOutlinedIcon,
  activity: StarOutlinedIcon,
  transport: DirectionsCarFilledOutlinedIcon,
  other: StarOutlinedIcon
};

const ActivityCard = ({ activity }) => {
  const Icon = activityIcons[activity.type] || StarOutlinedIcon;

  return (
    <Paper
      sx={{
        p: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 2
        }
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon sx={{ color: 'primary.dark', fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {activity.title}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {formatTime(activity.time)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.location}
            </Typography>
          </Stack>
          {activity.description && (
            <Typography variant="body2" color="text.secondary">
              {activity.description}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default ActivityCard;