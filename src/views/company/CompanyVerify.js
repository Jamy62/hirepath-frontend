import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button,
  MenuItem, CircularProgress, Alert, Stack
} from '@mui/material';
import { IconBuilding } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';

const CompanyVerify = () => {
  const { apiClient, company } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    legalBusinessName: '',
    publicName: '',
    website: '',
    industryGuid: '',
    foundedDate: '',
    companySize: '',
    businessType: ''
  });

  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [companyRes, industriesRes] = await Promise.all([
          apiClient.get('/company/profile'),
          apiClient.get('/industry/list')
        ]);

        const currentCompanyData = companyRes.data.data;
        setIndustries(industriesRes.data.data || []);

        setFormData({
          legalBusinessName: currentCompanyData.legalBusinessName || '',
          publicName: currentCompanyData.publicName || '',
          website: currentCompanyData.website || '',
          industryGuid: currentCompanyData.industryGuid || '',
          foundedDate: currentCompanyData.foundedDate ? new Date(currentCompanyData.foundedDate).toISOString().split('T')[0] : '',
          companySize: currentCompanyData.companySize || '',
          businessType: currentCompanyData.businessType || ''
        });
      } catch (error) {
        console.error("Failed to fetch initial data for verification", error);
        setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load initial data.' });
      } finally {
        setDataLoading(false);
      }
    };

    if (company) {
      fetchInitialData();
    }
  }, [apiClient, company]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.legalBusinessName || !formData.publicName || !formData.website || !formData.industryGuid || !formData.foundedDate || !formData.companySize || !formData.businessType) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setLoading(false);
      return;
    }

    try {
      await apiClient.put(`/company/verify/request/${company.guid}`, {
        legalBusinessName: formData.legalBusinessName,
        publicName: formData.publicName,
        website: formData.website,
        industry: formData.industryGuid,
        foundedDate: formData.foundedDate,
        companySize: formData.companySize,
        businessType: formData.businessType
      });
      setMessage({ type: 'success', text: 'Verification request submitted successfully!' });
      setTimeout(() => navigate('/company/dashboard'), 1500);
    } catch (error) {
      console.error("Verification request failed", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit verification request.' });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <PageContainer title="Company Verification" description="Submit company details for verification">
      <Card>
        <CardContent>
          <Typography variant="h4" mb={3} display="flex" alignItems="center">
            <IconBuilding style={{ marginRight: 10 }} /> Company Verification
          </Typography>

          {message.text && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Legal Business Name" name="legalBusinessName" required fullWidth value={formData.legalBusinessName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Public Name" name="publicName" required fullWidth value={formData.publicName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Website" name="website" required fullWidth value={formData.website} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Industry"
                  name="industryGuid"
                  required
                  fullWidth
                  value={formData.industryGuid}
                  onChange={handleChange}
                >
                  {industries.map((option) => (
                    <MenuItem key={option.guid} value={option.guid}>{option.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Founded Date"
                  name="foundedDate"
                  type="date"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.foundedDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Company Size"
                  name="companySize"
                  required
                  fullWidth
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <MenuItem value="SMALL">Small Company</MenuItem>
                  <MenuItem value="MEDIUM">Medium Company</MenuItem>
                  <MenuItem value="LARGE">Large Company</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Business Type" name="businessType" required fullWidth value={formData.businessType} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Submit Verification Request"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default CompanyVerify;