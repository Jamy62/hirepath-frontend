import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Typography, Avatar, Stack,
  LinearProgress, Chip, Card, CardContent, CardMedia, Divider
} from '@mui/material';
import {
  IconMail, IconPhone, IconWorld, IconBuilding,
  IconCheck, IconAlertCircle
} from '@tabler/icons-react';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import { useAuth } from 'src/contexts/AuthContext';

const CompanyProfileGuest = () => {
  const { companyGuid } = useParams();
  const { apiClient } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);

  const fetchCompanyData = async () => {
    try {
      const res = await apiClient.get(`/company/detail/${companyGuid}`);
      const data = res.data.data;
      setCompanyData(data);

      const timestamp = new Date().getTime();
      if (data.logo) setLogoUrl(`https://jamydev.com/v1/files/download/logo/${data.logo}?t=${timestamp}`);
      if (data.banner) setBannerUrl(`https://jamydev.com/v1/files/download/banner/${data.banner}?t=${timestamp}`);

      setLocations(data.locations || []);
    } catch (err) {
      console.error("Profile load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyGuid) {
      fetchCompanyData();
    }
  }, [companyGuid]);

  if (loading && !companyData) return <LinearProgress />;
  if (!companyData) return <Typography>{t('company_not_found')}</Typography>;

  return (
    <PageContainer title={t('company_profile')} description={t('guest_view_of_company_profile')}>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ height: '180px', background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : 'linear-gradient(90deg, #0A2749 0%, #007BFF 100%)', position: 'relative' }} />
            <Box sx={{ px: 3, pb: 3, mt: -5, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <Avatar src={logoUrl} sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: 2, bgcolor: 'white' }}>
                  <IconBuilding size={60} color="#ccc" />
                </Avatar>
                <Box sx={{ mb: 2, width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Box>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="h4" fontWeight="700">{companyData?.name}</Typography>
                        {companyData?.verificationStatus === 'TRUE' && <Chip icon={<IconCheck size={16}/>} label={t('verified')} color="success" size="small" />}
                        {companyData?.verificationStatus === 'PENDING' && <Chip icon={<IconAlertCircle size={16}/>} label={t('pending')} color="warning" size="small" />}
                      </Stack>
                      <Typography variant="body1" color="textSecondary">{companyData?.publicName}</Typography>
                      <Stack direction="row" spacing={3} mt={1} color="textSecondary">
                        <Box display="flex" gap={0.5}><IconMail size={18} /><Typography variant="body2">{companyData?.email}</Typography></Box>
                        <Box display="flex" gap={0.5}><IconPhone size={18} /><Typography variant="body2">{companyData?.phone || '-'}</Typography></Box>
                        <Box display="flex" gap={0.5}><IconWorld size={18} /><Typography variant="body2" component="a" href={companyData?.website} target="_blank">{companyData?.website || '-'}</Typography></Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </BlankCard>
        </Grid>

        <Grid item xs={12}>
          <DashboardCard title={t('company_details')}>
            <Typography variant="body2" color="textSecondary" paragraph>
              {companyData?.description || t('no_description_provided')}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}><Typography variant="subtitle2" fontWeight={600}>{t('legal_name')}</Typography><Typography variant="body2">{companyData?.legalBusinessName || '-'}</Typography></Grid>
              <Grid item xs={12} md={3}><Typography variant="subtitle2" fontWeight={600}>{t('business_type')}</Typography><Typography variant="body2">{companyData?.businessType || '-'}</Typography></Grid>
              <Grid item xs={12} md={3}><Typography variant="subtitle2" fontWeight={600}>{t('company_size')}</Typography><Typography variant="body2">{companyData?.companySize || '-'}</Typography></Grid>
              <Grid item xs={12} md={3}><Typography variant="subtitle2" fontWeight={600}>{t('founded')}</Typography><Typography variant="body2">{companyData?.foundedDate ? new Date(companyData.foundedDate).getFullYear() : '-'}</Typography></Grid>
            </Grid>
          </DashboardCard>
        </Grid>

        <Grid item xs={12}>
          <DashboardCard title={t('locations')}>
            <Grid container spacing={2}>
              {locations.map((loc) => (
                <Grid item xs={12} sm={6} md={4} key={loc.guid}>
                  <Card variant="outlined">
                    <CardMedia component="img" height="140" image={loc.photo ? `https://jamydev.com/v1/files/download/location/${loc.photo}` : 'https://via.placeholder.com/300x140'} alt={loc.name} />
                    <CardContent>
                      <Typography variant="h6">{loc.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{loc.address}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {locations.length === 0 && <Typography color="textSecondary" p={2}>{t('no_locations_added')}</Typography>}
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default CompanyProfileGuest;