import { Box, Drawer, Button } from '@mui/material';
import TripSidebar from '../components/TripSidebar';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const MainLayout = ({ children }) => {
  const { currentTrip } = useTrip();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top bar with logout button */}
      <Box 
        sx={{
          height: 64,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Button variant="contained" onClick={logout}>
          Logout
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
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
                overflowX: 'hidden',
                top: 64, // Adjust top to account for the top bar
                height: 'calc(100vh - 64px)',
              }
            }}
          >
            <TripSidebar 
              trip={currentTrip} 
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
            transition: 'margin-left 0.3s ease',
            marginTop: '64px', // Add margin to avoid overlap with top bar
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;