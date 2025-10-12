import { useState, useMemo } from 'react';
import { Container, Typography, Button, Box, Card, CardContent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import AddExpenseModal from '../components/AddExpenseModal';
import SettleUpModal from '../components/SettleUpModal';

const ExpensesPage = () => {
  const { expenses, expenseSummary, currentTrip, initiateSettlement, confirmSettlement } = useTrip();
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);

  // Calculate payment plan
  const paymentPlan = useMemo(() => {
    const members = currentTrip?.members || [];
    const balances = {};
    
    // Initialize balances
    members.forEach(member => {
      balances[member.id] = 0;
    });

    // Calculate balances from expenses
    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      balances[expense.paidBy.id] += expense.amount;
      expense.splitBetween.forEach(member => {
        balances[member.id] -= splitAmount;
      });
    });

    // Create settlement transactions
    const settlements = [];
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([memberId, balance]) => {
      if (balance < -0.01) {
        debtors.push({ 
          member: members.find(m => m.id === memberId), 
          amount: Math.abs(balance) 
        });
      } else if (balance > 0.01) {
        creditors.push({ 
          member: members.find(m => m.id === memberId), 
          amount: balance 
        });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      if (amount > 0.01) {
        settlements.push({
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
  }, [expenses, currentTrip]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Expenses
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => setIsSettleUpModalOpen(true)}>
            Settle Up
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlinedIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Expense
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }} flexWrap="wrap">
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total Group Expenses
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(expenseSummary.totalGroupExpenses)}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            bgcolor: expenseSummary.yourBalance >= 0 ? 'success.light' : 'error.light'
          }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Your Balance
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(Math.abs(expenseSummary.yourBalance))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {expenseSummary.yourBalance >= 0 ? 'You are owed' : 'You owe'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You Are Owed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(expenseSummary.youAreOwed)}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Expenses Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Paid By</TableCell>
              <TableCell>Split Between</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(expense.amount)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={expense.paidBy.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2">{expense.paidBy.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={-1}>
                    {expense.splitBetween.map((member) => (
                      <Avatar
                        key={member.id}
                        src={member.avatar}
                        sx={{ width: 24, height: 24, border: '2px solid white' }}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: expense.status === 'settled' ? 'success.light' : 'warning.light',
                      color: expense.status === 'settled' ? 'success.dark' : 'warning.dark',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  >
                    {expense.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {expenses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No expenses recorded
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlinedIcon />}
            sx={{ mt: 2 }}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add First Expense
          </Button>
        </Box>
      )}

      <AddExpenseModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <SettleUpModal
        open={isSettleUpModalOpen}
        onClose={() => setIsSettleUpModalOpen(false)}
        tripData={currentTrip}
        currentUser={user}
        paymentPlan={paymentPlan}
        onInitiatePayment={initiateSettlement}
        onConfirmPayment={confirmSettlement}
      />
    </Container>
  );
};

export default ExpensesPage;