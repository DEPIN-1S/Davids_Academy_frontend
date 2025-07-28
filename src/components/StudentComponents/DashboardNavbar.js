import React from 'react';
import { Box, Button, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'My Q-Bank', path: '/student/question-bank' },
  { label: 'My Statistics', path: '/student/my-statistics' },
  { label: 'Recorded Classes', path: '/student/recorded-class' },
  { label: 'Notes', path: '/student/notes' },
  { label: 'Mock Test', path: '/student/mock-test' },
  { label: 'Previous Tests', path: '/student/previous-tests' },
];
const DashboardNavbar = () => {
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
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 1 : 3}
        alignItems={isMobile ? 'stretch' : 'center'}
        width={isMobile ? '100%' : 'auto'}
      >
        {navItems.map(({ label, path }) => {
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
                justifyContent: isMobile ? 'center' : 'initial',
                '&:hover': {
                  backgroundColor: isActive ? '#ffffff' : '#3b4470',
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DashboardNavbar;
