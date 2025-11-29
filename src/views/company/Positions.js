import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper,
  Alert, CircularProgress, TextField, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from '@mui/material';
import { IconSearch, IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import AdminTableToolbar from 'src/components/table/AdminTableToolbar.js';
import AdminTableHead from 'src/components/table/AdminTableHead.js';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';

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

const Positions = () => {
  const { apiClient } = useAuth();
  const { t } = useTranslation();

  const titles = [
    { id: 'name', label: t('position_title') },
    { id: 'description', label: t('description') },
    { id: 'createdAt', label: t('created_on') }
  ];

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/position/list');
      setPositions(response.data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name) return;

    try {
      if (modalMode === 'create') {
        await apiClient.post('/position/create', formData);
      } else {
        alert("Update not supported yet in backend.");
      }
      setOpenModal(false);
      setFormData({ name: '', description: '' });
      fetchPositions();
    } catch (e) {
      alert("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await apiClient.post(`/position/delete/${selected}`);
        setSelected(null);
        fetchPositions();
      } catch (err) {
        console.error("Failed to delete position:", err);
      }
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ name: '', description: '' });
    setOpenModal(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, guid) => {
    const newSelected = selected === guid ? null : guid;
    setSelected(newSelected);
  };

  const filteredPositions = useMemo(() =>
      positions.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())),
    [positions, searchTerm]
  );

  const visibleRows = useMemo(() =>
      [...filteredPositions]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredPositions, order, orderBy, page, rowsPerPage]
  );

  return (
    <PageContainer title={t('positions')} description={t('manage_company_titles')}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>

          <AdminTableToolbar
            title={t('positions')}
            selected={selected}
            onDelete={handleDelete}
            onCreate={handleOpenCreate}
          />

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder={t('search_positions')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><IconSearch size={18}/></InputAdornment>),
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 750 }}>
                  <AdminTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    titles={titles}
                  />
                  <TableBody>
                    {visibleRows.map((row) => {
                      const isSelected = selected === row.guid;
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.guid)}
                          role="button"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={row.guid}
                          selected={isSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.description || '-'}</TableCell>
                          <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                    {visibleRows.length === 0 && <TableRow><TableCell colSpan={3} align="center">{t('no_positions_found')}</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredPositions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, n) => setPage(n)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              />
            </>
          )}
        </Paper>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{modalMode === 'create' ? t('create_position') : t('edit_position')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label={t('position_title')} fullWidth
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            margin="dense" label={t('description')} fullWidth multiline rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {modalMode === 'create' ? t('create') : t('save')}
          </Button>
        </DialogActions>
      </Dialog>

    </PageContainer>
  );
}

export default Positions;