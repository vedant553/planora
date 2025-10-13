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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTrip } from '../context/TripContext';

const AddActivityModal = ({ open, onClose, selectedDay }) => {
  const { currentTrip, addActivity } = useTrip();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    dateTime: null
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleDateTimeChange = (date) => {
    setFormData({ ...formData, dateTime: date });
    // Clear error for this field when user selects a date
    if (errors.dateTime) {
      setErrors({ ...errors, dateTime: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Date and time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDay = () => {
    if (selectedDay) {
      return selectedDay;
    }

    const tripStartDate = currentTrip?.startDate || currentTrip?.dates?.start;
    
    if (!formData.dateTime || !tripStartDate) {
      return 1;
    }

    const tripStart = new Date(tripStartDate);
    const activityDate = new Date(formData.dateTime);
    const diffTime = activityDate - tripStart;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays + 1);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const activityData = {
        tripId: currentTrip._id || currentTrip.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        dateTime: formData.dateTime.toISOString(),
        day: calculateDay(),
        type: 'activity' // Default type
      };

      try {
        await addActivity(activityData);
        handleClose();
      } catch (error) {
        console.error('Failed to add activity:', error);
        // You could set an error state here and display it to the user
      }
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      dateTime: null
    });
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    return formData.title.trim() && formData.dateTime;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add Activity</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              placeholder="e.g., Visit Eiffel Tower"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <TextField
              fullWidth
              label="Description"
              placeholder="Add details about the activity..."
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Location"
              placeholder="e.g., Champ de Mars, Paris"
              value={formData.location}
              onChange={handleChange('location')}
            />

            <DateTimePicker
              label="Date and Time"
              value={formData.dateTime}
              onChange={handleDateTimeChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.dateTime,
                  helperText: errors.dateTime
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
          Add Activity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityModal;