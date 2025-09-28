import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// dashboard
import SalesOverview from '../../../components/dashboard/SalesOverview.js';
import YearlyBreakup from '../../../components/dashboard/YearlyBreakup.js';
import RecentTransactions from '../../../components/dashboard/RecentTransactions.js';
import ProductPerformance from '../../../components/dashboard/ProductPerformance.js';
import Blog from '../../../components/dashboard/Blog.js';
import MonthlyEarnings from '../../../components/dashboard/MonthlyEarnings.js';


const Dashboard = () => {
  return (
    <PageContainer title="Users" description="this is Users">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
