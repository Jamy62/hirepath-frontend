import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Typography, Avatar, Button, IconButton, Stack,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  LinearProgress, MenuItem, Badge, Chip, Card, CardContent, CardMedia, Divider
} from '@mui/material';
import {
  IconPencil, IconMail, IconPhone, IconWorld, IconBuilding,
  IconCamera, IconPhoto, IconPlus, IconCheck, IconX, IconAlertCircle, IconTrash
} from '@tabler/icons-react';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import { useAuth } from 'src/contexts/AuthContext';

const CompanyProfile = () => {
  const { company, apiClient } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const [locations, setLocations] = useState([]);

  const [openModal, setOpenModal] = useState({ type: '', open: false });
  const [formData, setFormData] = useState({});

  const [logoUrl, setLogoUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);

  const fetchCompanyData = async () => {
    try {
      const res = await apiClient.get('/company/profile');
      const data = res.data.data;
      setCompanyData(data);

      const timestamp = new Date().getTime();
      if (data.logo) setLogoUrl(`http://localhost:8080/v1/files/download/logo/${data.logo}?t=${timestamp}`);
      if (data.banner) setBannerUrl(`http://localhost:8080/v1/files/download/banner/${data.banner}?t=${timestamp}`);

      setLocations(data.locations || []);
    } catch (err) {
      console.error("Profile load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) fetchCompanyData();
  }, [company]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('companyGuid', company.guid);
    try {
      setLoading(true);
      await apiClient.post(`/files/upload/${type}`, uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
      window.location.reload();
    } catch (error) {
      alert('Upload failed');
      setLoading(false);
    }
  };

  const handleLocationSubmit = async () => {
    const data = new FormData();
    data.append('file', formData.file);
    data.append('companyGuid', company.guid);
    data.append('name', formData.name);
    data.append('address', formData.address);
    try {
      await apiClient.post('/files/upload/location', data);
      setOpenModal({ ...openModal, open: false });
      fetchCompanyData();
    } catch (error) { alert('Failed to add location'); }
  };

  const handleDeleteLocation = async (locationGuid) => {
    if (!window.confirm(t('are_you_sure_you_want_to_delete_this_location'))) return;
    try {
      await apiClient.delete(`/files/delete/location/${locationGuid}`);
      fetchCompanyData();
    } catch (error) {
      console.error("Delete location failed", error);
      alert(t('delete_failed'));
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updateData = {
        name: formData.name,
        publicName: formData.publicName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        description: formData.description,
        legalBusinessName: formData.legalBusinessName,
        companySize: formData.companySize,
        businessType: formData.businessType,
        foundedDate: formData.foundedDate
      };

      await apiClient.put(`/company/update/admin/${company.guid}`, updateData);
      setOpenModal({ ...openModal, open: false });
      fetchCompanyData();
    } catch (err) { alert('Update failed'); }
  };

  const handleOpenEdit = () => {
    setFormData({
      name: companyData.name,
      publicName: companyData.publicName,
      email: companyData.email,
      phone: companyData.phone,
      website: companyData.website,
      description: companyData.description,
      legalBusinessName: companyData.legalBusinessName,
      companySize: companyData.companySize,
      businessType: companyData.businessType,
      foundedDate: companyData.foundedDate ? new Date(companyData.foundedDate).toISOString().split('T')[0] : ''
    });
    setOpenModal({ type: 'edit_info', open: true });
  };

  if (loading && !companyData) return <LinearProgress />;

  return (
    <PageContainer title={t('company_profile')} description={t('manage_branding')}>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ height: '180px', background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : 'linear-gradient(90deg, #0A2749 0%, #007BFF 100%)', position: 'relative' }}>
              <Button component="label" variant="contained" size="small" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'white', color: 'black' }} startIcon={<IconPhoto size={18} />}>
                {t('edit_cover')} <input hidden accept="image/*" type="file" onChange={(e) => handleFileUpload(e, 'banner')} />
              </Button>
            </Box>

            <Box sx={{ px: 3, pb: 3, mt: -5, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={
                  <label htmlFor="upload-logo">
                    <input accept="image/*" id="upload-logo" type="file" hidden onChange={(e) => handleFileUpload(e, 'logo')} />
                    <IconButton component="span" sx={{ bgcolor: 'primary.main', color: 'white' }}><IconCamera size={20} /></IconButton>
                  </label>
                }>
                  <Avatar src={logoUrl} sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: 2, bgcolor: 'white' }}>
                    <IconBuilding size={60} color="#ccc" />
                  </Avatar>
                </Badge>

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
                    <Button variant="outlined" size="small" startIcon={<IconPencil />} onClick={handleOpenEdit}>{t('edit_info')}</Button>
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
          <DashboardCard title={t('locations')} action={
            <IconButton onClick={() => { setFormData({}); setOpenModal({ type: 'add_location', open: true }); }} color="primary"><IconPlus /></IconButton>
          }>
            <Grid container spacing={2}>
              {locations.map((loc) => (
                <Grid item xs={12} sm={6} md={4} key={loc.guid}>
                  <Card variant="outlined">
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" height="140" image={loc.photo ? `http://localhost:8080/v1/files/download/location/${loc.photo}` : 'https://via.placeholder.com/300x140'} alt={loc.name} />
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
                        size="small"
                        onClick={() => handleDeleteLocation(loc.guid)}
                      >
                        <IconTrash size={18} color="red" />
                      </IconButton>
                    </Box>
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

      <Dialog open={openModal.open} onClose={() => setOpenModal({ ...openModal, open: false })} fullWidth maxWidth="md">
        <DialogTitle>{openModal.type === 'edit_info' ? t('edit_company_info') : t('add_location')}</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            {openModal.type === 'edit_info' ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}><TextField label={t('company_name')} fullWidth value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} /></Grid>
                <Grid item xs={12} md={6}><TextField label={t('public_name')} fullWidth value={formData.publicName || ''} onChange={(e) => setFormData({...formData, publicName: e.target.value})} /></Grid>
                <Grid item xs={12} md={6}><TextField label={t('legal_name')} fullWidth value={formData.legalBusinessName || ''} onChange={(e) => setFormData({...formData, legalBusinessName: e.target.value})} /></Grid>
                <Grid item xs={12} md={6}><TextField label={t('phone')} fullWidth value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></Grid>
                <Grid item xs={12} md={6}><TextField label={t('website')} fullWidth value={formData.website || ''} onChange={(e) => setFormData({...formData, website: e.target.value})} /></Grid>
                <Grid item xs={12} md={6}>
                  <TextField select label={t('company_size')} fullWidth value={formData.companySize || ''} onChange={(e) => setFormData({...formData, companySize: e.target.value})}>
                    <MenuItem value="SMALL">Small (1-50)</MenuItem><MenuItem value="MEDIUM">Medium (51-200)</MenuItem><MenuItem value="LARGE">Large (200+)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}><TextField label={t('business_type')} fullWidth value={formData.businessType || ''} onChange={(e) => setFormData({...formData, businessType: e.target.value})} /></Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('founded_date')}
                    type="date"
                    fullWidth
                    value={formData.foundedDate || ''}
                    onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}><TextField label={t('description')} multiline rows={4} fullWidth value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} /></Grid>
              </Grid>
            ) : (
              <Stack spacing={2}>
                <Button variant="outlined" component="label">{t('upload_image')}<input type="file" hidden accept="image/*" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} /></Button>
                {formData.file && <Typography variant="caption">{formData.file.name}</Typography>}
                <TextField label={t('location_name')} fullWidth value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <TextField label={t('address')} multiline rows={2} fullWidth value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </Stack>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal({ ...openModal, open: false })}>{t('cancel')}</Button>
          <Button variant="contained" onClick={openModal.type === 'edit_info' ? handleEditSubmit : handleLocationSubmit}>{t('save')}</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default CompanyProfile;