import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip,
  Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, OutlinedInput,
  TablePagination, Avatar
} from '@mui/material';
import { IconCheck, IconX, IconEye } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';
import AdminTableHead from 'src/components/table/AdminTableHead.js';
import DefaultProfile from "src/assets/images/profile/profile.jpg";

const COMPANY_ROLES = [
  { name: 'Company Employee', guid: 'f4492b92-3906-401a-a121-7008df6ed954' },
  { name: 'Company Admin', guid: '3134020e-6c36-11f0-8288-44fa6656cf08' }
];

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

const Applicants = () => {
  const { apiClient } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tableHeaders = [
    { id: 'profilePicture', label: t('profile') },
    { id: 'applicantName', label: t('candidate') },
    { id: 'jobTitle', label: t('applied_for') },
    { id: 'applicationDate', label: t('date') },
    { id: 'status', label: t('status') },
    { id: 'actions', label: t('actions'), disableSorting: true },
  ];

  const [applicants, setApplicants] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [openAccept, setOpenAccept] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [acceptForm, setAcceptForm] = useState({
    positionGuids: [],
    roleGuid: COMPANY_ROLES[0].guid
  });

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('applicationDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchApplicants = async () => {
    try {
      const response = await apiClient.get('/application/list/company');
      const fetchedApplicants = response.data.data || [];
      const applicantsWithProfilePics = fetchedApplicants.map(app => ({
        ...app,
        profilePictureUrl: app.profilePicture ? `https://jamydev.com/v1/files/download/images/${app.profilePicture}` : DefaultProfile
      }));
      setApplicants(applicantsWithProfilePics);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'failed to load applicants' });
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await apiClient.get('/position/list');
      setPositions(response.data.data || []);
    } catch (error) {
      console.error("Positions failed", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'failed to load positions' });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchApplicants(), fetchPositions()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (userGuid) => {
    navigate(`/user/profile/guest/${userGuid}`);
  };

  const handleReject = async (e, guid) => {
    e.stopPropagation();
    if (!window.confirm('Reject applicant confirmation')) return;
    setActionLoading(true);
    try {
      await apiClient.post(`/application/reject/${guid}`);
      setMessage({ type: 'success', text: 'Applicant rejected.' });
      fetchApplicants();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || t('action_failed') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenAccept = (e, app) => {
    e.stopPropagation();
    setSelectedApp(app);
    setAcceptForm({
      positionGuids: [],
      roleGuid: COMPANY_ROLES[0].guid
    });
    setOpenAccept(true);
  };

  const submitAccept = async () => {
    if (acceptForm.positionGuids.length === 0 || !acceptForm.roleGuid) {
      alert(t('select_position_and_role'));
      return;
    }
    setActionLoading(true);
    try {
      await apiClient.post(`/application/accept/${selectedApp.applicationGuid}`, {
        positionGuids: acceptForm.positionGuids,
        roleGuid: acceptForm.roleGuid
      });
      setMessage({ type: 'success', text: 'Applicant Accepted!' });
      setOpenAccept(false);
      fetchApplicants();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || t('action_failed') });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'ACCEPTED') return 'success';
    if (status === 'REJECTED') return 'error';
    return 'warning';
  };

  const visibleRows = useMemo(
    () =>
      [...applicants]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [applicants, order, orderBy, page, rowsPerPage],
  );

  return (
    <PageContainer title={t('applicants')} description={t('manage_hiring')}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{t('job_applicants')}</Typography>
        </Box>

        {message.text && <Alert severity={message.type} sx={{ mx: 2, mb: 2 }} onClose={() => setMessage({type:'', text:''})}>{message.text}</Alert>}

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
                      key={app.applicationGuid}
                      hover
                      onClick={() => handleRowClick(app.userGuid)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Avatar
                          src={app.profilePictureUrl}
                          alt={app.applicantName}
                          sx={{
                            width: 45,
                            height: 45,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>{app.applicantName}</Typography>
                      </TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>{new Date(app.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell><Chip label={app.status} color={getStatusColor(app.status)} size="small" /></TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('view_resume')}>
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/company/resume/viewer/${app.resumeGuid}`);
                            }}
                          >
                            <IconEye size={20} />
                          </IconButton>
                        </Tooltip>
                        {app.status === 'PENDING' && (
                          <>
                            <Tooltip title={t('accept')}><IconButton color="success" onClick={(e) => handleOpenAccept(e, app)} disabled={actionLoading}><IconCheck /></IconButton></Tooltip>
                            <Tooltip title={t('reject')}><IconButton color="error" onClick={(e) => handleReject(e, app.applicationGuid)} disabled={actionLoading}><IconX /></IconButton></Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleRows.length === 0 && <TableRow><TableCell colSpan={tableHeaders.length} align="center">{t('no_applicants_found')}</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={applicants.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      <Dialog open={openAccept} onClose={() => setOpenAccept(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('accept_candidate')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" mb={2}>
            {t('accepting')} <b>{selectedApp?.applicantName}</b> {t('for')} <b>{selectedApp?.jobTitle}</b>.
          </Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('company_role')}</InputLabel>
            <Select
              label={t('company_role')}
              value={acceptForm.roleGuid}
              onChange={(e) => setAcceptForm({...acceptForm, roleGuid: e.target.value})}
            >
              {COMPANY_ROLES.map((r) => (
                <MenuItem key={r.guid} value={r.guid}>{r.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel id="position-label">{t('assign_positions')}</InputLabel>
            <Select
              labelId="position-label"
              multiple
              value={acceptForm.positionGuids}
              onChange={(e) => setAcceptForm({...acceptForm, positionGuids: e.target.value})}
              input={<OutlinedInput label={t('assign_positions')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((guid) => {
                    const pos = positions.find(p => p.guid === guid);
                    return <Chip key={guid} label={pos ? pos.name : guid} size="small" />;
                  })}
                </Box>
              )}
            >
              {positions.map((p) => (
                <MenuItem key={p.guid} value={p.guid}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {positions.length === 0 && <Typography color="error" variant="caption">{t('no_positions_found')}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAccept(false)}>{t('cancel')}</Button>
          <Button variant="contained" color="success" onClick={submitAccept} disabled={actionLoading || positions.length === 0}>{t('confirm')}</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Applicants;