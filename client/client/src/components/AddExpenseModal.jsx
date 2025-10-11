import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Avatar,
  Divider,
  Checkbox
} from '@mui/material';
import { useTrip } from '../context/TripContext';

const AddExpenseModal = ({ open, onClose }) => {
  const { currentTrip, addExpense } = useTrip();
  const members = currentTrip?.members || [];

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitMethod: 'equal'
  });

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [customSplits, setCustomSplits] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize selected members when modal opens
  useEffect(() => {
    if (open && members.length > 0) {
      setSelectedMembers(members.map(m => m.id));
      setFormData(prev => ({
        ...prev,
        paidBy: members[0]?.id || ''
      }));
    }
  }, [open, members]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSplitMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setFormData({ ...formData, splitMethod: newMethod });
      // Reset custom splits when switching to equal
      if (newMethod === 'equal') {
        setCustomSplits({});
      }
    }
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleCustomSplitChange = (memberId) => (event) => {
    const value = event.target.value;
    setCustomSplits(prev => ({
      ...prev,
      [memberId]: value === '' ? '' : parseFloat(value) || 0
    }));
  };

  const calculateEqualSplit = () => {
    const amount = parseFloat(formData.amount) || 0;
    const count = selectedMembers.length;
    return count > 0 ? (amount / count).toFixed(2) : '0.00';
  };

  const getTotalCustomSplit = () => {
    return selectedMembers.reduce((sum, memberId) => {
      return sum + (parseFloat(customSplits[memberId]) || 0);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.paidBy) {
      newErrors.paidBy = 'Please select who paid';
    }

    if (selectedMembers.length === 0) {
      newErrors.split = 'Please select at least one member to split with';
    }

    if (formData.splitMethod === 'unequal') {
      const totalSplit = getTotalCustomSplit();
      const amount = parseFloat(formData.amount) || 0;
      if (Math.abs(totalSplit - amount) > 0.01) {
        newErrors.split = `Split amounts must total ${amount.toFixed(2)}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const paidByMember = members.find(m => m.id === formData.paidBy);
      const splitBetweenMembers = members.filter(m => selectedMembers.includes(m.id));

      const expenseData = {
        tripId: currentTrip.id,
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: paidByMember,
        splitBetween: splitBetweenMembers,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      addExpense(expenseData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      amount: '',
      paidBy: members[0]?.id || '',
      splitMethod: 'equal'
    });
    setSelectedMembers(members.map(m => m.id));
    setCustomSplits({});
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    if (!formData.description.trim() || !formData.amount || !formData.paidBy || selectedMembers.length === 0) {
      return false;
    }

    if (formData.splitMethod === 'unequal') {
      const totalSplit = getTotalCustomSplit();
      const amount = parseFloat(formData.amount) || 0;
      return Math.abs(totalSplit - amount) < 0.01;
    }

    return true;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Expense</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            placeholder="e.g., Dinner at restaurant"
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            required
          />

          {/* Amount */}
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={handleChange('amount')}
            error={!!errors.amount}
            helperText={errors.amount}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            inputProps={{
              min: 0,
              step: 0.01
            }}
          />

          {/* Paid By */}
          <FormControl fullWidth required error={!!errors.paidBy}>
            <InputLabel>Paid By</InputLabel>
            <Select
              value={formData.paidBy}
              onChange={handleChange('paidBy')}
              label="Paid By"
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={member.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography>{member.name}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {errors.paidBy && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.paidBy}
              </Typography>
            )}
          </FormControl>

          <Divider />

          {/* Split Method */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Split Method
            </Typography>
            <ToggleButtonGroup
              value={formData.splitMethod}
              exclusive
              onChange={handleSplitMethodChange}
              fullWidth
              color="primary"
            >
              <ToggleButton value="equal">Split Equally</ToggleButton>
              <ToggleButton value="unequal">Split Unequally</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Member List */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Split Between
            </Typography>
            <Stack spacing={1.5}>
              {members.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                const equalAmount = calculateEqualSplit();

                return (
                  <Box
                    key={member.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: isSelected ? 'action.selected' : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider'
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleMemberToggle(member.id)}
                      />
                      <Avatar src={member.avatar} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2">{member.name}</Typography>
                    </Stack>

                    {isSelected && (
                      <Box sx={{ minWidth: 100 }}>
                        {formData.splitMethod === 'equal' ? (
                          <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                            ${equalAmount}
                          </Typography>
                        ) : (
                          <TextField
                            size="small"
                            type="number"
                            value={customSplits[member.id] || ''}
                            onChange={handleCustomSplitChange(member.id)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            inputProps={{
                              min: 0,
                              step: 0.01
                            }}
                            sx={{ width: 100 }}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
            {errors.split && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.split}
              </Typography>
            )}
          </Box>

          {/* Total Display for Unequal Split */}
          {formData.splitMethod === 'unequal' && selectedMembers.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'grey.100',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Total Split:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: Math.abs(getTotalCustomSplit() - parseFloat(formData.amount || 0)) < 0.01
                    ? 'success.main'
                    : 'error.main'
                }}
              >
                ${getTotalCustomSplit().toFixed(2)} / ${parseFloat(formData.amount || 0).toFixed(2)}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Add Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;