import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Avatar,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatCurrency } from '../utils/formatters';

const SettleUpModal = ({ open, onClose, tripData, currentUser, paymentPlan, onInitiatePayment, onConfirmPayment }) => {
  // Calculate outstanding debts (not yet initiated)
  const getOutstandingDebts = () => {
    if (!paymentPlan || !tripData?.settlements) return paymentPlan || [];
    
    const initiatedSettlements = new Set(
      tripData.settlements.map(s => `${s.from._id || s.from.id}-${s.to._id || s.to.id}`)
    );
    
    return paymentPlan.filter(debt => {
      const debtKey = `${debt.from._id || debt.from.id}-${debt.to._id || debt.to.id}`;
      return !initiatedSettlements.has(debtKey);
    });
  };

  const outstandingDebts = getOutstandingDebts();
  const settlements = tripData?.settlements || [];

  const handleInitiatePayment = (debt) => {
    if (onInitiatePayment) {
      onInitiatePayment(debt);
    }
  };

  const handleConfirmPayment = (settlement) => {
    if (onConfirmPayment) {
      onConfirmPayment(settlement);
    }
  };

  const isCurrentUserPayer = (debt) => {
    const userId = currentUser?._id || currentUser?.id;
    const fromId = debt.from._id || debt.from.id;
    return userId === fromId;
  };

  const isCurrentUserPayee = (settlement) => {
    const userId = currentUser?._id || currentUser?.id;
    const toId = settlement.to._id || settlement.to.id;
    return userId === toId;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Settle Up Payments</DialogTitle>
      <DialogContent>
        {/* Section 1: Outstanding Debts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Outstanding Debts
          </Typography>
          
          {outstandingDebts.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              {outstandingDebts.map((debt, index) => {
                const isPayer = isCurrentUserPayer(debt);
                const fromName = debt.from.name;
                const toName = debt.to.name;
                const displayText = isPayer 
                  ? `You owe ${toName} ${formatCurrency(debt.amount)}`
                  : `${fromName} owes ${toName} ${formatCurrency(debt.amount)}`;

                return (
                  <Box key={`${debt.from.id}-${debt.to.id}-${index}`}>
                    {index > 0 && <Divider />}
                    <ListItem sx={{ py: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Avatar src={debt.from.avatar} sx={{ width: 40, height: 40 }} />
                        <Box sx={{ flex: 1 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1">
                                {displayText}
                              </Typography>
                            }
                          />
                        </Box>
                        <Avatar src={debt.to.avatar} sx={{ width: 40, height: 40 }} />
                      </Stack>
                      {isPayer && (
                        <ListItemSecondaryAction>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleInitiatePayment(debt)}
                          >
                            I Have Paid
                          </Button>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No outstanding debts
              </Typography>
            </Box>
          )}
        </Box>

        {/* Section 2: Pending & Confirmed Settlements */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Pending & Confirmed Settlements
          </Typography>
          
          {settlements.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              {settlements.map((settlement, index) => {
                const isPayer = isCurrentUserPayer(settlement);
                const isPayee = isCurrentUserPayee(settlement);
                const fromName = settlement.from.name;
                const toName = settlement.to.name;
                const displayText = isPayer
                  ? `You paid ${toName} ${formatCurrency(settlement.amount)}`
                  : isPayee
                  ? `${fromName} paid you ${formatCurrency(settlement.amount)}`
                  : `${fromName} paid ${toName} ${formatCurrency(settlement.amount)}`;

                return (
                  <Box key={settlement._id || settlement.id || index}>
                    {index > 0 && <Divider />}
                    <ListItem sx={{ py: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Avatar src={settlement.from.avatar} sx={{ width: 40, height: 40 }} />
                        <Box sx={{ flex: 1 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1">
                                {displayText}
                              </Typography>
                            }
                          />
                        </Box>
                        <Avatar src={settlement.to.avatar} sx={{ width: 40, height: 40 }} />
                      </Stack>
                      <ListItemSecondaryAction>
                        {settlement.status === 'pending' && (
                          <>
                            {isPayer && (
                              <Button
                                variant="outlined"
                                size="small"
                                disabled
                              >
                                Awaiting Confirmation
                              </Button>
                            )}
                            {isPayee && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => handleConfirmPayment(settlement)}
                              >
                                Confirm Payment
                              </Button>
                            )}
                            {!isPayer && !isPayee && (
                              <Chip
                                label="Pending"
                                size="small"
                                color="warning"
                              />
                            )}
                          </>
                        )}
                        {settlement.status === 'confirmed' && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Settled"
                            size="small"
                            color="success"
                          />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No pending or confirmed settlements
              </Typography>
            </Box>
          )}
        </Box>

        {outstandingDebts.length === 0 && settlements.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              All expenses are settled! 🎉
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettleUpModal;