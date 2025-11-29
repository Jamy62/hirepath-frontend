import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableRow, Chip, IconButton, Tooltip,
  CircularProgress, Button, TablePagination, TextField, InputAdornment
} from '@mui/material';
import { IconEye, IconPlus, IconTrash, IconSearch } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';
import AdminTableHead from 'src/components/table/AdminTableHead.js';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const CompanyJobs = () => {
  const { apiClient, company, companyRole } = useAuth();
  const { t } = useTranslation();

  const tableHeaders = [
    { id: 'title', label: t('title') },
    { id: 'jobType', label: t('type') },
    { id: 'createdAt', label: t('posted_date') },
    { id: 'status', label: t('status') },
    { id: 'actions', label: t('actions'), disableSorting: true },
  ];

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/job/list', {
        params: { companyGuid: company.guid }
      });
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Fetch jobs failed", error);
      alert(error.response?.data?.message || 'failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchMyJobs();
    }
  }, [company, apiClient, t]);

  const handleDeleteJob = async (jobGuid) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiClient.delete(`/job/${jobGuid}`);
        setJobs(jobs.filter(job => job.guid !== jobGuid));
      } catch (error) {
        console.error("Delete job failed", error);
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const canDeleteJob = useMemo(() => {
    return companyRole === 'COMPANY_OWNER' || companyRole === 'COMPANY_ADMIN';
  }, [companyRole]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredJobs = useMemo(() =>
    jobs.filter(job =>
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.jobType || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [jobs, searchTerm]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredJobs]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredJobs, order, orderBy, page, rowsPerPage],
  );

  return (
    <PageContainer title={t('my_jobs')} description={t('manage_postings')}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{t('active_job_postings')}</Typography>
          <Button component={Link} to="/company/job/create" variant="contained" startIcon={<IconPlus />}>
            {t('post_new_job')}
          </Button>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder={t('search_jobs')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><IconSearch size={18} /></InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <AdminTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  titles={tableHeaders}
                />
                <TableBody>
                  {visibleRows.map((job) => (
                    <TableRow key={job.guid} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>{job.title}</Typography>
                        <Typography variant="caption" color="textSecondary">{job.location}</Typography>
                      </TableCell>
                      <TableCell><Chip label={job.jobType} size="small" /></TableCell>
                      <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={t('active')} color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('view_public_page')}>
                          <IconButton component={Link} to={`/public/job/${job.guid}`} color="primary">
                            <IconEye size={20} />
                          </IconButton>
                        </Tooltip>
                        {canDeleteJob && (
                          <Tooltip title="Delete Job">
                            <IconButton onClick={() => handleDeleteJob(job.guid)} color="error">
                              <IconTrash size={20} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleRows.length === 0 && <TableRow><TableCell colSpan={tableHeaders.length} align="center">{t('no_jobs_posted_yet')}</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredJobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </PageContainer>
  );
};

export default CompanyJobs;