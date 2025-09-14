
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext.js';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthRegister = ({ title, subtitle, subtext }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) {
            tempErrors.name = "Name is required.";
        }

        if (!formData.email) {
            tempErrors.email = "Email is required.";
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Invalid email format.";
        }

        if (!formData.password) {
            tempErrors.password = "Password is required";
        }
        else if (formData.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters long.";
        }

        if (!formData.confirmPassword) {
          tempErrors.confirmPassword = "Confirm password is required";
        }
        else if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await register(formData.name, formData.email, formData.password);
                navigate('/auth/login');
            } catch (err) {
                setErrors({ api: 'Registration failed. Please try again.' });
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
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='name' mb="5px">Name</Typography>
                        <CustomTextField
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                        />

                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
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

                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
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

                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='confirmPassword' mb="5px" mt="25px">Confirm Password</Typography>
                        <CustomTextField
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                    </Box>
                </Stack>
                <Box mt={3}>
                    <Button color="primary" variant="contained" size="large" fullWidth type="submit">
                        Sign Up
                    </Button>
                </Box>
            </form>
            {subtitle}
        </>
    );
};

export default AuthRegister;
