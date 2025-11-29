import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import { fetchCompanyLogo } from 'src/utils/ImageUtils.js';
import {
  Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, Alert, CircularProgress, TextField, InputAdornment, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AdminTableToolbar from 'src/components/table/AdminTableToolbar.js';
import AdminTableHead from 'src/components/table/AdminTableHead.js';
import DefaultCompanyLogo from "src/assets/images/logos/logo.jpg";

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
    id: 'logo',
    label: 'Logo',
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'phone',
    label: 'Phone',
  },
  {
    id: 'verificationStatus',
    label: 'Status',
  },
  {
    id: 'createdAt',
    label: 'Created On',
  }
];

const Companies = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { apiClient } = useAuth();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/company/list/admin');
      const companyList = response.data.data || [];
      const companyListUpdated = await Promise.all(
        companyList.map(async (c) => {
          const imageUrl = await fetchCompanyLogo(apiClient, c.logo);
          return { ...c, logoUrl: imageUrl };
        })
      );
      setCompanies(companyListUpdated);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiClient) {
      fetchCompanies();
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
    const companyToEdit = companies.find(company => company.guid === selected);
    if (companyToEdit) {
      navigate('/admin/edit', {
        state: { entity: companyToEdit, type: 'company' }
      });
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await apiClient.delete(`/company/delete/admin/${selected}`);
        setSelected(null);
        fetchCompanies();
      } catch (err) {
        console.error("Failed to delete company:", err);
      }
    }
  };

  const handleView = () => {
    if (selected) {
      navigate(`/company/profile/guest/${selected}`);
    }
  };

  const filteredCompanies = useMemo(() =>
    companies.filter(company =>
      (company.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [companies, searchTerm]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredCompanies]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredCompanies, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <AdminTableToolbar
          title="Companies"
          selected={selected} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onView={handleView}
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
          <Box sx={{ p: 2 }}><Alert severity="error">Failed to fetch companies: {error.message}</Alert></Box>
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
                        <TableCell align="left">
                          <Avatar
                            src={row.logoUrl}
                            alt={row.name}
                            sx={{
                              width: 45,
                              height: 45,
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{row.name || 'N/A'}</TableCell>
                        <TableCell align="left">{row.email || 'N/A'}</TableCell>
                        <TableCell align="left">{row.phone || 'N/A'}</TableCell>
                        <TableCell align="left">{row.verificationStatus || 'N/A'}</TableCell>
                        <TableCell align="left">{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredCompanies.length === 0 && (
                    <TableRow><TableCell colSpan={titles.length} align="center">No companies found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCompanies.length}
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

export default Companies;