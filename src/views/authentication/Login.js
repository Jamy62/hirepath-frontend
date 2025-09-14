
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './auth/AuthLogin.js';

const Login2 = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ height: '100vh' }}>
        <Grid
          item
          lg={6}
          sx={{
            display: { xs: 'none', lg: 'flex' }, // Hidden on mobile, visible on desktop
            background: 'linear-gradient(135deg, #0A2749 30%, #007BFF 100%)',
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
              Sign in to access your powerful dashboard.
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          lg={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Logo />
            </Box>
            <AuthLogin
              subtext={
                <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                  Your Social Campaigns
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="500">
                    New to Modernize?
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
