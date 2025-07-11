import React, { useState } from 'react';
import {
  Box, Button, Chip, InputBase, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DoneIcon from '@mui/icons-material/Done';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const filters = ['All', 'Correct', 'Incorrect', 'Marked', 'Omitted'];

const sampleData = [
  {
    id: 11164,
    position: 1,
    clientNeed: 'Reduction of Risk Potential',
    subject: 'Fundamentals',
    topic: 'Potential for Alterations in Body Systems',
    lesson: 'Cardiovascular',
    avgScore: '71%',
    difficulty: 'Easy',
    time: '3 sec',
    status: 'Correct',
  },
];

const ScoreTableComponent = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('Classic');
  const [needType, setNeedType] = useState('Client Need');
  const [topicType, setTopicType] = useState('Topic');

  const filteredData = sampleData.filter((row) =>
    (activeFilter === 'All' || row.status === activeFilter) &&
    row.clientNeed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Filters + Search + Toggle */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        spacing={2}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'contained' : 'outlined'}
              onClick={() => setActiveFilter(filter)}
              sx={{
                borderRadius: '20px',
                backgroundColor: activeFilter === filter ? '#FFD54F' : undefined,
              }}
            >
              {filter}
            </Button>
          ))}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Paper component="form" sx={{ p: '2px 8px', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, val) => val && setMode(val)}
            size="small"
            color="primary"
          >
            <ToggleButton value="Classic">Classic (47)</ToggleButton>
            <ToggleButton value="NGN">NGN (38)</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#2E3760' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Pos.</TableCell>
              <TableCell sx={{ color: '#fff' }}>Q.ID</TableCell>

              {/* Client Need / Subject Toggle */}
              <TableCell sx={{ color: '#fff' }}>
                <ToggleButtonGroup
                  value={needType}
                  exclusive
                  onChange={(e, val) => val && setNeedType(val)}
                  size="small"
                  sx={{
                    backgroundColor: '#8a8a8a',
                    borderRadius: '50px',
                    padding: '2px',
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 'none',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      px: 2,
                      py: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: '#fff',
                        color: '#333',
                        borderRadius: '50px',
                      },
                      '&:not(:last-of-type)': {
                        borderRight: '1px solid transparent',
                      },
                      '&:hover': {
                        backgroundColor: '#bcbcbc',
                      },
                    },
                  }}
                >
                  <ToggleButton value="Client Need">Client Need</ToggleButton>
                  <Box display="flex" alignItems="center" px={1} sx={{ color: '#fff', userSelect: 'none' }}>
                    <SyncAltIcon fontSize="small" />
                  </Box>
                  <ToggleButton value="Subject">Subject</ToggleButton>
                </ToggleButtonGroup>
              </TableCell>

              {/* Topic / Lesson Toggle */}
              <TableCell sx={{ color: '#fff' }}>
                <ToggleButtonGroup
                  value={topicType}
                  exclusive
                  onChange={(e, val) => val && setTopicType(val)}
                  size="small"
                  sx={{
                    backgroundColor: '#8a8a8a',
                    borderRadius: '50px',
                    padding: '2px',
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 'none',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      px: 2,
                      py: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: '#fff',
                        color: '#333',
                        borderRadius: '50px',
                      },
                      '&:not(:last-of-type)': {
                        borderRight: '1px solid transparent',
                      },
                      '&:hover': {
                        backgroundColor: '#bcbcbc',
                      },
                    },
                  }}
                >
                  <ToggleButton value="Topic">Topic</ToggleButton>
                  <Box display="flex" alignItems="center" px={1} sx={{ color: '#fff', userSelect: 'none' }}>
                    <SyncAltIcon fontSize="small" />
                  </Box>
                  <ToggleButton value="Lesson">Lesson</ToggleButton>
                </ToggleButtonGroup>
              </TableCell>

              <TableCell sx={{ color: '#fff' }}>Avg. Peer Score</TableCell>
              <TableCell sx={{ color: '#fff' }}>Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Chip icon={<DoneIcon />} label={row.position} size="small" color="success" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#00BFFF', cursor: 'pointer', textDecoration: 'underline' }}>
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell>{needType === 'Client Need' ? row.clientNeed : row.subject}</TableCell>
                <TableCell>{topicType === 'Topic' ? row.topic : row.lesson}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">{row.avgScore}</Typography>
                    <Chip
                      label={row.difficulty}
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Stack>
                </TableCell>
                <TableCell>{row.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScoreTableComponent;
