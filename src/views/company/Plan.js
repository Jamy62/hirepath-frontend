import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  CircularProgress, Alert, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, TextField, Divider, Stack
} from '@mui/material';
import { IconCheck, IconCreditCard, IconCrown, IconAlertCircle } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/contexts/AuthContext';

const Plan = () => {
  const { apiClient } = useAuth();
  const { t } = useTranslation();

  const [activePlan, setActivePlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentGuid, setSelectedPaymentGuid] = useState('');

  const initData = async () => {
    setLoading(true);
    try {
      const [activeRes, plansRes, paymentsRes] = await Promise.allSettled([
        apiClient.get('/company-plan/active-plan'),
        apiClient.get('/plan/list'),
        apiClient.get('/payment-method/list')
      ]);

      if (activeRes.status === 'fulfilled') {
        setActivePlan(activeRes.value.data.data);
      }

      if (plansRes.status === 'fulfilled') {
        setAvailablePlans(plansRes.value.data.data || []);
      }

      if (paymentsRes.status === 'fulfilled') {
        setPaymentMethods(paymentsRes.value.data.data || []);
        if (paymentsRes.value.data.data?.length > 0) {
          setSelectedPaymentGuid(paymentsRes.value.data.data[0].guid);
        }
      }
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handlePurchaseClick = (plan) => {
    setSelectedPlan(plan);
    setOpenModal(true);
  };

  const submitPurchase = async () => {
    if (!selectedPaymentGuid) {
      alert("Please select a payment method.");
      return;
    }

    setPurchasing(true);
    try {
      const payload = {
        planGuid: selectedPlan.guid,
        paymentMethodGuid: selectedPaymentGuid
      };

      await apiClient.post('/company-plan/purchase', payload);

      setMessage({ type: 'success', text: 'Subscription successful! Your plan is now active.' });
      setOpenModal(false);
      initData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Purchase failed.' });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <PageContainer title="Subscription" description="Manage your company's subscription plan">

      <Card sx={{ mb: 3, bgcolor: activePlan ? 'primary.light' : 'grey.100', color: activePlan ? 'primary.main' : 'text.secondary' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" gutterBottom display="flex" alignItems="center">
              <IconCrown size={24} style={{ marginRight: 8 }} />
              Current Plan: <b>{activePlan ? activePlan.plan : 'Free Tier'}</b>
            </Typography>
            {activePlan ? (
              <Typography variant="body2">
                Valid Until: {new Date(activePlan.endDate).toLocaleDateString()}
              </Typography>
            ) : (
              <Typography variant="body2">You are currently on the free tier.</Typography>
            )}
          </Box>
          <Chip
            label={activePlan ? "Active" : "Free"}
            color={activePlan ? "success" : "default"}
            sx={{ fontWeight: 'bold' }}
          />
        </CardContent>
      </Card>

      {message.text && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

      <Typography variant="h4" mb={3}>Available Plans</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3} justifyContent={availablePlans.length < 3 ? "center" : "flex-start"}>
          {availablePlans.map((plan) => (
            <Grid item xs={12} md={availablePlans.length === 1 ? 12 : (availablePlans.length === 2 ? 6 : 4)} key={plan.guid}>
              <Card sx={{
                border: activePlan?.plan === plan.name ? '2px solid #5D87FF' : '1px solid #e5eaef',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible'
              }}>
                {activePlan?.plan === plan.name && (
                  <Chip label="Current" color="primary" size="small" sx={{ position: 'absolute', top: -10, right: 20 }} />
                )}

                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom>{plan.name}</Typography>
                  <Box display="flex" justifyContent="center" alignItems="baseline" mb={1}>
                    <Typography variant="h3" color="primary" fontWeight="700">
                      {Number(plan.price).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" ml={1}>Ks</Typography>
                  </Box>
                  <Typography color="textSecondary" sx={{ mb: 3 }}>
                    Per {plan.durationDays} Days
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={1} alignItems="start">
                    <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                      <IconCheck size={18} color="green" /> {plan.description}
                    </Typography>
                    <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                      <IconCheck size={18} color="green" /> Priority Support
                    </Typography>
                    <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                      <IconCheck size={18} color="green" /> Analytics Dashboard
                    </Typography>
                  </Stack>
                </CardContent>

                <Box p={3} pt={0}>
                  <Button
                    variant={activePlan?.plan === plan.name ? "outlined" : "contained"}
                    fullWidth
                    size="large"
                    onClick={() => handlePurchaseClick(plan)}
                    disabled={activePlan?.plan === plan.name}
                  >
                    {activePlan?.plan === plan.name ? "Active" : (activePlan ? "Change Plan" : "Purchase")}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 400 }}>
          <Typography variant="body1" mb={3}>
            Upgrading to <b>{selectedPlan?.name}</b> for <b>{selectedPlan?.price} Ks</b>.
          </Typography>

          {paymentMethods.length > 0 ? (
            <TextField
              select
              label="Select Payment Method"
              fullWidth
              value={selectedPaymentGuid}
              onChange={(e) => setSelectedPaymentGuid(e.target.value)}
              helperText="Amount will be deducted from this method."
            >
              {paymentMethods.map((pm) => (
                <MenuItem key={pm.guid} value={pm.guid}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconCreditCard size={18} />
                    {pm.paymentTypeName || 'Card'} •••• {String(pm.code || pm.accountNumber).slice(-4)}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Alert severity="warning" icon={<IconAlertCircle />}>
              No payment methods found. <br/>
              <Link to="/company/payment-methods" style={{ fontWeight: 'bold' }}>Add a card here</Link> before purchasing.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={submitPurchase}
            disabled={purchasing || paymentMethods.length === 0}
          >
            {purchasing ? <CircularProgress size={24} /> : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>

    </PageContainer>
  );
};

export default Plan;