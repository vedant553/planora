import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Stack, Divider, Collapse, Tooltip } from '@mui/material';
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

const TripSidebar = ({ trip, currentPage, onNavigate, isExpanded }) => {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    onNavigate(item.id);
    navigate(item.path);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Trip Header */}
      <Box sx={{ p: isExpanded ? 3 : 2, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isExpanded ? (
          <Box sx={{ width: '100%' }}>
            <Collapse in={isExpanded} orientation="horizontal" timeout={300}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                  {trip.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {trip.destination}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        ) : (
          <Tooltip title={`${trip.name} - ${trip.destination}`} placement="right">
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              {trip.name.charAt(0)}
            </Avatar>
          </Tooltip>
        )}
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currentPage === item.id;
          
          const button = (
            <ListItemButton
              key={item.id}
              selected={isSelected}
              onClick={() => handleNavigation(item)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                px: isExpanded ? 2 : 1,
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
              <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 'auto', justifyContent: 'center' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <Collapse in={isExpanded} orientation="horizontal" timeout={300}>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    ml: isExpanded ? 0 : 0,
                    whiteSpace: 'nowrap'
                  }} 
                />
              </Collapse>
            </ListItemButton>
          );

          return isExpanded ? (
            button
          ) : (
            <Tooltip key={item.id} title={item.label} placement="right">
              {button}
            </Tooltip>
          );
        })}
      </List>

      <Divider />

      {/* Members Section */}
      <Box sx={{ p: isExpanded ? 3 : 2, minHeight: 120 }}>
        {isExpanded ? (
          <Collapse in={isExpanded} orientation="horizontal" timeout={300}>
            <Box>
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
          </Collapse>
        ) : (
          <Stack spacing={1} alignItems="center">
            {trip.members.map((member) => (
              <Tooltip key={member.id} title={member.name} placement="right">
                <Avatar src={member.avatar} alt={member.name} sx={{ width: 32, height: 32 }} />
              </Tooltip>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default TripSidebar;