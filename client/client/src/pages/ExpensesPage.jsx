import { useState, useMemo, useEffect } from 'react';
import { Container, Typography, Button, Box, Card, CardContent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, CircularProgress } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import AddExpenseModal from '../components/AddExpenseModal';
import SettleUpModal from '../components/SettleUpModal';
import tripService from '../services/tripService';

const ExpensesPage = () => {
  const { currentTrip, initiateSettlement, confirmSettlement, loading } = useTrip();
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);
  const [balances, setBalances] = useState(null);

  // Fetch balances when currentTrip changes
  useEffect(() => {
    const fetchBalances = async () => {
      if (currentTrip?._id) {
        try {
          const balancesData = await tripService.getTripBalances(currentTrip._id);
          setBalances(balancesData);
        } catch (error) {
          console.error('Error fetching balances:', error);
          setBalances(null);
        }
      }
    };

    fetchBalances();
  }, [currentTrip]);

  // Calculate payment plan
  const paymentPlan = useMemo(() => {
    const members = currentTrip?.members || [];
    const balances = {};
    
    // Initialize balances
    members.forEach(member => {
      balances[member._id || member.id] = 0;
    });

    // Calculate balances from expenses
    currentTrip?.expenses?.forEach(expense => {
      // Handle backend data structure where splitDetails contains user IDs and amounts
      balances[expense.paidBy] += expense.amount;
      expense.splitDetails?.forEach(splitDetail => {
        balances[splitDetail.user] -= splitDetail.owes;
      });
    });

    // Create settlement transactions
    const settlements = [];
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([memberId, balance]) => {
      if (balance < -0.01) {
        debtors.push({ 
          member: members.find(m => (m._id || m.id) === memberId), 
          amount: Math.abs(balance) 
        });
      } else if (balance > 0.01) {
        creditors.push({ 
          member: members.find(m => (m._id || m.id) === memberId), 
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
  }, [currentTrip]);

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Calculate summary data from live data
  const totalGroupExpenses = currentTrip?.expenses?.reduce((total, expense) => total + expense.amount, 0) || 0;
  const userBalance = balances && user ? (balances[user._id] || 0) : 0;
  const youAreOwed = balances ? Object.values(balances).reduce((total, balance) => total + Math.max(0, balance), 0) : 0;

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
              {formatCurrency(totalGroupExpenses)}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            bgcolor: userBalance >= 0 ? 'success.light' : 'error.light'
          }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Your Balance
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(Math.abs(userBalance))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userBalance >= 0 ? 'You are owed' : 'You owe'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You Are Owed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(youAreOwed)}
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
            {currentTrip?.expenses?.map((expense) => {
              // Find the member who paid
              const paidByMember = currentTrip.members?.find(member => 
                (member._id || member.id) === expense.paidBy
              );
              
              // Find members who are part of the split
              const splitMembers = expense.splitDetails?.map(splitDetail => 
                currentTrip.members?.find(member => 
                  (member._id || member.id) === splitDetail.user
                )
              ).filter(Boolean) || [];

              return (
                <TableRow key={expense._id || expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={paidByMember?.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2">{paidByMember?.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={-1}>
                      {splitMembers.map((member) => (
                        <Avatar
                          key={member._id || member.id}
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
                      {expense.status || 'pending'}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {(!currentTrip?.expenses || currentTrip.expenses.length === 0) && (
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