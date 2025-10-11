import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const navLinks = ['Home', 'Features', 'About Us', 'Contact'];

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side - App Name */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Planora
        </Typography>

        {/* Center - Navigation Links */}
        <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {navLinks.map((link) => (
            <Button
              key={link}
              color="inherit"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {link}
            </Button>
          ))}
        </Stack>

        {/* Right Side - Auth Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Sign Up
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;