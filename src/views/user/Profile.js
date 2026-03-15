import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Typography, Avatar, Button, IconButton, Stack,
  Divider, List, ListItem, ListItemText, Chip,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  MenuItem, LinearProgress, Badge, ListItemIcon
} from '@mui/material';
import {
  IconPlus, IconTrash, IconBriefcase, IconSchool, IconLanguage,
  IconBuilding, IconUserCircle, IconPencil, IconMail, IconPhone,
  IconCamera, IconBuildingFactory2, IconShieldLock, IconFileText, IconEye
} from '@tabler/icons-react';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import { useAuth } from 'src/contexts/AuthContext';

const InfoSection = ({ title, icon: Icon, children, onAdd }) => (
  <DashboardCard
    title={
      <Stack direction="row" alignItems="center" gap={1}>
        <Icon size={22} /> {title}
      </Stack>
    }
    action={
      onAdd && (
        <IconButton onClick={onAdd} color="primary" size="small">
          <IconPlus size={20} />
        </IconButton>
      )
    }
  >
    {children}
  </DashboardCard>
);

const Profile = () => {
  const { user, role, userImageUrl, apiClient, switchToCompany } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState(null);
  const [myCompanies, setMyCompanies] = useState([]);
  const [allIndustries, setAllIndustries] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [resumes, setResumes] = useState([]);

  const [openModal, setOpenModal] = useState({ type: '', open: false });
  const [formData, setFormData] = useState({});

  const fetchProfileData = async () => {
    try {
      const [profileRes, compRes, indRes, resumeRes, langRes] = await Promise.all([
        apiClient.get('/user/profile'),
        apiClient.get('/user/companies'),
        apiClient.get('/industry/list'),
        apiClient.get('/resume/list'),
        apiClient.get('/language/list')
      ]);

      setProfileData(profileRes.data.data);
      setMyCompanies(compRes.data.data || []);
      setAllIndustries(indRes.data.data || []);
      setResumes(resumeRes.data.data || []);
      setAllLanguages(langRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSwitchCompany = async (guid) => {
    await switchToCompany(guid);
    navigate('/company/dashboard');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('userGuid', user.guid);

    try {
      setLoading(true);
      await apiClient.post('/files/upload/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.reload();
    } catch (error) {
      alert('Failed to upload image');
      setLoading(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const name = prompt("Resume Name (e.g. CV 2025):", file.name);
    if (!name) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('userGuid', user.guid);
    uploadData.append('name', name);

    try {
      setLoading(true);
      await apiClient.post('/files/upload/resume', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.reload();
    } catch (error) {
      alert('Failed to upload resume');
      setLoading(false);
    }
  };

  const handleOpenAdd = (type) => {
    setFormData({});
    setOpenModal({ type, open: true });
  };

  const handleOpenEditProfile = () => {
    setFormData({
      name: profileData.name,
      fullName: profileData.fullName,
      mobile: profileData.mobile,
      email: profileData.email
    });
    setOpenModal({ type: 'edit_profile', open: true });
  };

  const handleSubmit = async () => {
    try {
      if (openModal.type === 'edit_profile') {
        await apiClient.put(`/user/update/admin/${user.guid}`, formData);
        window.location.reload();
      } else if (openModal.type === 'company_create') {
        await apiClient.post('/company/register', formData);
        window.location.reload();
      } else {
        const endpointMap = {
          'education': '/education/create',
          'skill': '/skill/create',
          'experience': '/work-experience/create',
          'language': '/user-language/create',
          'industry': '/preferred-industry/create'
        };
        await apiClient.post(endpointMap[openModal.type], formData);
        setOpenModal({ ...openModal, open: false });
        fetchProfileData();
      }
    } catch (err) {
      alert('Operation failed. Please check inputs.');
    }
  };

  const handleDeleteItem = async (type, guid) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const endpointMap = {
        'education': `/education/delete/${guid}`,
        'skill': `/skill/delete/${guid}`,
        'experience': `/work-experience/delete/${guid}`,
        'language': `/user-language/delete/${guid}`,
        'industry': `/preferred-industry/delete/${guid}`,
        'resume': `/files/delete/resume/${guid}`
      };

      if(type === 'resume') await apiClient.delete(endpointMap[type]);
      else await apiClient.post(endpointMap[type]);

      fetchProfileData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResume = (resumeGuid) => {
    navigate(`/company/resume/viewer/${resumeGuid}`);
  };

  if (loading) return <LinearProgress />;

  return (
    <PageContainer title={t('my_profile')} description="My Profile">
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ height: '180px', background: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)' }} />
            <Box sx={{ px: 3, pb: 3, mt: -5 }}>
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <label htmlFor="upload-photo">
                      <input accept="image/*" id="upload-photo" type="file" hidden onChange={handleImageUpload} />
                      <IconButton component="span" sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <IconCamera size={20} />
                      </IconButton>
                    </label>
                  }
                >
                  <Avatar
                    src={userImageUrl}
                    alt="profile"
                    sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: 3 }}
                  />
                </Badge>
                <Box sx={{ mb: 2, width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Box>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="h4" fontWeight="700">
                          {profileData?.fullName || `@${profileData?.name}`}
                        </Typography>
                        {role === 'ADMIN' && <Chip label="Admin" color="error" size="small" />}
                      </Stack>
                      {profileData?.fullName && <Typography variant="body1" color="textSecondary">@{profileData?.name}</Typography>}
                      <Stack direction="row" spacing={3} mt={1} color="textSecondary">
                        <Box display="flex" gap={0.5}><IconMail size={18} /><Typography variant="body2">{profileData?.email}</Typography></Box>
                        <Box display="flex" gap={0.5}><IconPhone size={18} /><Typography variant="body2">{profileData?.mobile || '-'}</Typography></Box>
                      </Stack>
                    </Box>
                    <Button variant="outlined" size="small" startIcon={<IconPencil />} onClick={handleOpenEditProfile}>{t('edit_info')}</Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </BlankCard>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('preferred_industries')} icon={IconBuildingFactory2} onAdd={() => handleOpenAdd('industry')}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profileData?.preferredIndustries?.map((pref) => (
                <Chip key={pref.guid} label={pref.industryName || pref.name} onDelete={() => handleDeleteItem('industry', pref.guid)} />
              ))}
              {(!profileData?.preferredIndustries?.length) && <Typography color="textSecondary">No industries selected.</Typography>}
            </Box>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('work_experience')} icon={IconBriefcase} onAdd={() => handleOpenAdd('experience')}>
            <List disablePadding>
              {profileData?.workExperiences?.map((exp) => (
                <React.Fragment key={exp.guid}>
                  <ListItem alignItems="flex-start" secondaryAction={<IconButton size="small" onClick={() => handleDeleteItem('experience', exp.guid)}><IconTrash size={18} /></IconButton>}>
                    <ListItemText
                      primary={<Typography fontWeight="600">{exp.position}</Typography>}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">{exp.companyName}</Typography><br/>
                          {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}<br/>
                          <Typography component="span" variant="caption">{exp.description}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {(!profileData?.workExperiences?.length) && <Typography color="textSecondary">No experience added.</Typography>}
            </List>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('education')} icon={IconSchool} onAdd={() => handleOpenAdd('education')}>
            <List disablePadding>
              {profileData?.educations?.map((edu) => (
                <React.Fragment key={edu.guid}>
                  <ListItem secondaryAction={<IconButton size="small" onClick={() => handleDeleteItem('education', edu.guid)}><IconTrash size={18} /></IconButton>}>
                    <ListItemText
                      primary={<Typography fontWeight="600">{edu.institution}</Typography>}
                      secondary={`${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {(!profileData?.educations?.length) && <Typography color="textSecondary">No education added.</Typography>}
            </List>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('skills')} icon={IconUserCircle} onAdd={() => handleOpenAdd('skill')}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profileData?.skills?.map((skill) => (
                <Chip key={skill.guid} label={`${skill.name} (${skill.proficiency})`} onDelete={() => handleDeleteItem('skill', skill.guid)} color="primary" variant="outlined" />
              ))}
              {(!profileData?.skills?.length) && <Typography color="textSecondary">No skills added.</Typography>}
            </Box>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('languages')} icon={IconLanguage} onAdd={() => handleOpenAdd('language')}>
            <List disablePadding>
              {profileData?.userLanguages?.map((lang) => (
                <ListItem key={lang.guid} secondaryAction={<IconButton size="small" onClick={() => handleDeleteItem('language', lang.guid)}><IconTrash size={16}/></IconButton>}>
                  <ListItemText primary={lang.languageName} secondary={lang.proficiency} />
                </ListItem>
              ))}
              {(!profileData?.userLanguages?.length) && <Typography color="textSecondary">No languages added.</Typography>}
            </List>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <DashboardCard title={t('my_resumes')} action={
            <Button component="label" variant="contained" size="small" startIcon={<IconPlus size={18}/>}>
              Upload <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            </Button>
          }>
            <List>
              {resumes.map((r) => (
                <React.Fragment key={r.guid}>
                  <ListItem secondaryAction={
                    <Stack direction="row">
                      <IconButton onClick={() => handleViewResume(r.guid)} color="primary"><IconEye size={20}/></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteItem('resume', r.guid)}><IconTrash size={20}/></IconButton>
                    </Stack>
                  }>
                    <ListItemIcon><IconFileText /></ListItemIcon>
                    <ListItemText primary={r.name} secondary={new Date(r.createdAt).toLocaleDateString()} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {resumes.length === 0 && <Typography color="textSecondary">No resumes uploaded.</Typography>}
            </List>
          </DashboardCard>
        </Grid>

        <Grid item xs={12}>
          <DashboardCard title={t('companies')}>
            <Stack direction="row" spacing={4} overflow="auto" py={1}>
              {myCompanies.map((comp) => (
                <Box key={comp.guid} onClick={() => handleSwitchCompany(comp.guid)} sx={{ cursor: 'pointer', textAlign: 'center', minWidth: '80px', '&:hover': { opacity: 0.8 } }}>
                  <Avatar src={comp.logo ? `https://jamydev.com/v1/files/download/logo/${comp.logo}` : null} sx={{ width: 64, height: 64, mb: 1, mx: 'auto', bgcolor: 'primary.light' }}><IconBuilding/></Avatar>
                  <Typography variant="subtitle2">{comp.name}</Typography>
                </Box>
              ))}
              <Box onClick={() => handleOpenAdd('company_create')} sx={{ cursor: 'pointer', textAlign: 'center', minWidth: '80px', '&:hover': { opacity: 0.8 } }}>
                <Avatar sx={{ width: 64, height: 64, mb: 1, mx: 'auto', bgcolor: 'grey.100', color: 'grey.500', border: '1px dashed grey' }}><IconPlus/></Avatar>
                <Typography variant="subtitle2">{t('create_new')}</Typography>
              </Box>
            </Stack>
          </DashboardCard>
        </Grid>
      </Grid>

      <Dialog open={openModal.open} onClose={() => setOpenModal({ ...openModal, open: false })} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textTransform: 'capitalize' }}>
          {openModal.type === 'edit_profile' ? 'Edit Profile' : openModal.type === 'company_create' ? 'Register Company' : `Add ${openModal.type}`}
        </DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>

            {openModal.type === 'edit_profile' && (
              <>
                <TextField label="Username" fullWidth value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <TextField label="Full Name" fullWidth value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                <TextField label="Email" disabled value={formData.email || ''} fullWidth />
                <TextField label="Mobile" value={formData.mobile || ''} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} fullWidth />
              </>
            )}

            {openModal.type === 'industry' && (
              <TextField select label="Select Industry" fullWidth value={formData.industryGuid || ''} onChange={(e) => setFormData({ ...formData, industryGuid: e.target.value })}>
                {allIndustries.map((ind) => <MenuItem key={ind.guid} value={ind.guid}>{ind.name}</MenuItem>)}
              </TextField>
            )}

            {openModal.type === 'education' && (
              <>
                <TextField label="Institution" fullWidth onChange={(e) => setFormData({...formData, institution: e.target.value})} />
                <TextField label="Degree" fullWidth onChange={(e) => setFormData({...formData, degree: e.target.value})} />
                <Grid container spacing={2}>
                  <Grid item xs={6}><TextField type="date" label="Start Date" InputLabelProps={{ shrink: true }} fullWidth onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })} /></Grid>
                  <Grid item xs={6}><TextField type="date" label="End Date" InputLabelProps={{ shrink: true }} fullWidth onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })} /></Grid>
                </Grid>
              </>
            )}

            {openModal.type === 'skill' && (
              <>
                <TextField label="Skill Name" fullWidth onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <TextField select label="Proficiency" fullWidth onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })} value={formData.proficiency || ''}>
                  <MenuItem value="Beginner">Beginner</MenuItem><MenuItem value="Intermediate">Intermediate</MenuItem><MenuItem value="Advanced">Advanced</MenuItem>
                </TextField>
              </>
            )}

            {openModal.type === 'language' && (
              <>
                <TextField select label="Select Language" fullWidth value={formData.languageGuid || ''} onChange={(e) => setFormData({ ...formData, languageGuid: e.target.value })}>
                  {allLanguages.map((l) => <MenuItem key={l.guid} value={l.guid}>{l.name}</MenuItem>)}
                </TextField>
                <TextField select label="Proficiency" fullWidth onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })} value={formData.proficiency || ''}>
                  <MenuItem value="Basic">Basic</MenuItem><MenuItem value="Fluent">Fluent</MenuItem><MenuItem value="Native">Native</MenuItem>
                </TextField>
              </>
            )}

            {openModal.type === 'experience' && (
              <>
                <TextField label="Company Name" fullWidth onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                <TextField label="Position" fullWidth onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                <TextField label="Description" multiline rows={2} fullWidth onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <Grid container spacing={2}>
                  <Grid item xs={6}><TextField type="date" label="Start Date" InputLabelProps={{ shrink: true }} fullWidth onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })} /></Grid>
                  <Grid item xs={6}><TextField type="date" label="End Date" InputLabelProps={{ shrink: true }} fullWidth onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })} /></Grid>
                </Grid>
              </>
            )}

            {openModal.type === 'company_create' && (
              <>
                <TextField label="Company Name" required fullWidth onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <TextField label="Public Name" required fullWidth onChange={(e) => setFormData({ ...formData, publicName: e.target.value })} />
                <TextField label="Legal Name" required fullWidth onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })} />
                <TextField label="Email" required fullWidth onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <TextField label="Phone" required fullWidth onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <TextField
                  label="Founded Date"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
                />
                <TextField label="Description" multiline rows={3} fullWidth onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </>
            )}

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal({ ...openModal, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Profile;