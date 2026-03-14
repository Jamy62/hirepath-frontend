import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Typography, Chip, Button, Avatar, Stack, CircularProgress, Card, CardActionArea
} from '@mui/material';
import { IconMapPin, IconBriefcase, IconCoin, IconClock, IconBuildingSkyscraper } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';
import FilterTopBar from 'src/components/jobs/FilterTopbar.js';

const JobFeed = () => {
  const { apiClient, user } = useAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialTitle = searchParams.get('title') || '';

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (user && user.guid) {
        params.userGuid = user.guid;
      }
      Object.keys(params).forEach(key => !params[key] && delete params[key]);

      const response = await apiClient.get('/job/list', { params });
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Fetch jobs failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs({ searchTitle: initialTitle });
  }, [user]);

  return (
    <PageContainer title={t('jobs')} description={t('browse_jobs')}>
      <FilterTopBar onFilterChange={fetchJobs} initialSearch={initialTitle} />

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Card
              key={job.guid}
              sx={{
                border: '1px solid #e5eaef',
                boxShadow: 'none',
                borderRadius: '7px',
                transition: '0.2s',
                '&:hover': {
                  boxShadow: '0px 9px 20px rgba(0, 0, 0, 0.05)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <CardActionArea onClick={() => navigate(`/public/job/${job.guid}`)} sx={{ p: 3 }}>
                <Grid container spacing={3} alignItems="flex-start">

                  <Grid item>
                    <Avatar
                      src={job.companyLogo ? `http://localhost:8080/v1/files/download/logo/${job.companyLogo}` : null}
                      variant="rounded"
                      sx={{ width: 65, height: 65, bgcolor: 'grey.100', border: '1px solid #eee' }}
                    >
                      <IconBuildingSkyscraper size={30} color="#5D87FF" />
                    </Avatar>
                  </Grid>

                  <Grid item xs>
                    <Box mb={1}>
                      <Typography variant="h5" fontWeight="700" color="textPrimary" lineHeight={1.2} mb={0.5}>
                        {job.title}
                      </Typography>
                      <Typography variant="subtitle1" color="textPrimary" fontWeight="500">
                        {job.companyName || t('company_confidential')}
                      </Typography>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mt={1.5}>
                      <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <IconMapPin size={18} />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <IconBriefcase size={18} />
                        <Typography variant="body2">{job.jobType}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm="auto" display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} gap={1}>
                    {job.isEmployed ? (
                      <Chip label={t('hired')} color="primary" size="small" />
                    ) : job.isApplied ? (
                      <Chip label={t('applied')} color="success" size="small" />
                    ) : (
                      <Typography variant="caption" color="textSecondary" display="flex" alignItems="center" gap={0.5}>
                        <IconClock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Grid>

                </Grid>
              </CardActionArea>
            </Card>
          ))}
          {jobs.length === 0 && (
            <Box textAlign="center" mt={8} py={5} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="h6" color="textSecondary">{t('no_jobs_found')}</Typography>
              <Typography variant="body2" color="textSecondary">{t('try_adjusting_filters')}</Typography>
            </Box>
          )}
        </Stack>
      )}
    </PageContainer>
  );
};

export default JobFeed;