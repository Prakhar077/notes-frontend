import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import API from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6).required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await API.post('/auth/register', values);
        navigate('/login');
      } catch (err) {
        alert('Registration failed');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="normal"
          label="Email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth margin="normal" type="password"
          label="Password"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Register
        </Button>
        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Register;
