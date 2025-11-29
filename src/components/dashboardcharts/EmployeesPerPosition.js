import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Box, CircularProgress } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard.js';
import { useAuth } from 'src/contexts/AuthContext';

const EmployeesPerPosition = () => {
  const { apiClient, company } = useAuth();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    series: [],
    labels: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!company?.guid) return;

      try {
        const response = await apiClient.get(`/reports/employees-per-position/${company.guid}`);
        const data = response.data.data || [];

        setChartData({
          series: data.map(i => i.employeeCount),
          labels: data.map(i => i.positionName)
        });
      } catch (error) {
        console.error("Failed to fetch employees per position", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiClient, company]);

  const options = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 155,
    },
    labels: chartData.labels,
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.success.main
    ],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '70%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: true, position: 'bottom' },
  };

  return (
    <DashboardCard title="Employees per Position">
      {loading ? (
        <Box display="flex" justifyContent="center" p={3} height="250px" alignItems="center"><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Chart
              options={options}
              series={chartData.series}
              type="donut"
              height="250px"
            />
          </Grid>
        </Grid>
      )}
    </DashboardCard>
  );
};

export default EmployeesPerPosition;