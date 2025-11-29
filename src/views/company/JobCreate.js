import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button,
  MenuItem, CircularProgress, Alert
} from '@mui/material';
import { IconBriefcase } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';

const JobCreate = () => {
  const { apiClient } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasPaymentMethods, setHasPaymentMethods] = useState(false);

  const [metadata, setMetadata] = useState({
    industries: [],
    jobTypes: [],
    jobFunctions: [],
    experienceLevels: [],
    provinces: [],
    townships: []
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    minSalary: '',
    maxSalary: '',
    industryGuid: '',
    jobTypeGuid: '',
    jobFunctionGuid: '',
    experienceLevelGuid: '',
    provinceGuid: '',
    townshipGuid: ''
  });

  useEffect(() => {
    const initChecksAndFetchMetadata = async () => {
      setDataLoading(true);
      try {
        const paymentsRes = await apiClient.get('/payment-method/list');
        const paymentMethods = paymentsRes.data.data || [];

        if (paymentMethods.length === 0) {
          window.alert('You must save a payment method to post a job. Redirecting to payment methods.');
          navigate('/company/payment-methods');
          return;
        } else {
          setHasPaymentMethods(true);
        }

        const companyProfileRes = await apiClient.get('/company/profile');
        const companyVerificationStatus = companyProfileRes.data.data?.verificationStatus;

        if (companyVerificationStatus !== 'TRUE') {
          window.alert('Your company must be verified to post a job. Redirecting to dashboard.');
          navigate('/company/dashboard');
          return;
        }

        const [ind, type, func, exp, prov, town] = await Promise.all([
          apiClient.get('/industry/list'),
          apiClient.get('/job-type/list'),
          apiClient.get('/job-function/list'),
          apiClient.get('/experience-level/list'),
          apiClient.get('/province/list'),
          apiClient.get('/township/list')
        ]);

        setMetadata({
          industries: ind.data.data || [],
          jobTypes: type.data.data || [],
          jobFunctions: func.data.data || [],
          experienceLevels: exp.data.data || [],
          provinces: prov.data.data || [],
          townships: town.data.data || []
        });
      } catch (error) {
        console.error("Failed to load job metadata or perform initial checks", error);
        setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load necessary data.' });
      } finally {
        setDataLoading(false);
      }
    };

    initChecksAndFetchMetadata();
  }, [apiClient, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.title || !formData.provinceGuid) {
      setMessage({ type: 'error', text: 'Please fill in required fields.' });
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      industryGuids: [formData.industryGuid],
    };

    delete payload.industryGuid;
    delete payload.provinceGuid;

    try {
      await apiClient.post('/job/create', payload);
      setMessage({ type: 'success', text: 'Job Posted Successfully!' });
      setTimeout(() => navigate('/company/jobs'), 1500);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  const availableTownships = metadata.townships;

  if (dataLoading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <PageContainer title={t('post_a_job')} description={t('create_a_new_job_listing')}>
      <Card>
        <CardContent>
          <Typography variant="h4" mb={3} display="flex" alignItems="center">
            <IconBriefcase style={{ marginRight: 10 }} /> {t('post_a_new_job')}
          </Typography>

          {message.text && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6">{t('basic_information')}</Typography></Grid>
              <Grid item xs={12}>
                <TextField label={t('job_title')} name="title" required fullWidth value={formData.title} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField select label={t('industry')} name="industryGuid" required fullWidth value={formData.industryGuid} onChange={handleChange}>
                  {metadata.industries.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label={t('job_function')} name="jobFunctionGuid" required fullWidth value={formData.jobFunctionGuid} onChange={handleChange}>
                  {metadata.jobFunctions.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}><Typography variant="h6" mt={2}>{t('details_and_requirements')}</Typography></Grid>
              <Grid item xs={12} md={6}>
                <TextField select label={t('job_type')} name="jobTypeGuid" required fullWidth value={formData.jobTypeGuid} onChange={handleChange}>
                  {metadata.jobTypes.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label={t('experience_level')} name="experienceLevelGuid" required fullWidth value={formData.experienceLevelGuid} onChange={handleChange}>
                  {metadata.experienceLevels.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label={t('job_description')} name="description" required multiline rows={4} fullWidth value={formData.description} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label={t('requirements')} name="requirements" required multiline rows={4} fullWidth value={formData.requirements} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label={t('benefits')} name="benefits" multiline rows={3} fullWidth value={formData.benefits} onChange={handleChange} />
              </Grid>

              <Grid item xs={12}><Typography variant="h6" mt={2}>{t('salary_and_location')}</Typography></Grid>
              <Grid item xs={12} md={6}>
                <TextField label={t('min_salary')} name="minSalary" type="number" fullWidth value={formData.minSalary} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label={t('max_salary')} name="maxSalary" type="number" fullWidth value={formData.maxSalary} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField select label={t('province_state')} name="provinceGuid" required fullWidth value={formData.provinceGuid} onChange={handleChange}>
                  {metadata.provinces.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label={t('township')} name="townshipGuid" required fullWidth value={formData.townshipGuid} onChange={handleChange}>
                  {availableTownships.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                {hasPaymentMethods && (
                  <Typography variant="body2" color="textSecondary" sx={{ mr: 2, alignSelf: 'center' }}>
                    This will cost a flat fee of 100,000 Ks
                  </Typography>
                )}
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : t('post_job_now')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default JobCreate;