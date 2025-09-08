
import React, { useState } from 'react';
import {
  Box, Button, Chip, InputBase, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DoneIcon from '@mui/icons-material/Done';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const filters = ['All', 'Correct', 'Incorrect', 'Marked', 'Omitted'];

const ScoreTableComponent = ({ data = [] }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('Classic');
  const [needType, setNeedType] = useState('Client Need');
  const [topicType, setTopicType] = useState('Topic');

  const filteredData = data.filter((row) =>
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
            <ToggleButton value="Classic">Classic</ToggleButton>
            <ToggleButton value="NGN">NGN</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#2e3760' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Pos.</TableCell>
              <TableCell sx={{ color: 'white' }}>Test ID</TableCell>
              <TableCell sx={{ color: 'white' }}>
                <ToggleButtonGroup
                  value={needType}
                  exclusive
                  onChange={(e, val) => val && setNeedType(val)}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="Client Need">Client Need</ToggleButton>
                  <Box display="flex" alignItems="center" px={1} sx={{ color: 'white' }}>
                    <SyncAltIcon fontSize="small" />
                  </Box>
                  <ToggleButton value="Subject">Subject</ToggleButton>
                </ToggleButtonGroup>
              </TableCell>
              <TableCell sx={{ color: 'white' }}>
                <ToggleButtonGroup
                  value={topicType}
                  exclusive
                  onChange={(e, val) => val && setTopicType(val)}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="Topic">Topic</ToggleButton>
                  <Box display="flex" alignItems="center" px={1} sx={{ color: 'white' }}>
                    <SyncAltIcon fontSize="small" />
                  </Box>
                  <ToggleButton value="Lesson">Lesson</ToggleButton>
                </ToggleButtonGroup>
              </TableCell>
              <TableCell sx={{ color: 'white' }}>Avg. Peer Score</TableCell>
              <TableCell sx={{ color: 'white' }}>Time</TableCell>
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
