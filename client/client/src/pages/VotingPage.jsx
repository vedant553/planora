import { useState } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PollCard from '../components/PollCard';
import ProposePollModal from '../components/ProposePollModal';
import { useTrip } from '../context/TripContext';

const VotingPage = () => {
  const { polls, votePoll } = useTrip();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Voting
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Propose a New Poll
        </Button>
      </Box>

      <Stack spacing={3}>
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} onVote={votePoll} />
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