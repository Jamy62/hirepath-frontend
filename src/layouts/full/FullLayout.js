import { useState } from "react";
import { styled, Container, Box, Typography, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { useAuth } from "src/contexts/AuthContext";
import AdminMenuItems from "./sidebar/menuitems/AdminMenuItems.js";
import CompanyMenuItems from "./sidebar/menuitems/CompanyMenuItems.js";
import UserMenuItems from "./sidebar/menuitems/UserMenuItems.js";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
  minWidth: 0,
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const { role, companyRole } = useAuth();
  const sidebarWidth = '300px';
  const collapsedSidebarWidth = '80px';

  let currentMenu = [];

  if (role === 'COMPANY') {
    currentMenu = CompanyMenuItems.filter(item => {
      if (item.title === 'Subscription' || item.title === 'Positions') {
        return companyRole === 'COMPANY_OWNER'
      }
      else if (item.title === 'Applicants') {
        return companyRole === 'COMPANY_OWNER' || companyRole === 'COMPANY_ADMIN';
      }
      return true;
    });
  }
  else if (role === "ADMIN") currentMenu = AdminMenuItems;
  else if (role === "COMPANY") currentMenu = CompanyMenuItems;
  else currentMenu = UserMenuItems;

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        menuItems={currentMenu}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(lgUp && {
            marginLeft: isSidebarOpen ? sidebarWidth : collapsedSidebarWidth,
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            <Outlet />
          </Box>

          <Box sx={{ pt: 6, pb: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              © 2025 HirePath. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;