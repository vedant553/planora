import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: DashboardOutlinedIcon, path: '/trip/overview' },
  { id: 'itinerary', label: 'Itinerary', icon: DateRangeOutlinedIcon, path: '/trip/itinerary' },
  { id: 'expenses', label: 'Expenses', icon: PaidOutlinedIcon, path: '/trip/expenses' },
  { id: 'voting', label: 'Voting', icon: ThumbUpOutlinedIcon, path: '/trip/voting' },
  { id: 'documents', label: 'Documents', icon: FolderOpenOutlinedIcon, path: '/trip/documents' },
  { id: 'settings', label: 'Settings', icon: SettingsOutlinedIcon, path: '/trip/settings' }
];

const TripSidebar = ({ trip, currentPage, onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    onNavigate(item.id);
    navigate(item.path);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Trip Header */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {trip.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {trip.destination}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currentPage === item.id;
          return (
            <ListItemButton
              key={item.id}
              selected={isSelected}
              onClick={() => handleNavigation(item)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      {/* Members Section */}
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Members
        </Typography>
        <Stack spacing={1.5}>
          {trip.members.map((member) => (
            <Stack key={member.id} direction="row" spacing={1.5} alignItems="center">
              <Avatar src={member.avatar} alt={member.name} sx={{ width: 32, height: 32 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                  {member.name}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default TripSidebar;