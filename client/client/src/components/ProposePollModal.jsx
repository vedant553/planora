import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const ProposePollModal = ({ open, onClose }) => {
  const { proposePoll, loading } = useTrip();
  const [formData, setFormData] = useState({
    question: '',
    description: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await proposePoll(formData);
      setFormData({ question: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create poll');
    }
  };

  const handleClose = () => {
    setFormData({ question: '', description: '' });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Propose a New Poll</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              label="Question"
              fullWidth
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              required
              disabled={loading}
              placeholder="e.g., Should we visit the Louvre Museum?"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={loading}
              placeholder="Add any additional details or context..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.question.trim()}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Create Poll
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProposePollModal;