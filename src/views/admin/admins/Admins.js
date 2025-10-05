import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AdminTableToolbar from 'src/components/table/AdminTableToolbar.js';
import AdminTableHead from 'src/components/table/AdminTableHead.js';
import {fetchProfile} from "../../../utils/ImageUtils.js";
import DefaultProfile from "../../../assets/images/profile/profile.jpg";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const titles = [
  {
    id: 'profile',
    label: 'Profile',
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'fullName',
    label: 'Full Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'mobile',
    label: 'Mobile',
  },
  {
    id: 'isActive',
    label: 'Active',
  },
  {
    id: 'isBlocked',
    label: 'Blocked',
  },
  {
    id: 'createdAt',
    label: 'Created On',
  }
];

const Admins = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { apiClient } = useAuth();
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/user/admin-list/admin');
      const adminList = response.data.data || [];
      const adminListUpdated = await Promise.all(
        adminList.map(async (a) => {
          const imageUrl = await fetchProfile(apiClient, a.profile);
          a.profile = imageUrl;
          return { ...a };
        })
      )
      setAdmins(adminListUpdated);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiClient) {
      fetchAdmins();
    }
  }, [apiClient]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, guid) => {
    const newSelected = selected === guid ? null : guid;
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = () => {
    const adminToEdit = admins.find(admin => admin.guid === selected);
    if (adminToEdit) {
      navigate('/user/edit', {
        state: { entity: adminToEdit, type: 'user' }
      });
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await apiClient.delete(`/user/delete/${selected}`);
        setSelected(null);
        fetchAdmins();
      } catch (err) {
        console.error("Failed to delete admin:", err);
      }
    }
  };

  const filteredAdmins = useMemo(() =>
    admins.filter(admin =>
      (admin.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [admins, searchTerm]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredAdmins]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredAdmins, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <AdminTableToolbar
          title="Admins"
          selected={selected} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ),
            }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Box sx={{ p: 2 }}><Alert severity="error">Failed to fetch admins: {error.message}</Alert></Box>
        ) : (
          <>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <AdminTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  titles={titles}
                />
                <TableBody>
                  {visibleRows.map((row) => {
                    const isItemSelected = selected === row.guid;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.guid)}
                        role="button"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.guid}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell align="center">
                          <Avatar
                            src={row.profile}
                            alt={DefaultProfile}
                            sx={{
                              width: 45,
                              height: 45,
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{row.name || 'N/A'}</TableCell>
                        <TableCell align="left">{row.fullName || 'N/A'}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.mobile || 'N/A'}</TableCell>
                        <TableCell align="left">{row.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="left">{row.isBlocked ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="left">{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAdmins.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Admins;
