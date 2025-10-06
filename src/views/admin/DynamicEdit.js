import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import { Box, Button, TextField, Typography, Paper, Grid, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// --- Helper Functions --- //

const isDateTimeString = (value) => {
  if (typeof value !== 'string') return false;
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value);
};

const formatDateTimeForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate.toISOString().slice(0, 16);
  } catch (error) {
    return '';
  }
};

// --- Component --- //

const DynamicEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiClient } = useAuth();

  const { entity, type } = location.state || {};
  
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [provinces, setProvinces] = useState([]); // Corrected useState

  useEffect(() => {
    if (entity) {
      const initialData = { ...entity };
      if (type === 'user' && initialData.roleName) {
        if (initialData.roleName === 'ADMIN') {
          initialData.roleGuid = '3132eb35-6c36-11f0-8288-44fa6656cf08';
        } else if (initialData.roleName === 'USER') {
          initialData.roleGuid = '3133fe0e-6c36-11f0-8288-44fa6656cf08';
        }
      }
      setFormData(initialData);

      if (type === 'township' && apiClient) {
        const fetchProvinces = async () => {
          try {
            const response = await apiClient.get('/province/list/admin');
            setProvinces(response.data.data || []);
          } catch (err) {
            console.error("Failed to fetch provinces:", err);
          }
        }
        fetchProvinces();
      }
    } else {
      navigate(-1);
    }
  }, [entity, navigate, type, apiClient]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const excludedFields = ['guid', 'id', 'profile', 'roleName', 'roleGuid', 'provinceGuid', 'provinceName'];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);

    try {
      if (!type || !entity.guid) {
        throw new Error('Entity type or GUID is missing.');
      }
      const dataToSend = { ...formData };

      for (const key in entity) {
        if (isDateTimeString(entity[key])) {
          if (dataToSend[key]) {
            dataToSend[key] = new Date(dataToSend[key]).toISOString();
          }
        }
      }

      delete dataToSend.guid;

      await apiClient.put(`/${type}/update/admin/${entity.guid}`, dataToSend);
      navigate(-1);
    } catch (error) {
      setUpdateError(error.response.data.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!entity) {
    return null;
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Item'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {Object.entries(formData)
            .filter(([key]) => !excludedFields.includes(key))
            .map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                {typeof value === 'boolean' ? (
                  <FormControl fullWidth disabled={isUpdating}>
                    <InputLabel>{key}</InputLabel>
                    <Select name={key} value={value} label={key} onChange={handleChange}>
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                ) : isDateTimeString(value) ? (
                  <TextField
                    fullWidth
                    name={key}
                    label={key}
                    type="datetime-local"
                    value={formatDateTimeForInput(value)}
                    onChange={handleChange}
                    disabled={isUpdating}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    name={key}
                    label={key}
                    value={value || ''}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                )}
              </Grid>
            ))}

          {type === 'user' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isUpdating}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="roleGuid"
                  value={formData.roleGuid || ''}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="3132eb35-6c36-11f0-8288-44fa6656cf08">ADMIN</MenuItem>
                  <MenuItem value="3133fe0e-6c36-11f0-8288-44fa6656cf08">USER</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {type === 'township' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isUpdating}>
                <InputLabel>Province</InputLabel>
                <Select
                  name="provinceGuid"
                  value={formData.provinceGuid || ''}
                  label="Province"
                  onChange={handleChange}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.guid} value={province.guid}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        {updateError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {updateError}
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isUpdating} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default DynamicEdit;
