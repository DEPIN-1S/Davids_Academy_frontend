import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ResultModal from './ResultModal';
import { useContext, useEffect } from "react";
import { SampleQuestionnaireResultContext } from '../../context/ResultProvider';



const RevealAnswerComponent = ({
  questionText = '',
  explanationHeading = 'Explanation',
  explanationParagraphs = [],
  additionalInfoHeading = 'Additional Info',
  additionalInfoParagraphs = [],
  additionalInfoImage = null, // URL string or null
  isAnswerCorrect, // ← Destructure here
  submittedResult
}) => {
  // true or false
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openModal, setOpenModal] = React.useState(true);  // or false initially
  sessionStorage.setItem("isRevealed", "true");

  // for sample questionare result calculation
  const { sampleQuestionnaireResult, setSampleQuestionnaireResult } =
    useContext(SampleQuestionnaireResultContext);

  const hasUpdated = React.useRef(false);

  useEffect(() => {

    if (submittedResult?.result || hasUpdated.current) return;

    if (hasUpdated.current) return; // prevent second run
    hasUpdated.current = true;

    setSampleQuestionnaireResult(prev => ({
      ...prev,
      attemptedQuestion: prev.attemptedQuestion + 1,
      corrected: isAnswerCorrect ? prev.corrected + 1 : prev.corrected
    }));
  }, []);



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        pt:3
      }}
    >

      {/* ✅ Only show modal for NEW answers, not previous submissions */}
      {openModal && !submittedResult?.result && (
        <ResultModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          isAnswerCorrect={isAnswerCorrect}
        />
      )}


      {/* Left - Question & Explanation */}
      <Box
        sx={{
          flex: 2,
          
        }}
      >

        {/* Explanation heading (supports custom HTML) */}
        {explanationHeading && (
          <Typography
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
              textAlign: "center", fontSize: "20px"
            }}
            fontWeight={600}
            mb={1}
            color="#2E3760"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: explanationHeading }}
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
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}


        {/* Show heading only if there is real additional info */}
        {(additionalInfoParagraphs?.some(p => p.trim() !== "") || additionalInfoImage) && (
          <Typography
            sx={{
              fontSize: "17px",
              textAlign:"center"
            }}
            fontWeight={600}
            mt={3}
            mb={1}
            color="#2E3760"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: additionalInfoHeading }}
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
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}

        {/* Additional Info Image */}
        {additionalInfoImage && (
          <Box
            component="img"
            src={`${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}${additionalInfoImage}`}
            alt="Additional Info"
            sx={{ width: '100%', mt: 2, borderRadius: 2 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default RevealAnswerComponent;
