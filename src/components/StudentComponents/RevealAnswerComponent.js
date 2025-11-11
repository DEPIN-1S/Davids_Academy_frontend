import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';

const RevealAnswerComponent = ({
  questionText = '',
  explanationHeading = 'Explanation',
  explanationParagraphs = [],
  additionalInfoHeading = 'Additional Info',
  additionalInfoParagraphs = [],
  additionalInfoImage = null, // URL string or null
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        padding: 4,
        backgroundColor: '#fafafa',
      }}
    >
      {/* Left - Question & Explanation */}
      <Box
        sx={{
          flex: 2,
          backgroundColor: '#fff',
          borderRadius: 3,
          padding: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        {/* Question */}
        <Typography variant="h6" mb={3}>
          {questionText}
        </Typography>

        {/* Explanation heading */}
        {explanationHeading && (
          <Typography variant="h6" fontWeight={600} mb={1} color="#2E3760">
            {explanationHeading}
          </Typography>
        )}

        {/* Explanation paragraphs */}
        {explanationParagraphs.map((para, idx) => (
          <Typography variant="body2" color="black" align='left' paragraph key={`exp-${idx}`}>
            {para}
          </Typography>
        ))}

        {/* Additional Info heading */}
        {additionalInfoHeading && additionalInfoParagraphs.length > 0 && (
          <Typography variant="h6" fontWeight={600} mt={3} mb={1} color="#2E3760">
            {additionalInfoHeading}
          </Typography>
        )}

        {/* Additional Info paragraphs */}
        {additionalInfoParagraphs.map((para, idx) => (
          <Typography variant="body2" align='left' paragraph key={`info-${idx}`}>
            {para}
          </Typography>
        ))}

        {/* Placeholder for additional info image */}

        {additionalInfoImage && (

          < Box
            component="img"
            src={'https://lunarsenterprises.com:8002' + additionalInfoImage}
            alt="Additional Info"
            sx={{ width: '100%', mt: 2, borderRadius: 2 }}
          />
        )}
      </Box>


    </Box>
  );
};

export default RevealAnswerComponent;