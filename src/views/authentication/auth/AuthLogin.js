import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Link,
  Alert
} from '@mui/material';
import { useAuth } from 'src/contexts/AuthContext.js';
import {Navigate, useNavigate} from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const validate = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }
    else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await login(formData.email, formData.password);
        navigate('/admin/dashboard');
      } catch (e) {
        setErrors({api: 'Login failed. Incorrect email or password' });
      }
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit}>
        <Stack>
          {errors.api && <Alert severity="error" sx={{ mb: 2 }}>{errors.api}</Alert>}

          <Box>
            <Typography variant="subtitle1" fontWeight={600} spacing={100} component="label" htmlFor='email' mb="100px">
              Email
            </Typography>
            <CustomTextField
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>
          <Box mt="25px">
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px">
              Password
            </Typography>
            <CustomTextField
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remeber this Device"
              />
            </FormGroup>
            <Link href="#" fontWeight="500" sx={{ textDecoration: 'none', color: 'primary.main' }}>
              Forgot Password ?
            </Link>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit">
            Sign In
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  )
};

export default AuthLogin;