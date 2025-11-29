import React from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import logo from 'src/assets/images/logos/logo.jpg';
import AuthRegister from './auth/AuthRegister';

const Register2 = () => (
  <PageContainer title="Register" description="HirePath Registration">
    <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
      <Grid
        item
        lg={6}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          background: 'linear-gradient(135deg, #1e88e5 0%, #5e35b1 100%)', // Updated to Blue-Purple gradient
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box p={4}>
          <Typography variant="h1" fontWeight={700} mb={2}>
            Join HirePath Today
          </Typography>
          <Typography variant="h5">
            Create your profile to find jobs or hire the best talent.
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
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <img src={logo} alt="HirePath" width={170} />
          </Box>
          <AuthRegister
            subtext={
              <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                Start your journey with us
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