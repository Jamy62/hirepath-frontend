import React, { useEffect, useState } from 'react';
import {
  Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, CircularProgress, Avatar, Stack, Link
} from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard.js';
import { useAuth } from 'src/contexts/AuthContext';
import { IconExternalLink } from '@tabler/icons-react';

const getLogoUrl = (filename) => filename ? `https://jamydev.com/v1/files/download/logo/${filename}` : null;
const getProfileUrl = (filename) => filename ? `https://jamydev.com/v1/files/download/images/${filename}` : null;

export const MostPopularJobs = () => {
  const { apiClient } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/reports/most-popular-jobs')
      .then(res => setData(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [apiClient]);

  return (
    <DashboardCard title="Popular Jobs List">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        {loading ? <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box> : (
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>Job Title</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>Company</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>Website</Typography></TableCell>
                <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>Applications</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>{row.jobTitle}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={getLogoUrl(row.logo)} sx={{ width: 30, height: 30 }} />
                      <Typography variant="subtitle2" fontWeight={400}>{row.companyName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {row.website ? (
                      <Link href={row.website} target="_blank" rel="noopener">
                        <IconExternalLink size={18} />
                      </Link>
                    ) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={`${row.applicationCount} Apps`} size="small" sx={{ backgroundColor: 'primary.light', color: 'primary.main' }} />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={4} align="center">No data available</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};

export const MostPopularCompanies = () => {
  const { apiClient } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/reports/most-popular-companies')
      .then(res => setData(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [apiClient]);

  return (
    <DashboardCard title="Popular Companies List">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        {loading ? <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box> : (
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>Company</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>Website</Typography></TableCell>
                <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>Total Applications</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={getLogoUrl(row.logo)} sx={{ width: 35, height: 35 }} />
                      <Typography variant="subtitle2" fontWeight={600}>{row.companyName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {row.website ? (
                      <Link href={row.website} target="_blank" rel="noopener" underline="hover">
                        {row.website}
                      </Link>
                    ) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={row.applicationCount} size="small" color="secondary" />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={3} align="center">No data available</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};

export const MostActiveUsers = () => {
  const { apiClient } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/reports/most-active-users')
      .then(res => setData(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [apiClient]);

  return (
    <DashboardCard title="Most Active Users List">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        {loading ? <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box> : (
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>User</Typography></TableCell>
                <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>Applications Sent</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={getProfileUrl(row.profile)} alt={row.userName} />
                      <Typography variant="subtitle2" fontWeight={600}>{row.userName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">{row.applicationCount}</Typography>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={2} align="center">No data available</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};

export const JobSuccessRates = () => {
  const { apiClient } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/reports/job-application-success-rates')
      .then(res => setData(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [apiClient]);

  return (
    <DashboardCard title="Application Success Rates">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        {loading ? <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box> : (
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2" fontWeight={600}>Company</Typography></TableCell>
                <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>Success Rate</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={getLogoUrl(row.logo)} sx={{ width: 30, height: 30 }} />
                      <Typography variant="subtitle2" fontWeight={600}>{row.companyName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${row.successRate.toFixed(1)}%`}
                      size="small"
                      color={row.successRate > 50 ? 'success' : row.successRate > 20 ? 'warning' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={2} align="center">No data available</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};