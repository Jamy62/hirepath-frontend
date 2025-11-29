import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert,
  TablePagination
} from '@mui/material';
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

const Applications = () => {
  const { apiClient } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('applicationDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tableHeaders = [
    { id: 'jobTitle', label: t('job_title') },
    { id: 'companyName', label: t('company') },
    { id: 'applicationDate', label: t('applied_date') },
    { id: 'status', label: t('status') },
  ];

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await apiClient.get('/application/list/user');
        setApplications(response.data.data || []);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [apiClient]);

  const getStatusColor = (status) => {
    if (status === 'ACCEPTED') return 'success';
    if (status === 'REJECTED') return 'error';
    return 'warning';
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (jobGuid) => {
    navigate(`/public/job/${jobGuid}`);
  };

  const visibleRows = useMemo(
    () =>
      [...applications]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [applications, order, orderBy, page, rowsPerPage],
  );

  return (
    <PageContainer title={t('my_applications')} description={t('track_your_job_applications')}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{t('application_history')}</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{error}</Alert>}

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
                  {visibleRows.map((app) => (
                    <TableRow
                      key={app.guid}
                      hover
                      onClick={() => handleRowClick(app.jobGuid)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>{app.jobTitle}</Typography>
                      </TableCell>
                      <TableCell>{app.companyName}</TableCell>
                      <TableCell>{new Date(app.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={tableHeaders.length} align="center">
                        {t('no_applications_yet')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={applications.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>
    </PageContainer>
  );
};

export default Applications;