import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, CircularProgress, Stack, Avatar, Card, CardContent, Chip } from '@mui/material';
import { IconBriefcase, IconUsers, IconCrown, IconUserPlus, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard.js';
import { useAuth } from 'src/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import CompanyEmployeeGrowth from 'src/components/dashboardcharts/CompanyEmployeeGrowth';
import EmployeesPerPosition from 'src/components/dashboardcharts/EmployeesPerPosition';

const CompanyDashboard = () => {
  const { apiClient, company } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState(null);
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, employees: 0 });
  const [loading, setLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const planRes = await apiClient.get('/company-plan/active-plan');
        setActivePlan(planRes.data.data);

        const companyRes = await apiClient.get('/company/profile');
        setCompanyDetails(companyRes.data.data);

        const jobsRes = await apiClient.get('/job/list', { params: { companyGuid: company.guid } });
        const jobsCount = jobsRes.data.data ? jobsRes.data.data.length : 0;

        const appsRes = await apiClient.get('/application/list/company');
        const pendingApplicants = appsRes.data.data ? appsRes.data.data.filter(app => app.status === 'PENDING').length : 0;

        const empRes = await apiClient.get('/company-user/list');
        const empCount = empRes.data.data ? empRes.data.data.length : 0;

        setStats({ jobs: jobsCount, applicants: pendingApplicants, employees: empCount });
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    if (company) init();
  }, [company, apiClient]);

  const getVerificationChip = (status) => {
    switch (status) {
      case 'TRUE':
        return <Chip label="Verified" color="success" size="small" icon={<IconCheck size={16} />} />;
      case 'PENDING':
        return <Chip label="Verification Pending" color="warning" size="small" icon={<IconAlertCircle size={16} />} />;
      case 'FALSE':
      default:
        return <Chip label="Not Verified" color="error" size="small" icon={<IconAlertCircle size={16} />} />;
    }
  };

  if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <PageContainer title={t('dashboard')} description={t('company_overview')}>
      <Box>
        <Card sx={{ mb: 3, bgcolor: activePlan ? 'primary.light' : 'grey.100', color: activePlan ? 'primary.main' : 'text.secondary' }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" gutterBottom display="flex" alignItems="center">
                <IconCrown size={24} style={{ marginRight: 8 }} />
                {t('current_plan')}: <b>{activePlan ? activePlan.plan : t('free_tier')}</b>
              </Typography>
              {activePlan ? (
                <Typography variant="body2">
                  {t('valid_until')}: {new Date(activePlan.endDate).toLocaleDateString()}
                </Typography>
              ) : (
                <Typography variant="body2">{t('free_plan_description')}</Typography>
              )}
            </Box>
            <Chip
              label={activePlan ? t('active') : t('free')}
              color={activePlan ? "success" : "default"}
              sx={{ fontWeight: 'bold' }}
            />
          </CardContent>
        </Card>

        {companyDetails && companyDetails.verificationStatus !== 'TRUE' && (
          <Card sx={{ mb: 3, bgcolor: companyDetails.verificationStatus === 'PENDING' ? 'warning.light' : 'error.light', color: companyDetails.verificationStatus === 'PENDING' ? 'warning.main' : 'error.main' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" gutterBottom display="flex" alignItems="center">
                  <IconAlertCircle size={24} style={{ marginRight: 8 }} />
                  Verification Status: {getVerificationChip(companyDetails.verificationStatus)}
                </Typography>
                {companyDetails.verificationStatus === 'PENDING' ? (
                  <Typography variant="body2">Your company verification request is pending review.</Typography>
                ) : (
                  <Typography variant="body2">Your company is not yet verified. Please submit your details for verification.</Typography>
                )}
              </Box>
              {companyDetails.verificationStatus === 'FALSE' && (
                <Button variant="contained" color="primary" onClick={() => navigate('/company/verify')}>
                  Verify Now
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>

          <Grid item xs={12} sm={4}>
            <DashboardCard>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 48, height: 48 }}>
                  <IconBriefcase size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="700">{stats.jobs}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">{t('active_jobs')}</Typography>
                </Box>
              </Stack>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={4}>
            <DashboardCard>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 48, height: 48 }}>
                  <IconUsers size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="700">{stats.employees}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">{t('total_employees')}</Typography>
                </Box>
              </Stack>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={4}>
            <DashboardCard>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 48, height: 48 }}>
                  <IconUserPlus size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="700">{stats.applicants}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">{t('total_applicants')}</Typography>
                </Box>
              </Stack>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} lg={8}>
            <CompanyEmployeeGrowth />
          </Grid>

          <Grid item xs={12} lg={4}>
            <EmployeesPerPosition />
          </Grid>

        </Grid>
      </Box>
    </PageContainer>
  );
};

export default CompanyDashboard;