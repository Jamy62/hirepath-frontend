import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Card, CardContent, Typography, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Alert, CircularProgress, Chip
} from '@mui/material';
import { IconPlus, IconTrash, IconCreditCard } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';

const PaymentMethods = () => {
  const { apiClient } = useAuth();
  const { t } = useTranslation();

  const [methods, setMethods] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    paymentTypeGuid: '',
    code: '',
    cvv: ''
  });

  const fetchMethods = async () => {
    try {
      const response = await apiClient.get('/payment-method/list');
      setMethods(response.data.data || []);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await apiClient.get('/payment-type/list');
      setPaymentTypes(response.data.data || []);
    } catch (error) {
      console.error("Failed to load payment types", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMethods(), fetchPaymentTypes()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleCreate = async () => {
    if (!formData.code || !formData.cvv || !formData.paymentTypeGuid) {
      alert("Please fill all fields");
      return;
    }

    setActionLoading(true);
    try {
      await apiClient.post('/payment-method/create', formData);

      setMessage({ type: 'success', text: 'Payment Method Added' });
      setOpen(false);
      setFormData({ paymentTypeGuid: '', code: '', cvv: '' });
      fetchMethods();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (guid) => {
    if(!window.confirm("Delete this payment method?")) return;

    try {
      await apiClient.delete(`/payment-method/delete/admin/${guid}`);
      setMessage({ type: 'success', text: 'Deleted successfully.' });
      fetchMethods();
    } catch (error) {
      setMessage({ type: 'error', text: 'Delete failed.' });
    }
  };

  return (
    <PageContainer title={t('payment_methods')} description={t('manage_wallet')}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">{t('payment_methods')}</Typography>
            <Button variant="contained" startIcon={<IconPlus />} onClick={() => setOpen(true)}>
              {t('add_new')}
            </Button>
          </Box>

          {message.text && <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({type:'', text:''})}>{message.text}</Alert>}

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('payment_type')}</TableCell>
                    <TableCell>{t('card_account_number')}</TableCell>
                    <TableCell>{t('created_on')}</TableCell>
                    <TableCell align="right">{t('action')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {methods.map((pm) => (
                    <TableRow key={pm.guid}>
                      <TableCell>
                        <Chip
                          icon={<IconCreditCard size={16}/>}
                          label={pm.paymentTypeName || 'Unknown'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {pm.cardCode}
                      </TableCell>
                      <TableCell>
                        {pm.createdAt ? new Date(pm.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => handleDelete(pm.guid)}>
                          <IconTrash size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {methods.length === 0 && <TableRow><TableCell colSpan={4} align="center">{t('no_payment_methods_added')}</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('add_payment_method')}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label={t('payment_type')}
            fullWidth
            margin="dense"
            value={formData.paymentTypeGuid}
            onChange={(e) => setFormData({...formData, paymentTypeGuid: e.target.value})}
          >
            {paymentTypes.map((pt) => (
              <MenuItem key={pt.guid} value={pt.guid}>
                {pt.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('account_card_number')}
            fullWidth
            margin="dense"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
          />
          <TextField
            label={t('cvv_security_code')}
            fullWidth
            margin="dense"
            type="password"
            value={formData.cvv}
            onChange={(e) => setFormData({...formData, cvv: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleCreate} disabled={actionLoading || paymentTypes.length === 0}>{t('save')}</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default PaymentMethods;