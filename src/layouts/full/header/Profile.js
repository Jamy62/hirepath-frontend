import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText, Typography
} from '@mui/material';
import {IconBuilding, IconListCheck, IconMail, IconUser} from '@tabler/icons-react';
import DefaultProfile from 'src/assets/images/profile/profile.jpg';
import { useAuth } from "src/contexts/AuthContext.js";

const Profile = () => {
  const { logout, userImageUrl, role, companyRole, company, switchBackToUser, token } = useAuth();
  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = useState(null);

  let profileLink;
  let profileLabel;
  let ProfileIcon;

  if (role === 'COMPANY') {
    if (companyRole === 'COMPANY_OWNER' || companyRole === 'COMPANY_ADMIN') {
      profileLink = '/company/profile';
      profileLabel = 'Company Profile';
    }
    else {
      profileLink = `/company/profile/guest/${company?.guid}`;
      profileLabel = 'Company Profile (View Only)';
    }

    ProfileIcon = IconBuilding;
  }
  else {
    profileLink = '/user/profile';
    profileLabel = 'My Profile';
    ProfileIcon = IconUser;
  }

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleSwitchBack = async () => {
    await switchBackToUser();
    navigate('/user/profile');
    window.location.reload();
  };

  const handleLogout = async () => {
    logout();
    navigate('/');
  }

  const handleLogin = () => {
    navigate('/auth/login');
  }

  if (!token) {
    return (
      <Box>
        <Button onClick={handleLogin} variant="outlined" color="primary">
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <IconButton
        size="medium"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={userImageUrl}
          alt={DefaultProfile}
          sx={{
            width: 40,
            height: 40,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem
          component={Link}
          to={profileLink}
          onClick={handleClose2}>
          <ListItemIcon>
            <ProfileIcon width={20} />
          </ListItemIcon>
          <ListItemText>{profileLabel}</ListItemText>
        </MenuItem>

        {role === 'COMPANY' && (
          <MenuItem onClick={handleSwitchBack}>
            <ListItemIcon>
              <IconMail width={20} />
            </ListItemIcon>
            <ListItemText>Switch to User</ListItemText>
          </MenuItem>
        )}
        <Box mt={1} py={1} px={2}>
          <Button onClick={handleLogout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;