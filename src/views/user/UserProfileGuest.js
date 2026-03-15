import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Typography, Avatar, Stack,
  Divider, List, ListItem, ListItemText, Chip,
  LinearProgress
} from '@mui/material';
import {
  IconBriefcase, IconSchool, IconLanguage,
  IconBuilding, IconUserCircle, IconMail, IconPhone,
  IconBuildingFactory2
} from '@tabler/icons-react';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import { useAuth } from 'src/contexts/AuthContext';

const InfoSection = ({ title, icon: Icon, children }) => (
  <DashboardCard
    title={
      <Stack direction="row" alignItems="center" gap={1}>
        <Icon size={22} /> {title}
      </Stack>
    }
  >
    {children}
  </DashboardCard>
);

const UserProfileGuest = () => {
  const { userGuid } = useParams();
  const { apiClient } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [userImageUrl, setUserImageUrl] = useState('');

  const fetchProfileData = async () => {
    try {
      const profileRes = await apiClient.get(`/user/detail/${userGuid}`);

      setProfileData(profileRes.data.data);
      if (profileRes.data.data.profile) {
        const timestamp = new Date().getTime();
        setUserImageUrl(`https://jamydev.com/v1/files/download/images/${profileRes.data.data.profile}?t=${timestamp}`);
      }
    } catch (err) {
      console.error("Error fetching guest user profile:", err);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userGuid) {
      fetchProfileData();
    }
  }, [userGuid]);

  if (loading) return <LinearProgress />;
  if (!profileData) return <Typography>{t('user_not_found')}</Typography>;

  return (
    <PageContainer title={t('user_profile')} description={t('guest_view_of_user_profile')}>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ height: '180px', background: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)' }} />
            <Box sx={{ px: 3, pb: 3, mt: -5 }}>
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <Avatar
                  src={userImageUrl}
                  alt="profile"
                  sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: 3 }}
                />
                <Box sx={{ mb: 2, width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Box>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="h4" fontWeight="700">
                          {profileData?.fullName || `@${profileData?.name}`}
                        </Typography>
                      </Stack>
                      {profileData?.fullName && <Typography variant="body1" color="textSecondary">@{profileData?.name}</Typography>}
                      <Stack direction="row" spacing={3} mt={1} color="textSecondary">
                        <Box display="flex" gap={0.5}><IconMail size={18} /><Typography variant="body2">{profileData?.email}</Typography></Box>
                        <Box display="flex" gap={0.5}><IconPhone size={18} /><Typography variant="body2">{profileData?.mobile || '-'}</Typography></Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </BlankCard>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('preferred_industries')} icon={IconBuildingFactory2}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profileData?.preferredIndustries?.map((pref) => (
                <Chip key={pref.guid} label={pref.industryName || pref.name} />
              ))}
              {(!profileData?.preferredIndustries?.length) && <Typography color="textSecondary">{t('no_industries_selected')}</Typography>}
            </Box>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('work_experience')} icon={IconBriefcase}>
            <List disablePadding>
              {profileData?.workExperiences?.map((exp) => (
                <React.Fragment key={exp.guid}>
                  <ListItem alignItems="flex-start">
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
              {(!profileData?.workExperiences?.length) && <Typography color="textSecondary">{t('no_experience_added')}</Typography>}
            </List>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('education')} icon={IconSchool}>
            <List disablePadding>
              {profileData?.educations?.map((edu) => (
                <React.Fragment key={edu.guid}>
                  <ListItem>
                    <ListItemText
                      primary={<Typography fontWeight="600">{edu.institution}</Typography>}
                      secondary={`${edu.degree} (${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()})`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {(!profileData?.educations?.length) && <Typography color="textSecondary">{t('no_education_added')}</Typography>}
            </List>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('skills')} icon={IconUserCircle}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profileData?.skills?.map((skill) => (
                <Chip key={skill.guid} label={`${skill.name} (${skill.proficiency})`} color="primary" variant="outlined" />
              ))}
              {(!profileData?.skills?.length) && <Typography color="textSecondary">{t('no_skills_added')}</Typography>}
            </Box>
          </InfoSection>
        </Grid>

        <Grid item xs={12}>
          <InfoSection title={t('languages')} icon={IconLanguage}>
            <List disablePadding>
              {profileData?.userLanguages?.map((lang) => (
                <ListItem key={lang.guid}>
                  <ListItemText primary={lang.languageName} secondary={lang.proficiency} />
                </ListItem>
              ))}
              {(!profileData?.userLanguages?.length) && <Typography color="textSecondary">{t('no_languages_added')}</Typography>}
            </List>
          </InfoSection>
        </Grid>

      </Grid>
    </PageContainer>
  );
};

export default UserProfileGuest;