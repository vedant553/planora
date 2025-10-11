import { useState } from 'react';
import { Container, Typography, Button, Box, Card, CardContent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useTrip } from '../context/TripContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import AddExpenseModal from '../components/AddExpenseModal';
import SettleUpModal from '../components/SettleUpModal';

const ExpensesPage = () => {
  const { expenses, expenseSummary, currentTrip } = useTrip();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);

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
        expenses={expenses}
        members={currentTrip?.members || []}
      />
    </Container>
  );
};

export default ExpensesPage;