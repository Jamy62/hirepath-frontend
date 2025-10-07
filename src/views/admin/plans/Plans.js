import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import {
  Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, Alert, CircularProgress, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AdminTableToolbar from 'src/components/table/AdminTableToolbar.js';
import AdminTableHead from 'src/components/table/AdminTableHead.js';

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
    id: 'name',
    label: 'Name',
  },
  {
    id: 'description',
    label: 'Description',
  },
  {
    id: 'price',
    label: 'Price',
  },
  {
    id: 'duration',
    label: 'Duration',
  },
  {
    id: 'durationDays',
    label: 'Duration (Days)',
  },
  {
    id: 'features',
    label: 'Features',
  },
  {
    id: 'createdAt',
    label: 'Created On',
  }
];

const Plans = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { apiClient } = useAuth();
  const navigate = useNavigate();

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/plan/list');
      setPlans(response.data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiClient) {
      fetchPlans();
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
    const planToEdit = plans.find(plan => plan.guid === selected);
    if (planToEdit) {
      navigate('/admin/edit', {
        state: { entity: planToEdit, type: 'plan' }
      });
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await apiClient.delete(`/plan/delete/admin/${selected}`);
        setSelected(null);
        fetchPlans();
      } catch (err) {
        console.error("Failed to delete plan:", err);
      }
    }
  };

  const handleCreate = () => {
    const planTemplate = {
      name: '',
      description: '',
      price: 0,
      duration: '',
      durationDays: 0,
      features: '',
    };
    navigate('/admin/create', {
      state: { createTemplate: planTemplate, type: 'plan' }
    });
  };

  const filteredPlans = useMemo(() =>
    plans.filter(plan =>
      (plan.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [plans, searchTerm]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredPlans]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredPlans, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <AdminTableToolbar
          title="Plans"
          selected={selected} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onCreate={handleCreate}
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
          <Box sx={{ p: 2 }}><Alert severity="error">Failed to fetch plans: {error.message}</Alert></Box>
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
                        <TableCell align="left">{row.name || 'N/A'}</TableCell>
                        <TableCell align="left">{row.description || 'N/A'}</TableCell>
                        <TableCell align="left">{row.price || 'N/A'}</TableCell>
                        <TableCell align="left">{row.duration || 'N/A'}</TableCell>
                        <TableCell align="left">{row.durationDays || 'N/A'}</TableCell>
                        <TableCell align="left">{row.features || 'N/A'}</TableCell>
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
              count={filteredPlans.length}
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

export default Plans;