import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ResultModal from './ResultModal';

const RevealAnswerComponent = ({
  questionText = '',
  explanationHeading = 'Explanation',
  explanationParagraphs = [],
  additionalInfoHeading = 'Additional Info',
  additionalInfoParagraphs = [],
  additionalInfoImage = null, // URL string or null
  isAnswerCorrect, // ← Destructure here
}) => {
  console.log("inside reveal answer  hhhfff", isAnswerCorrect); // true or false
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openModal, setOpenModal] = React.useState(true);  // or false initially
  sessionStorage.setItem("isRevealed", "true");


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
      <ResultModal open={openModal}
        handleClose={() => setOpenModal(false)}
        isAnswerCorrect={isAnswerCorrect} />
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

        {/* Explanation heading (supports custom HTML) */}
        {explanationHeading && (
          <Typography
            variant="h6"
            fontWeight={600}
            mb={1}
            color="#2E3760"
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            dangerouslySetInnerHTML={{ __html: explanationHeading }}
          />
        )}

        {/* Explanation paragraphs (supports HTML) */}
        {explanationParagraphs.map((para, idx) => (
          <Typography
            key={`exp-${idx}`}
            variant="body2"
            color="black"
            align="left"
            paragraph
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}

        {/* Additional Info heading (supports custom HTML) */}
        {additionalInfoHeading && additionalInfoParagraphs.length > 0 && (
          <Typography
            variant="h6"
            fontWeight={600}
            mt={3}
            mb={1}
            color="#2E3760"
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            dangerouslySetInnerHTML={{ __html: additionalInfoHeading }}
          />
        )}

        {/* Additional Info paragraphs (supports HTML) */}
        {additionalInfoParagraphs.map((para, idx) => (
          <Typography
            key={`info-${idx}`}
            variant="body2"
            align="left"
            paragraph
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}

        {/* Additional Info Image */}
        {additionalInfoImage && (
          <Box
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
