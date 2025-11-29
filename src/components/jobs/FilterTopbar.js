import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, FormControl, Select, MenuItem,
  TextField, Button, Grid, InputLabel, IconButton, Collapse
} from '@mui/material';
import { IconFilter, IconX, IconSearch } from '@tabler/icons-react';
import { useAuth } from 'src/contexts/AuthContext';

const FilterTopBar = ({ onFilterChange, initialSearch = '' }) => {
  const { apiClient } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const [metadata, setMetadata] = useState({
    industries: [],
    jobTypes: [],
    provinces: [],
    experienceLevels: [],
    jobFunctions: []
  });

  const [filters, setFilters] = useState({
    searchTitle: initialSearch,
    industryGuid: '',
    jobTypeGuid: '',
    provinceGuid: '',
    experienceLevelGuid: '',
    jobFunctionGuid: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ind, type, prov, exp, func] = await Promise.all([
          apiClient.get('/industry/list'),
          apiClient.get('/job-type/list'),
          apiClient.get('/province/list'),
          apiClient.get('/experience-level/list'),
          apiClient.get('/job-function/list')
        ]);
        setMetadata({
          industries: ind.data.data || [],
          jobTypes: type.data.data || [],
          provinces: prov.data.data || [],
          experienceLevels: exp.data.data || [],
          jobFunctions: func.data.data || []
        });
      } catch (e) {
        console.error("Filter load error", e);
      }
    };
    fetchData();
  }, [apiClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const reset = { searchTitle: '', industryGuid: '', jobTypeGuid: '', provinceGuid: '', experienceLevelGuid: '', jobFunctionGuid: '' };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search job title..."
              name="searchTitle"
              value={filters.searchTitle}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select name="provinceGuid" label="Location" value={filters.provinceGuid} onChange={handleChange}>
                <MenuItem value="">All Locations</MenuItem>
                {metadata.provinces.map(p => <MenuItem key={p.guid} value={p.guid}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={5} display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="contained" startIcon={<IconSearch size={18} />} onClick={handleSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={() => setExpanded(!expanded)} startIcon={<IconFilter size={18} />}>
              {expanded ? 'Hide Filters' : 'More Filters'}
            </Button>
            {(filters.industryGuid || filters.jobTypeGuid || filters.jobFunctionGuid) && (
              <Button color="error" onClick={handleReset}>Reset</Button>
            )}
          </Grid>

          <Grid item xs={12}>
            <Collapse in={expanded}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Industry</InputLabel>
                    <Select name="industryGuid" label="Industry" value={filters.industryGuid} onChange={handleChange}>
                      <MenuItem value="">All Industries</MenuItem>
                      {metadata.industries.map(i => <MenuItem key={i.guid} value={i.guid}>{i.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Job Type</InputLabel>
                    <Select name="jobTypeGuid" label="Job Type" value={filters.jobTypeGuid} onChange={handleChange}>
                      <MenuItem value="">All Types</MenuItem>
                      {metadata.jobTypes.map(t => <MenuItem key={t.guid} value={t.guid}>{t.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Experience</InputLabel>
                    <Select name="experienceLevelGuid" label="Experience" value={filters.experienceLevelGuid} onChange={handleChange}>
                      <MenuItem value="">Any Level</MenuItem>
                      {metadata.experienceLevels.map(e => <MenuItem key={e.guid} value={e.guid}>{e.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Job Function</InputLabel>
                    <Select name="jobFunctionGuid" label="Job Function" value={filters.jobFunctionGuid} onChange={handleChange}>
                      <MenuItem value="">All Functions</MenuItem>
                      {metadata.jobFunctions.map(f => <MenuItem key={f.guid} value={f.guid}>{f.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FilterTopBar;