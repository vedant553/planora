import { Box, Drawer } from '@mui/material';
import TripSidebar from '../components/TripSidebar';
import { useTrip } from '../context/TripContext';
import { useState } from 'react';

const DRAWER_WIDTH = 280;

const MainLayout = ({ children }) => {
  const { currentTrip } = useTrip();
  const [currentPage, setCurrentPage] = useState('itinerary');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <TripSidebar 
          trip={currentTrip} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;