import { Box, Toolbar, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 Travel Buddy Planner. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={3}>
          <Link
            href="#"
            underline="hover"
            color="text.secondary"
            sx={{
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            underline="hover"
            color="text.secondary"
            sx={{
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Terms of Service
          </Link>
        </Stack>
      </Toolbar>
    </Box>
  );
};

export default Footer;