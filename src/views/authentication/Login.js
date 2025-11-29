import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import logo from 'src/assets/images/logos/logo.jpg';
import AuthLogin from './auth/AuthLogin.js';

const Login2 = () => {
  return (
    <PageContainer title="Login" description="HirePath Login">
      <Grid container spacing={0} sx={{ height: '100vh' }}>

        {/* Left Side - Different Gradient & Content */}
        <Grid
          item
          lg={6}
          sx={{
            display: { xs: 'none', lg: 'flex' },
            background: 'linear-gradient(135deg, #1e88e5 0%, #3949ab 100%)', // Lighter Blue-Indigo gradient
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Box p={4}>
            <Typography variant="h1" fontWeight={700} mb={2}>
              Welcome Back
            </Typography>
            <Typography variant="h5">
              Sign in to access your HirePath dashboard and continue your journey.
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid
          item
          xs={12}
          lg={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <img src={logo} alt="HirePath" width={170} />
            </Box>
            <AuthLogin
              subtext={
                <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                  Access your account
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="500">
                    New to HirePath?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/auth/register"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Create an account
                  </Typography>
                </Stack>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login2;