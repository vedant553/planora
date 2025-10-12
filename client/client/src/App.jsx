import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TripProvider } from './context/TripContext';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItineraryPage from './pages/ItineraryPage';
import ExpensesPage from './pages/ExpensesPage';
import VotingPage from './pages/VotingPage';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TripProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trip/*" element={
            <MainLayout>
              <Routes>
                <Route path="itinerary" element={<ItineraryPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="voting" element={<VotingPage />} />
                <Route path="overview" element={<ItineraryPage />} />
                <Route path="documents" element={<ItineraryPage />} />
                <Route path="settings" element={<ItineraryPage />} />
                <Route path="*" element={<Navigate to="itinerary" replace />} />
              </Routes>
            </MainLayout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TripProvider>
    </ThemeProvider>
  );
}

export default App;