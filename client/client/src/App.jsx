import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TripProvider } from './context/TripContext';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TripWorkspacePage from './pages/TripWorkspacePage';
import ItineraryPage from './pages/ItineraryPage';
import ExpensesPage from './pages/ExpensesPage';
import VotingPage from './pages/VotingPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trips/:tripId/*" 
          element={
            <ProtectedRoute>
              <TripProvider>
                <TripWorkspacePage />
              </TripProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="itinerary" replace />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="voting" element={<VotingPage />} />
          <Route path="overview" element={<ItineraryPage />} />
          <Route path="documents" element={<ItineraryPage />} />
          <Route path="settings" element={<ItineraryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;