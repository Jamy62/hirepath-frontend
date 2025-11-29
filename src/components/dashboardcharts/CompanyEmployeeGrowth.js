import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard.js';
import { useAuth } from 'src/contexts/AuthContext';

const CompanyEmployeeGrowth = () => {
  const { apiClient, company } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    categories: [],
    data: []
  });

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  useEffect(() => {
    const fetchData = async () => {
      if (!company?.guid) return;

      try {
        const response = await apiClient.get(`/reports/company-employee-growth/${company.guid}`);
        const data = response.data.data || [];

        const categories = data.map(item => new Date(item.date).toLocaleDateString());
        const counts = data.map(item => item.employeeCount);

        setChartData({ categories, data: counts });
      } catch (error) {
        console.error("Failed to fetch employee growth", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiClient, company]);

  const options = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 370,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '42%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const series = [
    {
      name: 'Employees',
      data: chartData.data,
    },
  ];

  return (
    <DashboardCard title="Employee Growth">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="370px">
          <CircularProgress />
        </Box>
      ) : (
        <Chart
          options={options}
          series={series}
          type="bar"
          height="370px"
        />
      )}
    </DashboardCard>
  );
};

export default CompanyEmployeeGrowth;