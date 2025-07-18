import React from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

export const LoadingCard: React.FC = () => (
  <Card sx={{ mb: 4 }}>
    <CardContent sx={{ textAlign: 'center', py: 8 }}>
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography color="text.secondary">Processing QTI file...</Typography>
    </CardContent>
  </Card>
);