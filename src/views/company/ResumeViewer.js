import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Box, CircularProgress, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/contexts/AuthContext';

const ResumeViewer = () => {
  const { resumeGuid } = useParams();
  const { t } = useTranslation();
  const { apiClient } = useAuth();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/files/download/resumes/${resumeGuid}`, {
          responseType: 'blob'
        });

        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        setPdfUrl(url);
      } catch (err) {
        console.error("Resume download failed", err);
        setError('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    if (resumeGuid) {
      fetchResume();
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [resumeGuid, apiClient, t]);

  return (
    <PageContainer title={t('resume_viewer')} description={t('viewing_resume')}>
      <Paper sx={{ height: 'calc(100vh - 120px)', overflow: 'hidden', p: 0 }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && !error && pdfUrl && (
          <iframe
            src={pdfUrl}
            title={t('resume_viewer')}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        )}
      </Paper>
    </PageContainer>
  );
};

export default ResumeViewer;