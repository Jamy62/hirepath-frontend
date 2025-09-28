import { useMediaQuery, Box, Drawer } from '@mui/material';
import SidebarItems from './SidebarItems';
import logo from '../../../assets/images/logos/logo.jpg';

const MSidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const sidebarWidth = '270px';
  const collapsedSidebarWidth = '80px';

  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#eff2f7',
      borderRadius: '15px',
    },
  };

  const Logo = (
    <Box sx={{ p: 1.4, display: 'flex', justifyContent: 'center' }}>
      <img src={logo} alt="logo" width={170}/>
    </Box>
  );

  const SidebarContent = (
    <Box sx={{ height: '100%' }}>
      {Logo}
      <Box sx={{ p: 2 }}>
        <SidebarItems />
      </Box>
    </Box>
  );

  const SidebarContentMobile = (
    <Box sx={{ height: '100%' }}>
      {Logo}
      <Box sx={{ p: 2 }}>
        <SidebarItems />
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        variant="permanent"
        PaperProps={{
          sx: {
            width: props.isSidebarOpen ? sidebarWidth : collapsedSidebarWidth,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            border: '0',
            ...scrollbarStyles,
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      {SidebarContentMobile}
    </Drawer>
  );
};

export default MSidebar;