import { useState, useMemo, useEffect } from 'react';
import { useAuth } from 'src/contexts/AuthContext';
import {
  Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper,
  Alert, CircularProgress, TextField, InputAdornment, IconButton, Tooltip, Chip, Avatar
} from '@mui/material';
import { IconCheck, IconX, IconSearch } from '@tabler/icons-react';
import AdminTableToolbar from 'src/components/table/AdminTableToolbar.js';
import AdminTableHead from 'src/components/table/AdminTableHead.js';
import { fetchCompanyLogo } from 'src/utils/ImageUtils.js';

const titles = [
  { id: 'logo', label: 'Logo' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'verificationStatus', label: 'Status' },
  { id: 'createdAt', label: 'Requested On' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const CompanyVerificationRequests = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const { apiClient } = useAuth();

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/company/verify-list/admin');
      const fetchedRequests = response.data.data || [];

      const requestsWithLogos = await Promise.all(
        fetchedRequests.map(async (req) => {
          const logoUrl = await fetchCompanyLogo(apiClient, req.logo);
          return { ...req, logoUrl };
        })
      );
      setRequests(requestsWithLogos);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiClient) fetchRequests();
  }, [apiClient]);

  const handleVerification = async (companyGuid, isApproved) => {
    if(!window.confirm(`Are you sure you want to ${isApproved ? 'Verify' : 'Decline'} this company?`)) return;

    setActionLoading(true);
    try {
      const payload = {
        response: isApproved,
        message: isApproved ? "Company Verified by Admin" : "Company Verification Declined"
      };
      await apiClient.put(`/company/verify/response/admin/${companyGuid}`, payload);

      fetchRequests();
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = useMemo(() =>
    requests.filter(req =>
      (req.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [requests, searchTerm]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h2 style={{ margin: 0 }}>Verification Requests</h2>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch size={18}/></InputAdornment>) }}
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <AdminTableHead order={order} orderBy={orderBy} onRequestSort={(e, p) => { setOrder(order === 'asc' ? 'desc' : 'asc'); setOrderBy(p); }} titles={titles} />
                <TableBody>
                  {filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.guid} hover>
                      <TableCell>
                        <Avatar
                          src={row.logoUrl}
                          alt={row.name}
                          sx={{
                            width: 45,
                            height: 45,
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.verificationStatus}
                          color={row.verificationStatus === 'PENDING' ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleVerification(row.guid, true)}
                            disabled={actionLoading}
                          >
                            <IconCheck />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Decline">
                          <IconButton
                            color="error"
                            onClick={() => handleVerification(row.guid, false)}
                            disabled={actionLoading}
                          >
                            <IconX />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 && (
                    <TableRow><TableCell colSpan={6} align="center">No pending requests</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRequests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, n) => setPage(n)}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CompanyVerificationRequests;