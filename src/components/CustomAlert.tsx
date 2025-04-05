import { Box, Typography } from '@mui/material';

interface CustomAlertProps {
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

export const CustomAlert = ({
  message,
  severity = 'error',
}: CustomAlertProps) => (
  <Box sx={{ mt: 2, width: '100%' }}>
    <Box sx={{ '& > *': { width: '100%' } }}>
      <Typography
        component="div"
        sx={{
          p: 2,
          bgcolor: severity === 'error' ? 'error.main' : 'primary.main',
          color: 'white',
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" component="div" fontWeight="bold">
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </Typography>
        <Typography component="div">{message}</Typography>
      </Typography>
    </Box>
  </Box>
);
