import { Card, CardContent, Typography, Stack, IconButton, Box } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

const PollCard = ({ poll, onVote }) => {
  const handleVote = (vote) => {
    onVote(poll.id, vote);
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
              onClick={() => handleVote('up')}
              color={poll.userVote === 'up' ? 'primary' : 'default'}
              sx={{
                bgcolor: poll.userVote === 'up' ? 'primary.light' : 'transparent',
                '&:hover': {
                  bgcolor: poll.userVote === 'up' ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <ThumbUpOutlinedIcon />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
              {poll.upvotes}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => handleVote('down')}
              color={poll.userVote === 'down' ? 'error' : 'default'}
              sx={{
                bgcolor: poll.userVote === 'down' ? 'error.light' : 'transparent',
                '&:hover': {
                  bgcolor: poll.userVote === 'down' ? 'error.light' : 'action.hover'
                }
              }}
            >
              <ThumbDownAltOutlinedIcon />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
              {poll.downvotes}
            </Typography>
          </Box>
          {poll.userVote !== 'none' && (
            <Typography variant="caption" color="primary" sx={{ ml: 'auto' }}>
              You voted
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PollCard;