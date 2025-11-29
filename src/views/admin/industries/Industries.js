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
    id: 'createdAt',
    label: 'Created On',
  }
];

const Industries = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { apiClient } = useAuth();
  const navigate = useNavigate();

  const fetchIndustries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/industry/list');
      setIndustries(response.data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiClient) {
      fetchIndustries();
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
    const industryToEdit = industries.find(industry => industry.guid === selected);
    if (industryToEdit) {
      navigate('/admin/edit', {
        state: { entity: industryToEdit, type: 'industry' }
      });
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await apiClient.delete(`/industry/delete/admin/${selected}`);
        setSelected(null);
        fetchIndustries();
      } catch (err) {
        console.error("Failed to delete industry:", err);
      }
    }
  };

  const handleCreate = () => {
    const industryTemplate = {
      name: '',
      description: '',
    };
    navigate('/admin/create', {
      state: { createTemplate: industryTemplate, type: 'industry' }
    });
  };

  const filteredIndustries = useMemo(() =>
    industries.filter(industry =>
      (industry.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [industries, searchTerm]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredIndustries]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredIndustries, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <AdminTableToolbar
          title="Industries"
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
          <Box sx={{ p: 2 }}><Alert severity="error">Failed to fetch industries: {error.message}</Alert></Box>
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
              count={filteredIndustries.length}
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

export default Industries;