import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import UserGrowth from 'src/components/dashboardcharts/UserGrowth.js';
import TrendingIndustries from 'src/components/dashboardcharts/TrendingIndustries';
import {
  MostPopularJobs,
  MostPopularCompanies,
  MostActiveUsers,
  JobSuccessRates
} from 'src/components/dashboardcharts/ReportTables.js';

const Dashboard = () => {
  return (
    <PageContainer title="Admin Dashboard" description="Statistical Reports">
      <Box>
        <Grid container spacing={3}>

          <Grid item xs={12} lg={8}>
            <UserGrowth />
          </Grid>

          <Grid item xs={12} lg={4}>
            <TrendingIndustries />
          </Grid>

          <Grid item xs={12} lg={6}>
            <MostPopularCompanies />
          </Grid>

          <Grid item xs={12} lg={6}>
            <JobSuccessRates />
          </Grid>

          <Grid item xs={12} lg={6}>
            <MostPopularJobs />
          </Grid>

          <Grid item xs={12} lg={6}>
            <MostActiveUsers />
          </Grid>

        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;