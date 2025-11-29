import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableRow, IconButton, Tooltip, Chip,
  Avatar, Stack, CircularProgress, Alert, TablePagination, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput
} from '@mui/material';
import { IconTrash, IconSearch, IconEdit } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';
import AdminTableHead from 'src/components/table/AdminTableHead.js';
import { fetchProfile } from 'src/utils/ImageUtils.js';
import DefaultProfile from "src/assets/images/profile/profile.jpg";

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

const COMPANY_ROLES_GUID_MAP = {
  'COMPANY_EMPLOYEE': 'f4492b92-3906-401a-a121-7008df6ed954',
  'COMPANY_ADMIN': '3134020e-6c36-11f0-8288-44fa6656cf08',
  'COMPANY_OWNER': '313402f3-6c36-11f0-8288-44fa6656cf08',
};

const COMPANY_ROLES_SELECT_OPTIONS = [
  { name: 'Employee', guid: COMPANY_ROLES_GUID_MAP['COMPANY_EMPLOYEE'] },
  { name: 'Admin', guid: COMPANY_ROLES_GUID_MAP['COMPANY_ADMIN'] },
  { name: 'Owner', guid: COMPANY_ROLES_GUID_MAP['COMPANY_OWNER'] },
];

const Employees = () => {
  const { apiClient, user, companyRole: currentCompanyRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tableHeaders = [
    { id: 'employee', label: 'Employee' },
    { id: 'role', label: 'Role' },
    { id: 'position', label: 'Position' },
    { id: 'joinedDate', label: 'Joined Date' },
    { id: 'actions', label: 'Action', disableSorting: true },
  ];

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('joinedDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    role: '',
    positionGuids: []
  });
  const [allPositions, setAllPositions] = useState([]);

  const fetchEmployeesAndPositions = async () => {
    setLoading(true);
    try {
      const [employeesRes, positionsRes] = await Promise.all([
        apiClient.get('/company-user/list'),
        apiClient.get('/position/list')
      ]);
      const fetchedEmployees = employeesRes.data.data || [];

      const employeesWithProfilePics = await Promise.all(
        fetchedEmployees.map(async (emp) => {
          const imageUrl = await fetchProfile(apiClient, emp.profilePicture);
          return { ...emp, profileImageUrl: imageUrl };
        })
      );

      setEmployees(employeesWithProfilePics);
      setAllPositions(positionsRes.data.data || []);
    } catch (error) {
      console.error("Fetch data failed", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndPositions();
  }, []);

  const handleDelete = async (companyUserGuid) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;

    try {
      await apiClient.post(`/company-user/delete/${companyUserGuid}`);
      setMessage({ type: 'success', text: 'Employee removed.' });
      fetchEmployeesAndPositions();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message });
    }
  };

  const getRoleColor = (role) => {
    if (role === 'COMPANY_OWNER') return 'primary';
    if (role === 'COMPANY_ADMIN') return 'secondary';
    return 'default';
  };

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

  const handleRowClick = (userGuid) => {
    navigate(`/user/profile/guest/${userGuid}`);
  };

  const filteredEmployees = useMemo(() =>
    employees.filter(emp =>
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.positions?.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())))
    ), [employees, searchTerm]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredEmployees]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredEmployees, order, orderBy, page, rowsPerPage],
  );

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditFormData({
      role: COMPANY_ROLES_GUID_MAP[emp.role] || '',
      positionGuids: emp.positions ? emp.positions.map(p => p.guid) : []
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedEmployee) return;

    try {
      const payload = {
        newRoleGuid: editFormData.role,
        positionGuids: editFormData.positionGuids
      };
      await apiClient.put(`/company-user/reassign/${selectedEmployee.guid}`, payload);
      setMessage({ type: 'success', text: 'Employee updated successfully.' });
      setOpenEditModal(false);
      fetchEmployeesAndPositions();
    } catch (error) {
      console.error("Update employee failed", error);
      setMessage({ type: 'error', text: error.response?.data?.message });
    }
  };

  const canEditOrDelete = (employeeRole) => {
    if (currentCompanyRole === 'COMPANY_OWNER') return true;
    if (currentCompanyRole === 'COMPANY_ADMIN' && employeeRole === 'COMPANY_EMPLOYEE') return true;
    return false;
  };

  return (
    <PageContainer title="Employees" description="Manage your company staff">
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Company Staff</Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search Employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><IconSearch size={18} /></InputAdornment>
              ),
            }}
          />
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
                  titles={tableHeaders}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {visibleRows.map((emp) => (
                    <TableRow
                      key={emp.guid}
                      hover
                      onClick={() => handleRowClick(emp.userGuid)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={emp.profileImageUrl}
                            alt={emp.name}
                            sx={{
                              width: 45,
                              height: 45,
                              border: '1px solid #e0e0e0'
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>{emp.name}</Typography>
                            <Typography variant="caption" color="textSecondary">{emp.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.role.replace('COMPANY_', '')}
                          color={getRoleColor(emp.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {emp.positions && emp.positions.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {emp.positions.map((p) => (
                              <Chip key={p.guid} label={p.name} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="textSecondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {canEditOrDelete(emp.role) && emp.email !== user?.email && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleOpenEdit(emp); }}>
                                <IconEdit size={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove">
                              <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(emp.guid); }}>
                                <IconTrash size={20} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleRows.length === 0 && <TableRow><TableCell colSpan={tableHeaders.length} align="center">No employees found</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredEmployees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Employee Name"
              value={selectedEmployee?.name || ''}
              fullWidth
              disabled
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                label="Role"
                disabled={currentCompanyRole !== 'COMPANY_OWNER' || selectedEmployee?.role === 'COMPANY_OWNER'}
              >
                {COMPANY_ROLES_SELECT_OPTIONS.map((r) => (
                  <MenuItem key={r.guid} value={r.guid}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="positions-select-label">Positions</InputLabel>
              <Select
                labelId="positions-select-label"
                multiple
                value={editFormData.positionGuids}
                onChange={(e) => setEditFormData({ ...editFormData, positionGuids: e.target.value })}
                input={<OutlinedInput label="Positions" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((guid) => {
                      const pos = allPositions.find(p => p.guid === guid);
                      return <Chip key={guid} label={pos ? pos.name : guid} size="small" />;
                    })}
                  </Box>
                )}
              >
                {allPositions.map((p) => (
                  <MenuItem key={p.guid} value={p.guid}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              {allPositions.length === 0 && <Typography color="error" variant="caption">No positions found</Typography>}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Employees;