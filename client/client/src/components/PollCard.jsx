import { Card, CardContent, Typography, Stack, IconButton, Box } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

const PollCard = ({ poll }) => {
  const { castVote } = useTrip();
  const { user } = useAuth();

  // Calculate vote counts
  const upvotes = poll.votes?.filter(v => v.type === 'upvote').length || 0;
  const downvotes = poll.votes?.filter(v => v.type === 'downvote').length || 0;
  
  // Check if the current user has voted
  const userVote = poll.votes?.find(v => v.userId === user._id)?.type || 'none';

  const handleVote = async (voteType) => {
    try {
      await castVote(poll._id, { voteType });
    } catch (err) {
      console.error('Failed to cast vote:', err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {poll.question}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Asked by {poll.createdBy.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(poll.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => handleVote('upvote')}
              color={userVote === 'upvote' ? 'primary' : 'default'}
              sx={{
                bgcolor: userVote === 'upvote' ? 'primary.light' : 'transparent',
                '&:hover': {
                  bgcolor: userVote === 'upvote' ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <ThumbUpOutlinedIcon />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
              {upvotes}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => handleVote('downvote')}
              color={userVote === 'downvote' ? 'error' : 'default'}
              sx={{
                bgcolor: userVote === 'downvote' ? 'error.light' : 'transparent',
                '&:hover': {
                  bgcolor: userVote === 'downvote' ? 'error.light' : 'action.hover'
                }
              }}
            >
              <ThumbDownAltOutlinedIcon />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
              {downvotes}
            </Typography>
          </Box>
          {userVote !== 'none' && (
            <Typography variant="caption" color="primary" sx={{ ml: 'auto' }}>
              You voted {userVote === 'upvote' ? 'yes' : 'no'}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PollCard;