
import React from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthRegister from './auth/AuthRegister';

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">
    <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
      <Grid
        item
        lg={6}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // A different gradient for registration
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box p={4}>
          <Typography variant="h1" fontWeight={700} mb={2}>
            Create an Account
          </Typography>
          <Typography variant="h5">
            Join our community to unlock powerful project management tools.
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
          <AuthRegister
            subtext={
              <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                Your Social Campaigns
              </Typography>
            }
            subtitle={
              <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  Already have an Account?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/login"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Sign In
                </Typography>
              </Stack>
            }
          />
        </Card>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Register2;
