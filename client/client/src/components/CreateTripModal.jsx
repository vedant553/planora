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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CreateTripModal = ({ open, onClose, onCreateTrip }) => {
  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    startDate: null,
    endDate: null
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleDateChange = (field) => (date) => {
    setFormData({ ...formData, [field]: date });
    // Clear error for this field when user selects a date
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      try {
        onCreateTrip(formData);
        // Don't close the modal here - let the parent component close it after successful creation
      } catch (error) {
        console.error('Error in CreateTripModal handleSubmit:', error);
        // You could set an error state here to display to the user
      }
    }
  };

  const handleClose = () => {
    setFormData({
      tripName: '',
      destination: '',
      startDate: null,
      endDate: null
    });
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    return (
      formData.tripName.trim() &&
      formData.destination.trim() &&
      formData.startDate &&
      formData.endDate &&
      formData.startDate <= formData.endDate
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Create a New Trip</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Trip Name"
              placeholder="e.g., European Adventure"
              value={formData.tripName}
              onChange={handleChange('tripName')}
              error={!!errors.tripName}
              helperText={errors.tripName}
              required
            />

            <TextField
              fullWidth
              label="Destination"
              placeholder="e.g., Paris, France"
              value={formData.destination}
              onChange={handleChange('destination')}
              error={!!errors.destination}
              helperText={errors.destination}
              required
            />

            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={handleDateChange('startDate')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate
                }
              }}
            />

            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={handleDateChange('endDate')}
              minDate={formData.startDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.endDate,
                  helperText: errors.endDate
                }
              }}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Create Trip
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTripModal;