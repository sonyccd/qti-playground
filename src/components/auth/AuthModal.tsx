import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (mode === 'signup') {
      if (!firstName.trim()) {
        setError('First name is required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(email, password, firstName.trim());
      } else {
        await login(email, password);
      }
      // Reset form
      setEmail('');
      setPassword('');
      setFirstName('');
      setConfirmPassword('');
      onClose();
    } catch (error: unknown) {
      // Handle Firebase auth errors
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Email is already registered');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (firebaseError.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (firebaseError.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (firebaseError.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (_: React.SyntheticEvent, newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setConfirmPassword('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Tabs value={mode} onChange={handleModeChange} centered>
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {mode === 'signup' && (
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              margin="normal"
              required
              autoComplete="given-name"
              autoFocus
            />
          )}
          
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
            autoFocus={mode === 'login'}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          
          {mode === 'signup' && (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              mode === 'login' ? 'Login' : 'Sign Up'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Button
                    size="small"
                    onClick={() => setMode('signup')}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Button
                    size="small"
                    onClick={() => setMode('login')}
                    sx={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}