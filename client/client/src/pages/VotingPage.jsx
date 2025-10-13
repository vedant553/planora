import { useState } from 'react';
import { Container, Typography, Button, Box, Stack, Alert } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PollCard from '../components/PollCard';
import ProposePollModal from '../components/ProposePollModal';
import { useTrip } from '../context/TripContext';

const VotingPage = () => {
  const { currentTrip, loading, error } = useTrip();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get polls from currentTrip if available, otherwise use empty array
  const polls = currentTrip?.polls || [];

  // DEBUG: Show currentTrip and polls data
  console.log('currentTrip:', currentTrip);
  console.log('polls:', polls);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Voting & Decisions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Propose New Poll
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {polls.map((poll) => (
          <PollCard key={poll._id} poll={poll} />
        ))}
      </Stack>

      {polls.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No active polls
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlinedIcon />}
            sx={{ mt: 2 }}
            onClick={() => setIsModalOpen(true)}
          >
            Create First Poll
          </Button>
        </Box>
      )}

      <ProposePollModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default VotingPage;