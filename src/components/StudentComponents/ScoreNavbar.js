
import React from 'react';
import { Box, Button, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Score', path: '/score' },
  { label: 'View explanations', path: '/view-Explanations' },
];

const ScoreNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '0 0 20px 20px',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
        {navItems.slice(0, 1).map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Button
              key={label}
              onClick={() => navigate(path)}
              fullWidth={isMobile}
              disableRipple
              sx={{
                textTransform: 'none',
                backgroundColor: isActive ? '#f0c94a' : 'transparent',
                color: isActive ? '#04121f' : '#374151',
                borderRadius: '12px',
                fontWeight: isActive ? 700 : 500,
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: isActive ? '#fbbf24' : 'rgba(29, 78, 216, 0.08)',
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
        {navItems.slice(1).map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Button
              key={label}
              onClick={() => navigate(path)}
              fullWidth={isMobile}
              disableRipple
              sx={{
                textTransform: 'none',
                backgroundColor: isActive ? '#f0c94a' : 'transparent',
                color: isActive ? '#04121f' : '#374151',
                borderRadius: '12px',
                fontWeight: isActive ? 700 : 500,
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: isActive ? '#fbbf24' : 'rgba(29, 78, 216, 0.08)',
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default ScoreNavbar;
