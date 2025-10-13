import { Card, CardMedia, CardContent, Typography, AvatarGroup, Avatar, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDateRange } from '../utils/formatters';

const TripCard = ({ trip }) => {
  return (
    <Link to={`/trips/${trip._id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
      <CardMedia
        component="img"
        height="200"
        image={trip.tripImage || trip.coverImage}
        alt={trip.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
          {trip.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {trip.destination}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {formatDateRange(trip.dates?.start || trip.startDate, trip.dates?.end || trip.endDate)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.875rem' } }}>
            {trip.members?.map((member) => (
              <Avatar key={member.id || member._id} src={member.avatar} alt={member.name} />
            ))}
          </AvatarGroup>
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: trip.status === 'active' ? 'success.light' : 'grey.200',
              color: trip.status === 'active' ? 'success.dark' : 'text.secondary',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          >
            {trip.status}
          </Typography>
        </Box>
      </CardContent>
      </Card>
    </Link>
  );
};

export default TripCard;