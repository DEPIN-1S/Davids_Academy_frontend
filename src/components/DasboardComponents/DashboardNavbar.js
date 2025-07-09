import React from 'react';
import { Box, Button, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const navItems = [
  'My Q-Bank',
  'My Statistics',
  'Recorded Classes',
  'Notes',
  'Mock Test',
  'Previous Tests',
];

const DashboardNavbar = ({ active = 'My Q-Bank' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        {navItems.slice(0, -1).map((item) => (
          <Button
            key={item}
            fullWidth={isMobile}
            disableRipple
            sx={{
              textTransform: 'none',
              backgroundColor: item === active ? '#ffffff' : 'transparent',
              color: item === active ? '#2E3760' : '#fff',
              borderRadius: '12px',
              fontWeight: item === active ? 600 : 400,
              padding: '8px 16px',
              justifyContent: isMobile ? 'center' : 'initial',
              '&:hover': {
                backgroundColor: item === active ? '#ffffff' : '#3b4470',
              },
            }}
          >
            {item}
          </Button>
        ))}
      </Stack>
      <Button
        disableRipple
        fullWidth={isMobile}
        sx={{
          textTransform: 'none',
          color: '#fff',
          fontWeight: 500,
          marginTop: isMobile ? '8px' : 0,
          '&:hover': { backgroundColor: '#3b4470' },
        }}
      >
        {navItems[navItems.length - 1]}
      </Button>
    </Box>
  );
};

export default DashboardNavbar;
