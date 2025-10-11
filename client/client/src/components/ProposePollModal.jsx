import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const ProposePollModal = ({ open, onClose }) => {
  const { currentTrip, addPoll } = useTrip();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    question: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const pollData = {
        tripId: currentTrip.id,
        question: formData.question,
        description: formData.description,
        createdBy: user,
        createdAt: new Date().toISOString().split('T')[0],
        upvotes: 0,
        downvotes: 0,
        userVote: 'none',
        voters: []
      };

      addPoll(pollData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      question: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    return formData.question.trim();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Propose a New Poll</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Question"
            placeholder="e.g., Should we visit the Louvre Museum?"
            value={formData.question}
            onChange={handleChange('question')}
            error={!!errors.question}
            helperText={errors.question}
            required
          />

          <TextField
            fullWidth
            label="Description"
            placeholder="Add any additional details or context (optional)..."
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Propose Poll
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProposePollModal;