import { Box, Drawer } from '@mui/material';
import TripSidebar from '../components/TripSidebar';
import { useTrip } from '../context/TripContext';
import { useState } from 'react';

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const MainLayout = ({ children }) => {
  const { currentTrip } = useTrip();
  const [currentPage, setCurrentPage] = useState('itinerary');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarExpanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
              width: sidebarExpanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: 'width 0.3s ease',
              overflowX: 'hidden'
            }
          }}
        >
          <TripSidebar 
            trip={currentTrip} 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            isExpanded={sidebarExpanded}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginLeft: 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;