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
        backgroundColor: '#2E3760',
        borderRadius: '0 0 20px 20px',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
      }}
    >
      {/* Left side (Score) */}
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
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2E3760' : '#fff',
                borderRadius: '12px',
                fontWeight: isActive ? 600 : 400,
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: isActive ? '#ffffff' : '#3b4470',
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>

      {/* Right side (View Explanations) */}
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
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2E3760' : '#fff',
                borderRadius: '12px',
                fontWeight: isActive ? 600 : 400,
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: isActive ? '#ffffff' : '#3b4470',
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
