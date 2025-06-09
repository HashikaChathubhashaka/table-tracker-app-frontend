import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const token = res.data.access_token;
      login(token);

      navigate('/home');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    
    <div>
    
    <Box
    sx={{
      display: "flex",
      flexDirection:"vertical",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      width: "100vw",
      backgroundColor: "#F9FAFB",
    }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Log in 
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>

  </div>

  );
};

export default Login;
