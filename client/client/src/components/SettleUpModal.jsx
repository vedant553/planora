import { useState } from 'react';
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
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { formatCurrency } from '../utils/formatters';

const SettleUpModal = ({ open, onClose, expenses, members }) => {
  const [paidSettlements, setPaidSettlements] = useState(new Set());

  // Calculate who owes whom
  const calculateSettlements = () => {
    // Create a balance map for each member
    const balances = {};
    
    // Initialize balances
    members.forEach(member => {
      balances[member.id] = 0;
    });

    // Calculate balances from expenses
    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      
      // The payer gets credited
      balances[expense.paidBy.id] += expense.amount;
      
      // Each person in the split gets debited
      expense.splitBetween.forEach(member => {
        balances[member.id] -= splitAmount;
      });
    });

    // Create settlement transactions
    const settlements = [];
    const debtors = [];
    const creditors = [];

    // Separate debtors and creditors
    Object.entries(balances).forEach(([memberId, balance]) => {
      if (balance < -0.01) { // owes money
        debtors.push({ 
          member: members.find(m => m.id === memberId), 
          amount: Math.abs(balance) 
        });
      } else if (balance > 0.01) { // is owed money
        creditors.push({ 
          member: members.find(m => m.id === memberId), 
          amount: balance 
        });
      }
    });

    // Sort by amount (largest first) for optimal settlement
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    // Create settlements using greedy algorithm
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      if (amount > 0.01) {
        settlements.push({
          id: `${debtor.member.id}-${creditor.member.id}`,
          from: debtor.member,
          to: creditor.member,
          amount: amount
        });
      }

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  const handleMarkAsPaid = (settlementId) => {
    setPaidSettlements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(settlementId)) {
        newSet.delete(settlementId);
      } else {
        newSet.add(settlementId);
      }
      return newSet;
    });
  };

  const handleClose = () => {
    setPaidSettlements(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Settle Up Payments</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Here is the simplest way to settle all debts for the trip.
        </Typography>

        {settlements.length > 0 ? (
          <List sx={{ bgcolor: 'background.paper' }}>
            {settlements.map((settlement, index) => {
              const isPaid = paidSettlements.has(settlement.id);
              
              return (
                <Box key={settlement.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      py: 2,
                      opacity: isPaid ? 0.6 : 1,
                      textDecoration: isPaid ? 'line-through' : 'none'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                      <Avatar src={settlement.from.avatar} sx={{ width: 40, height: 40 }} />
                      <Box sx={{ flex: 1 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body1">
                              <strong>{settlement.from.name}</strong> needs to pay{' '}
                              <strong>{settlement.to.name}</strong>
                            </Typography>
                          }
                          secondary={
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mt: 0.5 }}>
                              {formatCurrency(settlement.amount)}
                            </Typography>
                          }
                        />
                      </Box>
                      <Avatar src={settlement.to.avatar} sx={{ width: 40, height: 40 }} />
                    </Stack>
                    <ListItemSecondaryAction>
                      <Button
                        variant={isPaid ? 'outlined' : 'contained'}
                        size="small"
                        startIcon={isPaid ? <CheckCircleOutlineIcon /> : null}
                        onClick={() => handleMarkAsPaid(settlement.id)}
                        color={isPaid ? 'success' : 'primary'}
                      >
                        {isPaid ? 'Paid' : 'Mark as Paid'}
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              );
            })}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              All expenses are settled! 🎉
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettleUpModal;