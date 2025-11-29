import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, Divider,
  Avatar, Stack, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import {
  IconMapPin, IconBriefcase, IconCoin, IconCheck, IconRosette,
  IconClock, IconCalendarDue, IconStairsUp, IconCategory
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';

const JobDetail = () => {
  const { guid } = useParams();
  const navigate = useNavigate();
  const { apiClient, isAuthenticated, role, user } = useAuth();
  const { t } = useTranslation();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openApply, setOpenApply] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [applicationForm, setApplicationForm] = useState({ resumeGuid: '', coverLetter: '' });
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const params = {};
        if (user && user.guid) {
          params.userGuid = user.guid;
        }
        const response = await apiClient.get(`/job/detail/${guid}`, { params });
        const jobData = response.data.data;
        setJob(jobData);
        if (jobData.isApplied) {
          setApplySuccess(true);
        }
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [guid, apiClient, user]);

  const handleApplyClick = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    try {
      const res = await apiClient.get('/resume/list');
      const resumeList = res.data.data || [];
      setResumes(resumeList);
      if (resumeList.length > 0) setApplicationForm({ ...applicationForm, resumeGuid: resumeList[0].guid });
      setOpenApply(true);
    } catch (err) {
      alert("Could not load resumes.");
    }
  };

  const submitApplication = async () => {
    if (!applicationForm.resumeGuid) {
      alert("Please select a resume");
      return;
    }
    setApplying(true);
    try {
      const payload = {
        jobGuid: guid,
        resumeGuid: applicationForm.resumeGuid,
        coverLetter: applicationForm.coverLetter
      };
      await apiClient.post('/application/apply', payload);
      setApplySuccess(true);
      setOpenApply(false);
    } catch (err) {
      alert(err.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Box p={5} display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (!job) return <Box p={5} textAlign="center"><Typography>{t('job_not_found')}</Typography></Box>;

  const formatSalary = (min, max) => {
    if (!min) return 'Negotiable';
    return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} Ks`;
  };

  return (
    <PageContainer title={job.title} description={t('job_details')}>

      <Card sx={{ mb: 3, border: '1px solid #e5eaef', boxShadow: 'none', borderRadius: '7px' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">

            <Link to={`/company/profile/guest/${job.companyGuid}`}>
              <Avatar
                src={job.companyLogo ? `http://localhost:8080/v1/files/download/logo/${job.companyLogo}` : null}
                alt={job.companyName}
                variant="rounded"
                sx={{ width: 80, height: 80, mb: 2, bgcolor: 'grey.100', border: '1px solid #eee' }}
              />
            </Link>

            <Typography variant="h3" fontWeight="700" gutterBottom color="textPrimary">{job.title}</Typography>
            <Typography variant="h5" color="textSecondary" fontWeight="500" mb={3}>{job.companyName}</Typography>

            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" justifyContent="center" useFlexGap sx={{ gap: 1 }}>
              <Chip icon={<IconMapPin size={16}/>} label={job.location || 'N/A'} variant="outlined" />
              <Chip icon={<IconBriefcase size={16}/>} label={job.jobType || 'N/A'} variant="outlined" />
              <Chip icon={<IconCoin size={16}/>} label={formatSalary(job.minSalary, job.maxSalary)} color="success" variant="outlined" sx={{ fontWeight: 600, bgcolor: 'success.light', border: 'none', color: 'success.dark' }} />
            </Stack>

            {role !== 'COMPANY' && (
              <Box>
                {job.isEmployed ? (
                  <Button variant="contained" color="primary" disabled startIcon={<IconRosette />}>
                    {t('hired')}
                  </Button>
                ) : (
                  <Button
                    variant={applySuccess ? "outlined" : "contained"}
                    color={applySuccess ? "success" : "primary"}
                    size="large"
                    onClick={handleApplyClick}
                    disabled={applySuccess}
                    startIcon={applySuccess ? <IconCheck /> : <IconBriefcase />}
                    sx={{ px: 5, py: 1.2, fontSize: '1rem' }}
                  >
                    {applySuccess ? t('applied') : t('apply_now')}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>

          <Card sx={{ mb: 3, border: '1px solid #e5eaef', boxShadow: 'none', borderRadius: '7px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="700" mb={2} color="textPrimary">{t('job_description')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', color: 'text.secondary', lineHeight: 1.7 }}>
                {job.description}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, border: '1px solid #e5eaef', boxShadow: 'none', borderRadius: '7px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="700" mb={2} color="textPrimary">{t('requirements')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', color: 'text.secondary', lineHeight: 1.7 }}>
                {job.requirements}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ border: '1px solid #e5eaef', boxShadow: 'none', borderRadius: '7px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="700" mb={2} color="textPrimary">{t('benefits')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', color: 'text.secondary', lineHeight: 1.7 }}>
                {job.benefits}
              </Typography>
            </CardContent>
          </Card>

        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ border: '1px solid #e5eaef', boxShadow: 'none', borderRadius: '7px', position: 'sticky', top: 90 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="700" mb={3} color="textPrimary">{t('job_overview')}</Typography>

              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 40, height: 40 }}>
                    <IconCalendarDue size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">{t('posted_date')}</Typography>
                    <Typography variant="subtitle2" fontWeight="600">{new Date(job.postedDate).toLocaleDateString()}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar variant="rounded" sx={{ bgcolor: 'error.light', color: 'error.main', width: 40, height: 40 }}>
                    <IconClock size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">{t('expire_date')}</Typography>
                    <Typography variant="subtitle2" fontWeight="600">{job.expireDate ? new Date(job.expireDate).toLocaleDateString() : t('no_expiry')}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar variant="rounded" sx={{ bgcolor: 'warning.light', color: 'warning.main', width: 40, height: 40 }}>
                    <IconStairsUp size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">{t('experience_level')}</Typography>
                    <Typography variant="subtitle2" fontWeight="600">{job.experienceLevelName || t('not_specified')}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 40, height: 40 }}>
                    <IconCategory size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">{t('job_function')}</Typography>
                    <Typography variant="subtitle2" fontWeight="600">{job.jobFunctionName || 'General'}</Typography>
                  </Box>
                </Box>
              </Stack>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openApply} onClose={() => setOpenApply(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('apply_to')} {job.title}</DialogTitle>
        <DialogContent>
          {resumes.length === 0 ? (
            <Alert severity="warning" sx={{ mt: 1 }}>{t('no_resumes_found')}</Alert>
          ) : (
            <Box pt={1}>
              <TextField
                select label={t('select_resume')} fullWidth margin="normal"
                value={applicationForm.resumeGuid}
                onChange={(e) => setApplicationForm({ ...applicationForm, resumeGuid: e.target.value })}
              >
                {resumes.map((r) => (
                  <MenuItem key={r.guid} value={r.guid}>{r.name || r.fileName}</MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('cover_letter')} multiline rows={4} fullWidth margin="normal"
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApply(false)}>{t('cancel')}</Button>
          <Button variant="contained" onClick={submitApplication} disabled={resumes.length === 0 || applying}>
            {applying ? <CircularProgress size={24} /> : t('submit_application')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default JobDetail;