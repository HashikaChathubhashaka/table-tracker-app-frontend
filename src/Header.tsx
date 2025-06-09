import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box} from '@mui/material';
const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#263238' }}>

<Toolbar>
  <Box sx={{ flexGrow: 1 }}>
    <Typography
    fontFamily={"Segoe UI"}
    // need to add bold font weight
      fontWeight="bold"
      variant="h4"
      component="div"
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        width: 'fit-content',
      }}
      onClick={() => navigate('/home')}
    >
      Table Tracker.
    </Typography>
  </Box>

  {isAuthenticated && (
    <Button
      variant="outlined"
      sx={{ marginLeft: 'auto', color: '#fff', borderColor: '#fff' }}
      color="inherit"        
      size="small"
      endIcon={<LogoutIcon />}
      onClick={() => { logout(); navigate('/'); }}
    >
      Log out
    </Button>
  )}
</Toolbar>


    </AppBar>
  );
};

export default Header;