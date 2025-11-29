import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import { Box, Button, TextField, Typography, Paper, Grid, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const DynamicCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiClient } = useAuth();

  const { createTemplate, type } = location.state || {};
  const [provinces, setProvinces] = useState([]);

  const [formData, setFormData] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const excludedFields = ['provinceName', 'provinceGuid'];

  useEffect(() => {
    if (createTemplate) {
      setFormData(createTemplate);
    } else {
      navigate(-1);
    }

    if (type === 'township' && apiClient) {
      const fetchProvinces = async () => {
        try {
          const response = await apiClient.get('/province/list');
          setProvinces(response.data.data || []);
        } catch (err) {
          console.error("Failed to fetch provinces:", err);
        }
      }
      fetchProvinces();
    }
  }, [createTemplate, navigate, type, apiClient]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      if (!type) {
        throw new Error('Entity type is missing.');
      }
      const dataToSend = { ...formData };
      await apiClient.post(`/${type}/create/admin`, dataToSend);

      navigate(-1);
    } catch (error) {
      setCreateError(error.response.data.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!createTemplate) {
    return null;
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Item'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {Object.keys(formData)
            .filter(key => !excludedFields.includes(key))
            .map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key]}
                  onChange={handleChange}
                  disabled={isCreating}
                />
              </Grid>
            ))}

          {type === 'township' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isCreating}>
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

        {createError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {createError}
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isCreating} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isCreating}>
            {isCreating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default DynamicCreate;